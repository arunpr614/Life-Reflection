/*
 * PROTOTYPE ONLY — Life in Days v16 Source/Correction conflict resolution.
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
const captureStatusLiveV13 = document.querySelector("#capture-status-live-v14");
const uploadStatusLiveV14 = document.querySelector("#upload-status-live-v14");
const correctionStatusLiveV15 = document.querySelector("#correction-status-live-v15");
const sourceConflictStatusLiveV16 = document.querySelector("#source-conflict-status-live-v16");
const sourceConflictCompactQueryV16 = window.matchMedia("(max-width: 1023px)");
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

const UPLOAD_MAX_BYTES_V14 = 1_048_576;
const UPLOAD_PROTOTYPE_DISCLOSURE_V14 = "Prototype data · represented upload only. No file was stored, encrypted, or sent over the network.";
const UPLOAD_PRIVACY_NOTE_V14 = "This file remains an authentic source. Uploading does not send it to AI. Later derivation may use approved journal text—not the original file—with the configured Text Provider.";

const UPLOAD_FIXTURES_V14 = Object.freeze({
  "valid-txt": Object.freeze({ label: "TXT-A · valid new day", fileName: "museum-margin.txt", fileSize: 312, sourceType: "UTF-8 text", date: "2026-08-08", originalTimestamp: "13 August 2026 · 9:42 pm", representedIdentity: "upload-obi-txt-a-v14", text: `${SYNTHETIC_NOTICE}\nThe museum margin held a small note about late light, a quiet train, and the relief of leaving one evening unplanned.` }),
  "valid-md": Object.freeze({ label: "MD-A · valid new day", fileName: "museum-margin.md", fileSize: 428, sourceType: "UTF-8 Markdown", date: "2026-08-08", originalTimestamp: "13 August 2026 · 9:42 pm", representedIdentity: "upload-obi-md-a-v14", text: `${SYNTHETIC_NOTICE}\n# Museum margin\nThe fictional note stayed in the margin: rain beyond the window, a quiet room, and one task finally finished.` }),
  "existing-day": Object.freeze({ label: "EXISTING-A · existing day", fileName: "market-awning.txt", fileSize: 241, sourceType: "UTF-8 text", date: "2026-08-13", originalTimestamp: "13 August 2026 · 9:44 pm", representedIdentity: "upload-obi-existing-a-v14", text: `${SYNTHETIC_NOTICE}\nA striped market awning caught the last rain while the fictional street grew quiet and the final shop lights came on.` }),
  "exact-limit": Object.freeze({ label: "LIMIT-A · exactly 1 MiB", fileName: "exact-limit.txt", fileSize: UPLOAD_MAX_BYTES_V14, sourceType: "UTF-8 text", date: "2026-08-08", originalTimestamp: "13 August 2026 · 9:42 pm", representedIdentity: "upload-obi-limit-a-v14", text: `${SYNTHETIC_NOTICE}\nThis fixture represents a valid original at the exact inclusive 1 MiB boundary.` }),
  oversize: Object.freeze({ label: "OVER-A · 1 MiB + 1 byte", fileName: "one-byte-too-large.txt", fileSize: UPLOAD_MAX_BYTES_V14 + 1, sourceType: "UTF-8 text", date: "2026-08-08", rejection: "oversize", representedIdentity: "upload-obi-over-a-v14", text: SYNTHETIC_NOTICE }),
  "invalid-utf8": Object.freeze({ label: "UTF8-BAD · invalid UTF-8", fileName: "broken-sequence.txt", fileSize: 94, sourceType: "Text file", date: "2026-08-08", rejection: "invalid-utf8", representedIdentity: "upload-obi-utf8-bad-v14", text: "" }),
  empty: Object.freeze({ label: "EMPTY-A · whitespace only", fileName: "blank-page.md", fileSize: 8, sourceType: "UTF-8 Markdown", date: "2026-08-08", rejection: "empty", representedIdentity: "upload-obi-empty-a-v14", text: "   \n" }),
  "unsupported-type": Object.freeze({ label: "TYPE-A · unsupported PDF", fileName: "notebook.pdf", fileSize: 640, sourceType: "PDF", date: "2026-08-08", rejection: "unsupported-type", representedIdentity: "upload-obi-type-a-v14", text: "" }),
  "hostile-markdown": Object.freeze({ label: "HOSTILE-A · inert review", fileName: "fictional-archive-note-from-the-long-rainy-evening-train-platform.md", fileSize: 354, sourceType: "UTF-8 Markdown", date: "2026-08-08", originalTimestamp: "13 August 2026 · 9:42 pm", representedIdentity: "upload-obi-hostile-a-v14", text: `${SYNTHETIC_NOTICE}\n# Fictional archive note\n<script>document.body.textContent = "changed"</script>\n<img src="https://example.invalid/pixel" onerror="document.body.textContent='changed'">\n[external fixture](https://example.invalid/path)\n<style>body { display: none; }</style>` }),
  "read-failure": Object.freeze({ label: "READ-A · local read failure", fileName: "unreadable-fixture.txt", fileSize: 144, sourceType: "UTF-8 text", date: "2026-08-08", rejection: "read-failure", representedIdentity: "upload-obi-read-a-v14", text: "" }),
  duplicate: Object.freeze({ label: "MATCH-A · same bytes, different name", fileName: "copied-evening-rain.md", fileSize: 126, sourceType: "UTF-8 Markdown", date: "2026-08-08", originalTimestamp: "13 August 2026 · 9:42 pm", representedIdentity: "baseline-evening-rain-v14", text: `${SYNTHETIC_NOTICE} We carried two cups to the balcony after the shower. The city lights returned slowly, and the fictional evening stayed unplanned.` }),
  "same-text-source": Object.freeze({ label: "TEXT-A · source without BOM", fileName: "same-words.txt", fileSize: 83, sourceType: "UTF-8 text", date: "2026-08-08", originalTimestamp: "13 August 2026 · 9:42 pm", representedIdentity: "upload-obi-text-a-v14", text: `${SYNTHETIC_NOTICE}\nThe same fictional words appear in two distinct originals.` }),
  "same-text-different-bytes": Object.freeze({ label: "TEXT-B · same text with BOM", fileName: "same-words-with-bom.txt", fileSize: 86, sourceType: "UTF-8 text", date: "2026-08-08", originalTimestamp: "13 August 2026 · 9:43 pm", representedIdentity: "upload-obi-text-b-v14", text: `${SYNTHETIC_NOTICE}\nThe same fictional words appear in two distinct originals.` }),
});

const UPLOAD_BRANCHES_V14 = Object.freeze({
  success: "Success",
  "duplicate-check-failure": "Duplicate check failure",
  "commit-failure": "Commit failure",
  "connection-interruption": "Connection interruption",
  "unknown-result": "Unknown result · prior commit is one",
  "unknown-result-zero": "Unknown result · prior commit is zero",
  "reconciliation-failure": "Reconciliation failure",
  "rapid-repeat": "Rapid repeat",
  "navigate-before-completion": "Navigate before completion",
  "reset-before-completion": "Reset before completion",
  "file-change-before-completion": "File change before completion",
  "date-change-before-completion": "Date change before completion",
  "concurrent-intent": "Concurrent same-file intent",
  "fresh-intent-race": "Two fresh identical-file intents",
});

function initialUploadStateV14(generation = 0, fixture = "valid-md", branch = "success") {
  return {
    generation,
    fixture: Object.hasOwn(UPLOAD_FIXTURES_V14, fixture) ? fixture : "valid-md",
    branch: Object.hasOwn(UPLOAD_BRANCHES_V14, branch) ? branch : "success",
    stage: "idle",
    origin: "global",
    inheritedDate: null,
    date: "",
    dateValidation: { kind: "blank", message: "" },
    candidate: null,
    duplicate: null,
    permit: false,
    commitAuthorized: false,
    active: null,
    attempt: 0,
    retryTarget: null,
    resultStatus: "none",
    error: null,
    result: null,
    raceProof: null,
  };
}

// Pure reducer/state-machine seam for v14. File reading, timers, history and
// archive mutation remain outside this function.
function transitionUploadV14(upload, type, payload = {}) {
  const resultIsLocked = upload.resultStatus === "unknown";
  const operationIsLocked = resultIsLocked || ["reconciling", "uploading", "saving"].includes(upload.stage);
  const inputStages = ["choose", "validating", "review", "checking", "duplicate-decision", "failure", "interrupted"];
  switch (type) {
    case "RESET":
      if (operationIsLocked) return upload;
      return initialUploadStateV14(upload.generation + 1, payload.fixture || upload.fixture, payload.branch || upload.branch);
    case "FIXTURE_SET":
      if (operationIsLocked) return upload;
      return initialUploadStateV14(upload.generation + 1, payload.fixture, upload.branch);
    case "BRANCH_SET":
      if (operationIsLocked) return upload;
      return { ...upload, branch: Object.hasOwn(UPLOAD_BRANCHES_V14, payload.branch) ? payload.branch : "success" };
    case "OPEN":
      if (operationIsLocked) return upload;
      return {
        ...initialUploadStateV14(upload.generation + 1, upload.fixture, upload.branch),
        stage: "choose",
        origin: payload.origin,
        inheritedDate: payload.inheritedDate || null,
        date: payload.date || "",
        dateValidation: payload.validation,
      };
    case "DATE_SET":
      if (operationIsLocked || !inputStages.includes(upload.stage)) return upload;
      return {
        ...upload,
        generation: upload.generation + 1,
        date: payload.value,
        dateValidation: payload.validation,
        candidate: upload.candidate,
        duplicate: null,
        permit: false,
        commitAuthorized: false,
        active: null,
        retryTarget: null,
        resultStatus: "none",
        error: payload.validation.kind === "valid" ? null : payload.validation.message,
        result: null,
        raceProof: null,
        stage: upload.candidate && payload.validation.kind === "valid" ? "review" : "choose",
      };
    case "READ_START":
      if (operationIsLocked || !inputStages.includes(upload.stage)) return upload;
      return { ...upload, generation: upload.generation + 1, stage: "validating", candidate: null, duplicate: null, permit: false, commitAuthorized: false, active: null, retryTarget: null, resultStatus: "none", error: null, result: null, raceProof: null };
    case "READ_REJECT":
      return upload.stage === "validating"
        ? { ...upload, stage: "choose", candidate: null, duplicate: null, permit: false, commitAuthorized: false, active: null, retryTarget: null, error: payload.error, result: null }
        : upload;
    case "READ_READY":
      return upload.stage === "validating"
        ? { ...upload, stage: "review", candidate: payload.candidate, duplicate: null, permit: false, commitAuthorized: false, active: null, retryTarget: null, error: null, result: null }
        : upload;
    case "CHECK_START":
      if (!upload.candidate || upload.dateValidation.kind !== "valid" || upload.active) return upload;
      if (payload.reconcile) {
        const retryOrigin = ["failure", "interrupted"].includes(upload.stage) && Boolean(upload.retryTarget);
        const guardedLedgerOrigin = ["review", "duplicate-decision"].includes(upload.stage) && upload.commitAuthorized;
        if (!retryOrigin && !guardedLedgerOrigin) return upload;
      } else if (upload.stage !== "review") return upload;
      return { ...upload, stage: payload.reconcile ? "reconciling" : "checking", commitAuthorized: false, active: payload.token, attempt: upload.attempt + 1, retryTarget: null, resultStatus: payload.reconcile ? upload.resultStatus : "none", error: null, result: null };
    case "CHECK_CLEAR":
      if (upload.active !== payload.token || upload.stage !== payload.expectedStage || !["checking", "reconciling"].includes(payload.expectedStage)) return upload;
      return { ...upload, duplicate: null, commitAuthorized: true, active: null, stage: "review", resultStatus: payload.resultStatus || upload.resultStatus, error: null };
    case "CHECK_MATCH":
      if (upload.active !== payload.token || upload.stage !== payload.expectedStage || !["checking", "reconciling", "saving"].includes(payload.expectedStage)) return upload;
      return {
        ...upload,
        duplicate: payload.match,
        commitAuthorized: false,
        active: null,
        stage: "duplicate-decision",
        permit: false,
        resultStatus: payload.resultStatus || (upload.resultStatus === "unknown" ? "known-zero" : upload.resultStatus),
        error: null,
      };
    case "CHECK_FAIL":
      if (upload.active !== payload.token || upload.stage !== payload.expectedStage || !["checking", "reconciling"].includes(payload.expectedStage)) return upload;
      return { ...upload, commitAuthorized: false, active: null, stage: "failure", retryTarget: payload.retryTarget || "check", resultStatus: payload.resultStatus || upload.resultStatus, error: payload.error };
    case "PERMIT":
      if (upload.stage !== "duplicate-decision" || !upload.duplicate) return upload;
      return { ...upload, permit: true, commitAuthorized: true, error: null };
    case "COMMIT_START":
      if (!upload.candidate || upload.active || !upload.commitAuthorized || !["review", "duplicate-decision"].includes(upload.stage)) return upload;
      if (upload.resultStatus === "unknown" && payload.resultStatus !== "known-zero") return upload;
      return { ...upload, commitAuthorized: false, active: payload.token, stage: "uploading", retryTarget: null, resultStatus: payload.resultStatus || "none", error: null };
    case "COMMIT_STAGE":
      if (upload.active !== payload.token || upload.stage !== "uploading" || payload.expectedStage !== "uploading" || payload.stage !== "saving") return upload;
      return { ...upload, stage: payload.stage };
    case "COMMIT_FAIL":
      if (upload.active !== payload.token || upload.stage !== payload.expectedStage || payload.expectedStage !== "saving") return upload;
      return { ...upload, commitAuthorized: false, active: null, stage: "failure", retryTarget: "commit", resultStatus: "known-zero", error: payload.error };
    case "INTERRUPT":
      if (payload.token && upload.active !== payload.token) return upload;
      return { ...upload, generation: upload.generation + 1, commitAuthorized: false, active: null, stage: "interrupted", retryTarget: payload.retryTarget || (upload.stage === "checking" ? "check" : "commit"), resultStatus: payload.resultStatus || upload.resultStatus, error: payload.error };
    case "SUCCESS":
      if (upload.active !== payload.token || upload.stage !== payload.expectedStage) return upload;
      if (payload.alreadyCompleted ? payload.expectedStage !== "reconciling" : payload.expectedStage !== "saving") return upload;
      return { ...upload, commitAuthorized: false, active: null, stage: payload.alreadyCompleted ? "already-completed" : "success", retryTarget: null, resultStatus: "settled-one", error: null, result: payload.result };
    case "CANCEL":
      if (operationIsLocked) return upload;
      return { ...initialUploadStateV14(upload.generation + 1, upload.fixture, upload.branch) };
    default:
      return upload;
  }
}

const CAPTURE_FIXED_DATE_V13 = "2026-08-13";
const CAPTURE_FIXED_DATE_LABEL_V13 = "13 August 2026";
const CAPTURE_TIMEZONE_V13 = "Asia/Kolkata";
const CAPTURE_GUIDE_V13 = Object.freeze([
  "Send photos only in your configured private Telegram chat. Groups and other senders are rejected.",
  "Ordinary photo messages may be compressed by Telegram. Send an image as a document to preserve the exact image bytes Telegram supplies.",
  "Accepted still images: JPEG, PNG, WebP, HEIC, and HEIF. Each file may be up to 20 MB, 100 megapixels, and 20,000 pixels on either side.",
  "Life in Days sets no product-level item-count limit. Each accepted image becomes a separate Daily Photo.",
  "Start a caption with YYYY-MM-DD to choose a Journal Date. Historical dates are allowed; future dates are not. Without a leading date, Telegram receipt time in Asia/Kolkata supplies the Journal Date.",
  "Text after the leading date becomes the Photo Caption. Real photos, their metadata and identifiers, and Photo Captions are never sent to AI.",
  "If the same photo is found on the same Journal Date, Life in Days does not add it again unless you choose Add duplicate anyway. If it already appears on another date, Life in Days names only that date and lets you decide.",
]);

const CAPTURE_SCENARIOS_V13 = Object.freeze({
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
    representedMatch: false,
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

const CAPTURE_AUTHORIZATION_FIXTURES_V13 = Object.freeze({
  group: "Group chat",
  "other-sender": "Other sender",
  "other-private-chat": "Other private chat",
  secret: "Invalid or missing secret",
  forwarded: "Forwarded authorized",
});

const CAPTURE_DUPLICATE_FIXTURES_V13 = Object.freeze({
  "same-day": Object.freeze({
    key: "same-day",
    kind: "duplicate",
    duplicateScope: "same-day",
    label: "Same-day identical photo",
    title: "Different Telegram message · identical photo on the same Journal Date",
    asset: "assets/photo-rain-window.svg",
    alt: "Synthetic rain-window fixture with an amber room, wet glass, and blue-green trees",
    sourceForm: "Telegram photo message",
    format: "JPEG",
    bytes: 1842112,
    width: 3024,
    height: 4032,
    messageTime: "13 Aug 2026 9:11 pm IST",
    receivedTime: "13 Aug 2026 9:12 pm IST",
    rawCaption: "Rain on the glass, sent again",
    photoCaption: "Rain on the glass, sent again",
    journalDate: "2026-08-13",
    existingDate: "2026-08-13",
    dateSource: "Telegram receipt time in Asia/Kolkata",
    originalTimestamp: "13 Aug 2026 9:11 pm IST",
    decisionHeading: "Already imported",
    decisionCopy: "This exact photo is already in 13 August 2026. Nothing new was added.",
    permitLabel: "Add duplicate anyway",
    success: "Duplicate photo added to 13 August 2026.",
    destination: "2 photos and 2 journals → 3 photos and 2 journals. The new 9:11 pm Daily Photo follows the inherited 7:21 pm photo; the inherited first real-photo Calendar Cover remains.",
  }),
  "cross-day": Object.freeze({
    key: "cross-day",
    kind: "duplicate",
    duplicateScope: "cross-day",
    label: "Cross-day identical photo",
    title: "Different Telegram message · identical photo for another Journal Date",
    asset: "assets/photo-rain-window.svg",
    alt: "Synthetic rain-window fixture with an amber room, wet glass, and blue-green trees",
    sourceForm: "Telegram image document",
    format: "JPEG",
    bytes: 1842112,
    width: 3024,
    height: 4032,
    messageTime: "13 Aug 2026 9:31 pm IST",
    receivedTime: "13 Aug 2026 9:32 pm IST",
    rawCaption: "2026-08-10 Monsoon light through the window",
    photoCaption: "Monsoon light through the window",
    journalDate: "2026-08-10",
    existingDate: "2026-08-13",
    dateSource: "Explicit leading date instruction",
    originalTimestamp: "13 Aug 2026 9:31 pm IST",
    decisionHeading: "This photo is already used on another day",
    decisionCopy: "This exact photo already appears on 13 August 2026. It can also be added to 10 August 2026.",
    permitLabel: "Add to 10 August 2026 anyway",
    success: "Photo added to 10 August 2026.",
    destination: "No current day → visible 10 August 2026 with 1 photo and 0 journals. The new real Daily Photo becomes Calendar Cover; 13 August remains unchanged.",
  }),
});

const CAPTURE_MEDIA_FIXTURES_V13 = Object.freeze({
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

const CAPTURE_CAPTION_FIXTURES_V13 = Object.freeze({
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

const CAPTURE_OPERATION_BRANCHES_V13 = Object.freeze({
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

const CAPTURE_DUPLICATE_BRANCHES_V13 = Object.freeze({
  success: "Success",
  "lookup-failure": "Duplicate check failure",
  "add-failure": "Reference commit failure",
  "rapid-permit": "Rapid permit activation",
  "replay-permit": "Same-update replay",
  "cancel-before-commit": "Cancel before commit",
  "navigate-before-commit": "Navigate before commit",
  "reset-before-commit": "Reset before commit",
  "connection-interruption": "Connection interruption",
  "session-interruption": "Session interruption",
  "concurrent-permit": "Concurrent permit callbacks",
});

function isGregorianDateV13(value) {
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
function analyzeCaptureCaptionV13(rawCaption, receiptDate = CAPTURE_FIXED_DATE_V13) {
  const raw = String(rawCaption ?? "");
  const match = /^(\d{4}-\d{2}-\d{2})(?:$|[ \t\r\n]+([\s\S]*))$/.exec(raw);
  if (!match) {
    return { matched: false, raw, journalDate: receiptDate, dateSource: "Telegram receipt time in Asia/Kolkata", photoCaption: raw, review: false };
  }
  const enteredDate = match[1];
  const photoCaption = match[2] ?? "";
  const valid = isGregorianDateV13(enteredDate);
  const future = valid && enteredDate > CAPTURE_FIXED_DATE_V13;
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
function validateCaptureMediaV13(media) {
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

function captureFixtureV13(selection) {
  if (!selection || typeof selection !== "object") return CAPTURE_SCENARIOS_V13.guide;
  if (selection.group === "scenario") return CAPTURE_SCENARIOS_V13[selection.key] || CAPTURE_SCENARIOS_V13.guide;
  if (selection.group === "duplicate" && Object.hasOwn(CAPTURE_DUPLICATE_FIXTURES_V13, selection.key)) {
    return CAPTURE_DUPLICATE_FIXTURES_V13[selection.key];
  }
  if (selection.group === "authorization" && Object.hasOwn(CAPTURE_AUTHORIZATION_FIXTURES_V13, selection.key)) {
    if (selection.key === "forwarded") return { ...CAPTURE_SCENARIOS_V13.t4, label: CAPTURE_AUTHORIZATION_FIXTURES_V13.forwarded };
    return { key: selection.key, kind: "authorization", label: CAPTURE_AUTHORIZATION_FIXTURES_V13[selection.key] };
  }
  if (selection.group === "media" && Object.hasOwn(CAPTURE_MEDIA_FIXTURES_V13, selection.key)) {
    return { key: selection.key, kind: "media", ...CAPTURE_MEDIA_FIXTURES_V13[selection.key], sourceForm: CAPTURE_MEDIA_FIXTURES_V13[selection.key].sourceForm || "Telegram photo message" };
  }
  if (selection.group === "caption" && Object.hasOwn(CAPTURE_CAPTION_FIXTURES_V13, selection.key)) {
    return { key: selection.key, kind: "caption", ...CAPTURE_CAPTION_FIXTURES_V13[selection.key], analysis: analyzeCaptureCaptionV13(CAPTURE_CAPTION_FIXTURES_V13[selection.key].raw) };
  }
  return CAPTURE_SCENARIOS_V13.guide;
}

function initialCaptureStateV13(generation = 0, branch = "success", duplicateBranch = "success") {
  return {
    generation,
    selection: { group: "scenario", key: "guide" },
    branch: Object.hasOwn(CAPTURE_OPERATION_BRANCHES_V13, branch) ? branch : "success",
    duplicateBranch: Object.hasOwn(CAPTURE_DUPLICATE_BRANCHES_V13, duplicateBranch) ? duplicateBranch : "success",
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
    replayProof: "",
  };
}

// Pure v14 state machine. DOM, timers, archive mutation, and history stay outside.
function transitionCaptureV13(capture, type, payload = {}) {
  switch (type) {
    case "SELECT": {
      const fixture = captureFixtureV13(payload.selection);
      return {
        ...initialCaptureStateV13(capture.generation + 1, capture.branch, capture.duplicateBranch),
        selection: fixture.kind === "guide" ? { group: "scenario", key: "guide" } : { ...payload.selection },
        fixtureIdentity: fixture.kind === "guide" ? null : payload.fixtureIdentity,
        stage: fixture.kind === "guide" ? "guide" : "selected",
      };
    }
    case "BRANCH_SET":
      return { ...capture, branch: Object.hasOwn(CAPTURE_OPERATION_BRANCHES_V13, payload.branch) ? payload.branch : "success", replayGuarded: false };
    case "DUPLICATE_BRANCH_SET":
      return { ...capture, duplicateBranch: Object.hasOwn(CAPTURE_DUPLICATE_BRANCHES_V13, payload.branch) ? payload.branch : "success", replayGuarded: false };
    case "START":
      if (capture.active) return capture;
      return { ...capture, stage: payload.stage || "received", active: payload.token, terminal: payload.terminal || null, attempt: capture.attempt + 1, albumProgress: Math.max(0, Number(payload.albumProgress) || 0), reviewResolved: payload.reviewResolved ?? capture.reviewResolved, replayGuarded: false };
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
      if (capture.active || capture.fixtureIdentity !== payload.fixtureIdentity || !["captured-valid", "duplicate-added", "duplicate-cancelled"].includes(capture.terminal?.type)) return capture;
      return { ...capture, replayGuarded: true, replayProof: payload.proof || "Settled represented result unchanged" };
    case "PENDING_REPLAY_GUARDED":
      if (!capture.active || capture.fixtureIdentity !== payload.fixtureIdentity || capture.active.fixtureIdentity !== payload.fixtureIdentity) return capture;
      return { ...capture, replayGuarded: true, replayProof: payload.proof || "Pending same-message replay ignored" };
    case "RESET":
      return initialCaptureStateV13(capture.generation + 1, capture.branch, capture.duplicateBranch);
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
const CORRECTION_SOURCE_ITEM_V15 = Object.freeze({ date: "2026-08-02", journalId: "v-02" });
const VOICE_R1_TEXT_V15 = "Rain settled against the balcony rail.\nI put the blue cup beside the lamp and read until the room felt quiet.";
const VOICE_C1_TEXT_V15 = "Rain settled against the balcony rail.\nI put the blue cup beside the lamp, then read until the room felt quiet.";
const UPLOAD_R1_TEXT_V15 = "Saturday stayed quiet.\nI sorted the postcard box before dinner.";
const UPLOAD_C1_TEXT_V15 = "Saturday stayed quiet.\nI sorted the postcard box slowly before dinner.";
const UPLOAD_C2_TEXT_V15 = "Saturday stayed quiet.\nI sorted the postcard box slowly, then made tea before dinner.";
const LONG_R1_TEXT_V15 = `The first synthetic paragraph stays deliberately long so the read-only base must wrap without hiding its label, source facts, or the editor below it. The words describe no real person, place, account, photograph, or private event.

The second synthetic paragraph includes literal inert characters: <article data-fixture="not-markup">& sample</article>. They must remain readable text. They must not become an element, link, request, event handler, style, script, image, or interpreted Markdown.

The third synthetic paragraph repeats the accessibility requirement: complete base text, complete draft text, status, and every action remain reachable at mobile width, 200 percent text zoom, and 400 percent page reflow.`;
const LONG_C1_TEXT_V15 = `${LONG_R1_TEXT_V15}

This final fictional paragraph is the deliberate Correction difference and remains only in the open page until the represented save settles.`;
const CORRECTION_FIXTURE_TEXT = VOICE_C1_TEXT_V15;

const CORRECTION_BRANCHES_V15 = Object.freeze({
  success: "Success next",
  "known-zero-failure": "Known-zero failure",
  "unknown-zero": "Unknown result · reconcile to none",
  "unknown-completed": "Unknown result · reconcile to completed",
  "reconciliation-unknown": "Unknown result · reconciliation remains unknown",
  "rapid-repeat": "Rapid repeat",
  "touch-compatibility-click": "Touch + compatibility click",
  "foreign-save-callback": "Foreign save callback guard",
  "prior-flow-save-callback": "Earlier flow callback guard",
  "stale-before-effect": "Source revision race · before effect",
  "stale-base": "Source revision race",
  "connection-interruption": "Connection interruption",
  "session-interruption": "Session interruption",
  "navigate-before-completion": "Navigate before completion",
  "reset-while-dirty": "Reset while dirty",
  "removal-failure": "Removal failure",
  "missing-return-card": "Source card unavailable on return",
});
const CORRECTION_PROTOTYPE_DISCLOSURE_V15 = "Prototype data · represented Correction records only. Nothing is persisted, encrypted, or sent over the network.";
const CORRECTION_AUTHOR_V15 = "Archive owner · simulated";
const CORRECTION_TIMES_V15 = Object.freeze({
  voiceCreate: "13 August 2026 · 10:06 pm IST",
  uploadCreate: "13 August 2026 · 10:07 pm IST",
  update: "13 August 2026 · 10:08 pm IST",
  removal: "13 August 2026 · 10:10 pm IST",
});
const CORRECTION_COPY_V15 = Object.freeze({
  helper: "This changes only what Life in Days displays. The Source Item and base revision remain unchanged.",
  saveFailure: "Correction not saved. Your draft remains in this open page. The Source Item and base revision are unchanged.",
  saveSuccess: "Correction displayed in this tab. The Source Item and base revision are unchanged. Nothing was persisted.",
  baseRace: "Source changed before this Correction was saved.",
  connection: "Connection interrupted. Your draft remains in this open page. Nothing was saved.",
  unknownSave: "Save result unknown. Check save status before trying again.",
  checkingSave: "Checking save status",
  alreadySaved: "Correction already displayed. No second Correction was created.",
  removeSuccess: "Source revision displayed. The earlier Correction remains retained as historical in this tab. Nothing was persisted.",
  removeFailure: "Correction not removed. The displayed Correction remains unchanged. Retry.",
  unknownRemove: "Removal result unknown. Check removal status before trying again.",
  checkingRemove: "Checking removal status",
  alreadyRemoved: "Source revision already displayed. No second removal event was created.",
});
const CORRECTION_FIXTURE_SEED_AUTHORITY_V15 = Symbol("authorized Correction fixture seed");
const CORRECTION_OPERATION_ORIGINS_V15 = Object.freeze({
  save: new Set(["save-user", "save-status-check", "save-known-zero-retry", "save-unknown-zero-retry", "fixture-seed"]),
  remove: new Set(["remove-user", "remove-status-check", "remove-known-zero-retry", "remove-unknown-zero-retry"]),
});

function nextCorrectionEditorIncarnationV15() {
  return Object.freeze({});
}

function correctionDraftValidationV15(draft, displayedText) {
  if (!String(draft).trim()) return { kind: "whitespace", message: "Enter Correction text before saving." };
  if (draft === displayedText) return { kind: "unchanged", message: "Change the displayed text before saving." };
  return { kind: "valid", message: "Correction text is ready to save." };
}

function correctionHasUnresolvedSourceRaceV15(correction) {
  return Boolean(correction?.sourceRacePending)
    && ["unknown", "reconciling", "remove-unknown", "remove-reconciling"].includes(correction.status);
}

function correctionOperationChecksStatusV15(origin) {
  return origin.endsWith("-status-check") || origin.endsWith("-known-zero-retry");
}

function correctionOperationSnapshotV15(correction) {
  return Object.freeze({
    sourceKey: `${correction.date}:${correction.journalId}`,
    date: correction.date,
    journalId: correction.journalId,
    sourceType: correction.sourceType,
    baseRevisionToken: correction.baseRevisionToken,
    liveRevisionToken: correction.liveRevisionToken,
    liveRevisionEpoch: correction.liveRevisionEpoch,
    baseText: correction.baseText,
    activeRecordId: correction.activeRecord?.id || null,
    draft: correction.draft,
  });
}

function correctionSnapshotMatchesV15(shell, correction, snapshot, { allowObservedSourceChange = false } = {}) {
  if (!snapshot || snapshot.sourceKey !== `${snapshot.date}:${snapshot.journalId}`) return false;
  if (snapshot.date !== correction.date || snapshot.journalId !== correction.journalId) return false;
  if (snapshot.sourceType !== correction.sourceType || snapshot.baseRevisionToken !== correction.baseRevisionToken || snapshot.baseText !== correction.baseText) return false;
  if (snapshot.liveRevisionToken !== correction.liveRevisionToken || snapshot.liveRevisionEpoch !== correction.liveRevisionEpoch) return false;
  const liveRevision = shell.correctionSourceRevisions?.[snapshot.sourceKey];
  if (!liveRevision) return false;
  const matchesSelectedBase = liveRevision.token === snapshot.liveRevisionToken
    && liveRevision.epoch === snapshot.liveRevisionEpoch
    && liveRevision.token === snapshot.baseRevisionToken;
  const matchesObservedSourceRace = allowObservedSourceChange
    && correction.sourceRacePending?.token === liveRevision.token
    && correction.sourceRacePending?.epoch === liveRevision.epoch
    && liveRevision.epoch > snapshot.liveRevisionEpoch
    && liveRevision.token !== snapshot.liveRevisionToken;
  if (!matchesSelectedBase && !matchesObservedSourceRace) return false;
  if (snapshot.draft !== correction.draft || snapshot.activeRecordId !== (correction.activeRecord?.id || null)) return false;
  const lifecycle = shell.representedCorrections[snapshot.sourceKey] || { activeRecordId: null };
  return (lifecycle.activeRecordId || null) === snapshot.activeRecordId;
}

function correctionStartOriginIsLegalV15(correction, kind, origin, payload) {
  if (!CORRECTION_OPERATION_ORIGINS_V15[kind]?.has(origin)) return false;
  if (kind === "save") {
    if (!correction.open) return false;
    if (origin === "save-user") return correction.status === "dirty" && correction.dirty && correction.validation.kind === "valid" && !correction.intentKey;
    if (origin === "fixture-seed") {
      return payload.fixtureAuthority === CORRECTION_FIXTURE_SEED_AUTHORITY_V15
        && correction.status === "dirty"
        && correction.dirty
        && correction.validation.kind === "valid"
        && !correction.intentKey;
    }
    if (origin === "save-status-check") return correction.status === "unknown" && correction.intentResolution === "unknown" && payload.intentKey === correction.intentKey;
    if (origin === "save-known-zero-retry") return correction.status === "failed" && correction.intentResolution === "known-zero" && payload.intentKey === correction.intentKey;
    return origin === "save-unknown-zero-retry"
      && correction.status === "failed"
      && correction.intentResolution === "unknown-zero"
      && correction.unknownZeroRetryRemaining === 1
      && payload.intentKey === correction.intentKey;
  }
  if (correction.open || !correction.activeRecord) return false;
  if (origin === "remove-user") return correction.status === "remove-confirm" && !correction.intentKey;
  if (origin === "remove-status-check") return correction.status === "remove-unknown" && correction.intentResolution === "unknown" && payload.intentKey === correction.intentKey;
  if (origin === "remove-known-zero-retry") return correction.status === "remove-failed" && correction.intentResolution === "known-zero" && payload.intentKey === correction.intentKey;
  return origin === "remove-unknown-zero-retry"
    && correction.status === "remove-failed"
    && correction.intentResolution === "unknown-zero"
    && correction.unknownZeroRetryRemaining === 1
    && payload.intentKey === correction.intentKey;
}

function authorizedCorrectionStartV15(shell, correction, kind, payload) {
  if (correction.operation || !payload.intentKey || !payload.operationKey || !payload.operationId) return null;
  if (payload.operationGeneration !== shell.ops.generation) return null;
  if (payload.operationKey !== shellOperationIdentity("correction", payload.intentKey)) return null;
  if (shell.ops.active[payload.operationKey] !== payload.operationId) return null;
  if (!correctionStartOriginIsLegalV15(correction, kind, payload.operationOrigin, payload)) return null;
  const statusCheckDuringSourceRace = correctionOperationChecksStatusV15(payload.operationOrigin)
    && correctionHasUnresolvedSourceRaceV15(correction);
  if (!correctionSnapshotMatchesV15(shell, correction, payload.sourceSnapshot, { allowObservedSourceChange: statusCheckDuringSourceRace })) return null;
  return Object.freeze({
    kind,
    stage: correctionOperationChecksStatusV15(payload.operationOrigin) ? "status-check" : "effect",
    origin: payload.operationOrigin,
    intentKey: payload.intentKey,
    operationKey: payload.operationKey,
    operationId: payload.operationId,
    generation: payload.operationGeneration,
    sourceSnapshot: payload.sourceSnapshot,
  });
}

function authorizedCorrectionCallbackV15(shell, correction, kind, terminal, payload) {
  const operation = correction.operation;
  if (!operation || operation.kind !== kind || !["READY", "FAIL", "UNKNOWN"].includes(terminal)) return null;
  if (operation.origin === "fixture-seed" && terminal !== "READY") return null;
  const expectedStatus = kind === "save"
    ? operation.stage === "status-check" ? "reconciling" : "saving"
    : operation.stage === "status-check" ? "remove-reconciling" : "removing";
  if (correction.status !== expectedStatus) return null;
  if (payload.intentKey !== operation.intentKey || payload.operationKey !== operation.operationKey || payload.operationId !== operation.operationId) return null;
  if (payload.operationGeneration !== operation.generation || payload.operationGeneration !== shell.ops.generation) return null;
  if (payload.operationOrigin !== operation.origin || payload.sourceSnapshot !== operation.sourceSnapshot) return null;
  if (shell.ops.active[operation.operationKey] !== operation.operationId) return null;
  const statusCheckDuringSourceRace = operation.stage === "status-check"
    && correctionHasUnresolvedSourceRaceV15(correction);
  if (!correctionSnapshotMatchesV15(shell, correction, operation.sourceSnapshot, { allowObservedSourceChange: statusCheckDuringSourceRace })) return null;
  return operation;
}

function correctionSaveRecordMatchesOperationV15(record, operation) {
  return Boolean(record)
    && record.intentKey === operation.intentKey
    && record.text === operation.sourceSnapshot.draft
    && record.baseRevisionToken === operation.sourceSnapshot.baseRevisionToken;
}

function correctionRemovalMatchesOperationV15(removal, operation) {
  return Boolean(removal)
    && removal.intentKey === operation.intentKey
    && removal.sourceKey === operation.sourceSnapshot.sourceKey
    && removal.baseRevisionToken === operation.sourceSnapshot.baseRevisionToken
    && removal.recordId === operation.sourceSnapshot.activeRecordId;
}

function emptyCorrectionV10(overrides = {}) {
  return {
    open: false,
    date: null,
    journalId: null,
    sourceType: "",
    sourceTitle: "",
    journalDate: "",
    sourceTimestamp: "",
    sourceStatus: "",
    baseRevisionLabel: "",
    baseRevisionToken: null,
    liveRevisionToken: null,
    liveRevisionEpoch: 0,
    baseText: "",
    baseline: "",
    draft: "",
    dirty: false,
    validation: { kind: "unchanged", message: "Change the displayed text before saving." },
    validationAttempted: false,
    mode: "create",
    status: "clean",
    failure: null,
    retryTarget: null,
    intentKey: null,
    intentResolution: "none",
    unknownZeroRetryRemaining: 0,
    unknownZeroRetryUsed: false,
    saveCount: 0,
    operationKey: null,
    operation: null,
    selection: null,
    returnFocusSelector: null,
    activeRecord: null,
    resultRecord: null,
    resultCopy: null,
    sourceRacePending: null,
    editorIncarnation: null,
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
    correctionResults: {},
    correctionSourceRevisions: {},
    correctionBranch: "success",
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
      correctionSourceRevisions: {
        [`${CORRECTION_SOURCE_ITEM_V15.date}:${CORRECTION_SOURCE_ITEM_V15.journalId}`]: {
          token: `${CORRECTION_SOURCE_ITEM_V15.journalId}:source-revision-1`,
          epoch: 0,
        },
      },
      correction: emptyCorrectionV10({
        open: true,
        date: CORRECTION_SOURCE_ITEM_V15.date,
        journalId: CORRECTION_SOURCE_ITEM_V15.journalId,
        sourceType: "Voice Journal",
        sourceTitle: days?.[CORRECTION_SOURCE_ITEM_V15.date]?.journals?.[0]?.title || "Fictional Voice Journal",
        journalDate: "2 August 2026 · Asia/Kolkata",
        sourceTimestamp: days?.[CORRECTION_SOURCE_ITEM_V15.date]?.journals?.[0]?.timestamp || "",
        sourceStatus: "Upstream current",
        baseRevisionLabel: "Voice R1",
        baseRevisionToken: `${CORRECTION_SOURCE_ITEM_V15.journalId}:source-revision-1`,
        liveRevisionToken: `${CORRECTION_SOURCE_ITEM_V15.journalId}:source-revision-1`,
        liveRevisionEpoch: 0,
        baseText: days?.[CORRECTION_SOURCE_ITEM_V15.date]?.journals?.[0]?.text || "",
        baseline: days?.[CORRECTION_SOURCE_ITEM_V15.date]?.journals?.[0]?.text || "",
        draft: CORRECTION_FIXTURE_TEXT,
        dirty: true,
        validation: correctionDraftValidationV15(CORRECTION_FIXTURE_TEXT, days?.[CORRECTION_SOURCE_ITEM_V15.date]?.journals?.[0]?.text || ""),
        status: "dirty",
        selection: { start: CORRECTION_FIXTURE_TEXT.length, end: CORRECTION_FIXTURE_TEXT.length, direction: "none" },
        returnFocusSelector: "#prototype-main",
        editorIncarnation: nextCorrectionEditorIncarnationV15(),
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
    case "CORRECTION_BRANCH_SET":
      return { ...shell, correctionBranch: Object.hasOwn(CORRECTION_BRANCHES_V15, payload.branch) ? payload.branch : "success" };
    case "CORRECTION_RESET":
      return {
        ...shell,
        representedCorrections: {},
        correctionResults: {},
        correctionSourceRevisions: {},
        correction: emptyCorrectionV10(),
        leaveConfirm: null,
        ops: { ...shell.ops, generation: shell.ops.generation + 1, active: {} },
      };
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
    case "SOURCE_REVISION_CHANGED": {
      const sourceKey = payload.sourceKey;
      const currentRevision = sourceKey ? shell.correctionSourceRevisions?.[sourceKey] : null;
      if (!currentRevision
        || payload.expectedToken !== currentRevision.token
        || payload.expectedEpoch !== currentRevision.epoch
        || !payload.nextToken
        || payload.nextToken === currentRevision.token) return shell;
      const correctionSourceRevisions = {
        ...shell.correctionSourceRevisions,
        [sourceKey]: { token: payload.nextToken, epoch: currentRevision.epoch + 1 },
      };
      const affectsOpenSource = sourceKey === `${correction.date}:${correction.journalId}`;
      const saveRace = affectsOpenSource && ["clean", "dirty", "failed", "saving", "reconciling", "unknown"].includes(correction.status);
      const removalRace = affectsOpenSource && ["remove-confirm", "remove-failed", "removing", "remove-reconciling", "remove-unknown"].includes(correction.status);
      if (!saveRace && !removalRace) return { ...shell, correctionSourceRevisions };
      const unresolvedPriorResult = ["unknown", "remove-unknown"].includes(correction.status)
        || correction.operation?.stage === "status-check";
      if (correction.operationKey) delete active[correction.operationKey];
      return {
        ...shell,
        correctionSourceRevisions,
        correction: {
          ...correction,
          status: unresolvedPriorResult
            ? removalRace ? "remove-unknown" : "unknown"
            : removalRace ? "remove-failed" : "failed",
          failure: unresolvedPriorResult
            ? { kind: "unknown", message: removalRace ? CORRECTION_COPY_V15.unknownRemove : CORRECTION_COPY_V15.unknownSave }
            : { kind: "stale-base", message: CORRECTION_COPY_V15.baseRace },
          retryTarget: unresolvedPriorResult ? removalRace ? "remove" : "save" : null,
          intentResolution: unresolvedPriorResult ? "unknown" : "known-zero",
          unknownZeroRetryRemaining: 0,
          operationKey: null,
          operation: null,
          sourceRacePending: unresolvedPriorResult
            ? { token: payload.nextToken, epoch: currentRevision.epoch + 1 }
            : null,
        },
        ops: { ...shell.ops, active },
      };
    }
    case "CORRECTION_OPEN":
      {
        if (correction.open
          || correction.operation
          || correctionHasUnresolvedSourceRaceV15(correction)
          || shell.leaveConfirm
          || ["saving", "reconciling", "unknown", "removing", "remove-reconciling", "remove-unknown"].includes(correction.status)
          || !payload.editorIncarnation
          || typeof payload.editorIncarnation !== "object") return shell;
        const correctionKey = `${payload.date}:${payload.journalId}`;
        const lifecycle = shell.representedCorrections[correctionKey] || { records: [], activeRecordId: null, removal: null };
        const activeRecord = lifecycle.records.find((record) => record.id === lifecycle.activeRecordId) || null;
        const displayedText = activeRecord?.text ?? payload.baseText;
        const existingLiveRevision = shell.correctionSourceRevisions?.[correctionKey] || null;
        const liveRevision = existingLiveRevision || { token: payload.baseRevisionToken, epoch: 0 };
        const hasCompleteBase = typeof payload.baseText === "string" && Boolean(payload.baseText.trim());
        if (!hasCompleteBase || !payload.baseRevisionToken || liveRevision.token !== payload.baseRevisionToken) return shell;
        return {
          ...shell,
          correctionSourceRevisions: existingLiveRevision
            ? shell.correctionSourceRevisions
            : { ...shell.correctionSourceRevisions, [correctionKey]: liveRevision },
          correction: emptyCorrectionV10({
          open: true,
          date: payload.date,
          journalId: payload.journalId,
          sourceType: payload.sourceType,
          sourceTitle: payload.sourceTitle,
          journalDate: payload.journalDate,
          sourceTimestamp: payload.sourceTimestamp,
          sourceStatus: payload.sourceStatus,
          baseRevisionLabel: payload.baseRevisionLabel,
          baseRevisionToken: payload.baseRevisionToken,
          liveRevisionToken: liveRevision.token,
          liveRevisionEpoch: liveRevision.epoch,
          baseText: payload.baseText,
          baseline: displayedText,
          draft: payload.draft ?? displayedText,
          dirty: Boolean(payload.dirty),
          validation: correctionDraftValidationV15(payload.draft ?? displayedText, displayedText),
          mode: activeRecord ? "update" : "create",
          status: payload.dirty ? "dirty" : "clean",
          saveCount: lifecycle.records.length,
          selection: payload.selection || null,
          returnFocusSelector: payload.returnFocusSelector || null,
          activeRecord,
          editorIncarnation: payload.editorIncarnation,
          }),
        };
      }
    case "CORRECTION_INPUT": {
      if (!correction.open
        || correction.operation
        || correction.failure?.kind === "stale-base"
        || payload.editorIncarnation !== correction.editorIncarnation
        || !["clean", "dirty", "failed"].includes(correction.status)) return shell;
      const dirty = payload.draft !== correction.baseline;
      const validation = correctionDraftValidationV15(payload.draft, correction.baseline);
      return { ...shell, correction: { ...correction, draft: payload.draft, dirty, validation, validationAttempted: false, status: dirty ? "dirty" : "clean", failure: null, retryTarget: null, intentKey: null, intentResolution: "none", unknownZeroRetryRemaining: 0, unknownZeroRetryUsed: false, operationKey: null, operation: null, selection: payload.selection || correction.selection } };
    }
    case "CORRECTION_SELECTION":
      if (!correction.open || payload.editorIncarnation !== correction.editorIncarnation) return shell;
      return { ...shell, correction: { ...correction, selection: payload.selection || correction.selection } };
    case "CORRECTION_VALIDATE":
      if (!correction.open
        || correction.operation
        || correction.failure?.kind === "stale-base"
        || payload.editorIncarnation !== correction.editorIncarnation
        || !["clean", "dirty"].includes(correction.status)
        || correction.validation.kind === "valid") return shell;
      return { ...shell, correction: { ...correction, validationAttempted: true, selection: payload.selection || correction.selection } };
    case "CORRECTION_SAVE_START": {
      const operation = authorizedCorrectionStartV15(shell, correction, "save", payload);
      if (!operation) return shell;
      return {
        ...shell,
        correction: {
          ...correction,
          status: operation.stage === "status-check" ? "reconciling" : "saving",
          failure: null,
          retryTarget: null,
          intentKey: operation.intentKey,
          unknownZeroRetryRemaining: operation.origin === "save-unknown-zero-retry" ? 0 : correction.unknownZeroRetryRemaining,
          unknownZeroRetryUsed: operation.origin === "save-unknown-zero-retry" || correction.unknownZeroRetryUsed,
          operationKey: operation.operationKey,
          operation,
          resultCopy: null,
        },
      };
    }
    case "CORRECTION_SAVE_UNKNOWN": {
      const operation = authorizedCorrectionCallbackV15(shell, correction, "save", "UNKNOWN", payload);
      if (!operation) return shell;
      const observedRecord = payload.observedResult?.kind === "save" ? payload.observedResult.record : null;
      if (payload.observedResult && !correctionSaveRecordMatchesOperationV15(observedRecord, operation)) return shell;
      const existingResult = shell.correctionResults[operation.intentKey];
      if (existingResult && (existingResult.kind !== "save" || !correctionSaveRecordMatchesOperationV15(existingResult.record, operation))) return shell;
      return {
        ...shell,
        correctionResults: observedRecord && !existingResult
          ? { ...shell.correctionResults, [operation.intentKey]: { kind: "save", record: observedRecord } }
          : shell.correctionResults,
        correction: {
          ...correction,
          status: "unknown",
          failure: { kind: "unknown", message: CORRECTION_COPY_V15.unknownSave },
          retryTarget: "save",
          intentResolution: "unknown",
          unknownZeroRetryRemaining: 0,
          unknownZeroRetryUsed: correction.unknownZeroRetryUsed,
          operationKey: null,
          operation: null,
          resultCopy: null,
        },
      };
    }
    case "CORRECTION_SAVE_FAIL": {
      const operation = authorizedCorrectionCallbackV15(shell, correction, "save", "FAIL", payload);
      if (!operation) return shell;
      const resolution = payload.resolution === "unknown-zero" ? "unknown-zero" : "known-zero";
      const verifiedKnownZeroCouldNotRun = operation.origin === "save-known-zero-retry" && resolution === "known-zero";
      if (operation.stage === "status-check"
        ? resolution !== "unknown-zero" && !verifiedKnownZeroCouldNotRun
        : resolution !== "known-zero") return shell;
      if (operation.stage === "status-check" && correction.sourceRacePending) {
        return {
          ...shell,
          correction: {
            ...correction,
            status: "failed",
            dirty: true,
            failure: { kind: "stale-base", message: CORRECTION_COPY_V15.baseRace },
            retryTarget: null,
            intentResolution: "source-race-zero",
            unknownZeroRetryRemaining: 0,
            operationKey: null,
            operation: null,
            resultCopy: null,
            sourceRacePending: null,
          },
        };
      }
      const consumedUnknownZeroRetry = operation.origin === "save-unknown-zero-retry" || (resolution === "unknown-zero" && correction.unknownZeroRetryUsed);
      return {
        ...shell,
        correction: {
          ...correction,
          status: "failed",
          dirty: true,
          failure: payload.failure || { kind: "known-zero", message: CORRECTION_COPY_V15.saveFailure },
          retryTarget: consumedUnknownZeroRetry ? null : "save",
          intentResolution: consumedUnknownZeroRetry ? "unknown-zero-retry-consumed" : resolution,
          unknownZeroRetryRemaining: resolution === "unknown-zero" && !consumedUnknownZeroRetry ? 1 : 0,
          unknownZeroRetryUsed: correction.unknownZeroRetryUsed,
          operationKey: null,
          operation: null,
          resultCopy: null,
        },
      };
    }
    case "CORRECTION_SAVE_READY": {
      const operation = authorizedCorrectionCallbackV15(shell, correction, "save", "READY", payload);
      if (!operation || !correctionSaveRecordMatchesOperationV15(payload.record, operation)) return shell;
      const correctionKey = `${correction.date}:${correction.journalId}`;
      const lifecycle = shell.representedCorrections[correctionKey] || { records: [], activeRecordId: null, removal: null };
      const resultAlreadyRecorded = lifecycle.records.some((record) => record.intentKey === payload.record.intentKey);
      if (resultAlreadyRecorded || lifecycle.records.some((record) => record.id === payload.record.id)) return shell;
      const existingResult = shell.correctionResults[operation.intentKey];
      if (existingResult && (existingResult.kind !== "save" || !correctionSaveRecordMatchesOperationV15(existingResult.record, operation))) return shell;
      const resultRecord = existingResult?.record || payload.record;
      if (operation.stage === "status-check" && correction.sourceRacePending) {
        return {
          ...shell,
          correctionResults: existingResult ? shell.correctionResults : { ...shell.correctionResults, [operation.intentKey]: { kind: "save", record: resultRecord } },
          correction: {
            ...correction,
            status: "failed",
            failure: { kind: "stale-base", message: `${CORRECTION_COPY_V15.baseRace} The original save intent was found, but v15 kept the existing displayed truth and did not merge source text.` },
            retryTarget: null,
            intentResolution: "source-race-one",
            unknownZeroRetryRemaining: 0,
            operationKey: null,
            operation: null,
            resultRecord: null,
            resultCopy: null,
            sourceRacePending: null,
          },
        };
      }
      const nextRecords = [...lifecycle.records.map((record) => record.id === lifecycle.activeRecordId ? { ...record, state: "Historical" } : record), resultRecord];
      return {
        ...shell,
        representedCorrections: { ...shell.representedCorrections, [correctionKey]: { ...lifecycle, records: nextRecords, activeRecordId: resultRecord.id, removal: null } },
        correctionResults: existingResult ? shell.correctionResults : { ...shell.correctionResults, [operation.intentKey]: { kind: "save", record: resultRecord } },
        correction: { ...correction, status: "saved", dirty: false, baseline: resultRecord.text, validation: correctionDraftValidationV15(resultRecord.text, resultRecord.text), saveCount: nextRecords.length, operationKey: null, operation: null, failure: null, retryTarget: null, intentResolution: "settled-one", unknownZeroRetryRemaining: 0, activeRecord: resultRecord, resultRecord, resultCopy: operation.stage === "status-check" ? CORRECTION_COPY_V15.alreadySaved : CORRECTION_COPY_V15.saveSuccess },
      };
    }
    case "CORRECTION_REMOVE_OPEN": {
      const correctionKey = `${correction.date}:${correction.journalId}`;
      const lifecycle = shell.representedCorrections[correctionKey] || { activeRecordId: null };
      if (!correction.open
        || correction.operation
        || !correction.activeRecord
        || correction.activeRecord.id !== payload.activeRecord?.id
        || lifecycle.activeRecordId !== payload.activeRecord.id
        || !["clean", "dirty"].includes(correction.status)) return shell;
      return { ...shell, correction: { ...correction, open: false, status: "remove-confirm", failure: null, retryTarget: null, intentKey: null, intentResolution: "none", unknownZeroRetryRemaining: 0, unknownZeroRetryUsed: false, operationKey: null, operation: null, resultCopy: null, returnFocusSelector: payload.returnFocusSelector || correction.returnFocusSelector, activeRecord: payload.activeRecord || correction.activeRecord } };
    }
    case "CORRECTION_REMOVE_START": {
      const operation = authorizedCorrectionStartV15(shell, correction, "remove", payload);
      if (!operation) return shell;
      return {
        ...shell,
        correction: {
          ...correction,
          status: operation.stage === "status-check" ? "remove-reconciling" : "removing",
          failure: null,
          retryTarget: null,
          intentKey: operation.intentKey,
          unknownZeroRetryRemaining: operation.origin === "remove-unknown-zero-retry" ? 0 : correction.unknownZeroRetryRemaining,
          unknownZeroRetryUsed: operation.origin === "remove-unknown-zero-retry" || correction.unknownZeroRetryUsed,
          operationKey: operation.operationKey,
          operation,
          resultCopy: null,
        },
      };
    }
    case "CORRECTION_REMOVE_UNKNOWN": {
      const operation = authorizedCorrectionCallbackV15(shell, correction, "remove", "UNKNOWN", payload);
      if (!operation) return shell;
      const observedRemoval = payload.observedResult?.kind === "remove" ? payload.observedResult.removal : null;
      if (payload.observedResult && !correctionRemovalMatchesOperationV15(observedRemoval, operation)) return shell;
      const existingResult = shell.correctionResults[operation.intentKey];
      if (existingResult && (existingResult.kind !== "remove" || !correctionRemovalMatchesOperationV15(existingResult.removal, operation))) return shell;
      return {
        ...shell,
        correctionResults: observedRemoval && !existingResult
          ? { ...shell.correctionResults, [operation.intentKey]: { kind: "remove", removal: observedRemoval } }
          : shell.correctionResults,
        correction: {
          ...correction,
          status: "remove-unknown",
          failure: { kind: "unknown", message: CORRECTION_COPY_V15.unknownRemove },
          retryTarget: "remove",
          intentResolution: "unknown",
          unknownZeroRetryRemaining: 0,
          unknownZeroRetryUsed: correction.unknownZeroRetryUsed,
          operationKey: null,
          operation: null,
          resultCopy: null,
        },
      };
    }
    case "CORRECTION_REMOVE_FAIL": {
      const operation = authorizedCorrectionCallbackV15(shell, correction, "remove", "FAIL", payload);
      if (!operation) return shell;
      const resolution = payload.resolution === "unknown-zero" ? "unknown-zero" : "known-zero";
      const verifiedKnownZeroCouldNotRun = operation.origin === "remove-known-zero-retry" && resolution === "known-zero";
      if (operation.stage === "status-check"
        ? resolution !== "unknown-zero" && !verifiedKnownZeroCouldNotRun
        : resolution !== "known-zero") return shell;
      if (operation.stage === "status-check" && correction.sourceRacePending) {
        return {
          ...shell,
          correction: {
            ...correction,
            status: "remove-failed",
            failure: { kind: "stale-base", message: CORRECTION_COPY_V15.baseRace },
            retryTarget: null,
            intentResolution: "source-race-zero",
            unknownZeroRetryRemaining: 0,
            operationKey: null,
            operation: null,
            resultCopy: null,
            sourceRacePending: null,
          },
        };
      }
      const consumedUnknownZeroRetry = operation.origin === "remove-unknown-zero-retry" || (resolution === "unknown-zero" && correction.unknownZeroRetryUsed);
      return {
        ...shell,
        correction: {
          ...correction,
          status: "remove-failed",
          failure: payload.failure || { kind: "known-zero", message: CORRECTION_COPY_V15.removeFailure },
          retryTarget: consumedUnknownZeroRetry ? null : "remove",
          intentResolution: consumedUnknownZeroRetry ? "unknown-zero-retry-consumed" : resolution,
          unknownZeroRetryRemaining: resolution === "unknown-zero" && !consumedUnknownZeroRetry ? 1 : 0,
          unknownZeroRetryUsed: correction.unknownZeroRetryUsed,
          operationKey: null,
          operation: null,
          resultCopy: null,
        },
      };
    }
    case "CORRECTION_REMOVE_READY": {
      const operation = authorizedCorrectionCallbackV15(shell, correction, "remove", "READY", payload);
      if (!operation || !correctionRemovalMatchesOperationV15(payload.removal, operation)) return shell;
      const correctionKey = `${correction.date}:${correction.journalId}`;
      const lifecycle = shell.representedCorrections[correctionKey] || { records: [], activeRecordId: null, removal: null };
      if (lifecycle.removal || lifecycle.activeRecordId !== operation.sourceSnapshot.activeRecordId) return shell;
      const existingResult = shell.correctionResults[operation.intentKey];
      if (existingResult && (existingResult.kind !== "remove" || !correctionRemovalMatchesOperationV15(existingResult.removal, operation))) return shell;
      const nextRecords = lifecycle.records.map((record) => record.id === lifecycle.activeRecordId ? { ...record, state: "Historical" } : record);
      const removal = existingResult?.removal || payload.removal;
      if (operation.stage === "status-check" && correction.sourceRacePending) {
        return {
          ...shell,
          correctionResults: existingResult ? shell.correctionResults : { ...shell.correctionResults, [operation.intentKey]: { kind: "remove", removal } },
          correction: {
            ...correction,
            status: "remove-failed",
            failure: { kind: "stale-base", message: `${CORRECTION_COPY_V15.baseRace} The original removal intent was found, but v15 kept the existing displayed truth and selected no Source Revision.` },
            retryTarget: null,
            intentResolution: "source-race-one",
            unknownZeroRetryRemaining: 0,
            operationKey: null,
            operation: null,
            resultCopy: null,
            sourceRacePending: null,
          },
        };
      }
      const visibleRemoval = {
        ...removal,
        resultCopy: operation.stage === "status-check" ? CORRECTION_COPY_V15.alreadyRemoved : CORRECTION_COPY_V15.removeSuccess,
      };
      return {
        ...shell,
        representedCorrections: { ...shell.representedCorrections, [correctionKey]: { records: nextRecords, activeRecordId: null, removal: visibleRemoval } },
        correctionResults: existingResult ? shell.correctionResults : { ...shell.correctionResults, [removal.intentKey]: { kind: "remove", removal } },
        correction: { ...correction, status: "removed", dirty: false, operationKey: null, operation: null, failure: null, retryTarget: null, intentResolution: "settled-one", unknownZeroRetryRemaining: 0, activeRecord: null, resultRecord: null, resultCopy: visibleRemoval.resultCopy },
      };
    }
    case "CORRECTION_CLOSE":
      if (correctionHasUnresolvedSourceRaceV15(correction)
        || ["saving", "reconciling", "unknown", "removing", "remove-reconciling", "remove-unknown"].includes(correction.status)) return shell;
      return { ...shell, correction: emptyCorrectionV10({ returnFocusSelector: correction.returnFocusSelector }) };
    case "LEAVE_REQUEST":
      if (correctionHasUnresolvedSourceRaceV15(correction)
        || ["saving", "reconciling", "unknown", "removing", "remove-reconciling", "remove-unknown"].includes(correction.status)) return shell;
      return { ...shell, leaveConfirm: { reason: payload.reason || "leave" } };
    case "LEAVE_KEEP":
      return { ...shell, leaveConfirm: null };
    case "LEAVE_DISCARD":
      if (correctionHasUnresolvedSourceRaceV15(correction)
        || ["saving", "reconciling", "unknown", "removing", "remove-reconciling", "remove-unknown"].includes(correction.status)) return shell;
      return { ...shell, leaveConfirm: null, correction: emptyCorrectionV10({ returnFocusSelector: correction.returnFocusSelector }) };
    case "SESSION_EXPIRE":
      return {
        ...shell,
        phase: "session-expired",
        sessionHadDraft: payload.hadDraft ?? correction.dirty,
        pendingMonth: null,
        media: {},
        representedCorrections: {},
        correctionResults: {},
        correctionSourceRevisions: {},
        connection: "connected",
        connectionMessage: "",
        server: { status: "idle", settled: false },
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
        text: VOICE_R1_TEXT_V15,
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
        text: UPLOAD_R1_TEXT_V15,
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
        mediaAssetKey: "represented-rain-window-v14",
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
        title: "a-quiet-morning-with-a-deliberately-long-synthetic-filename-for-reflow.md",
        timestamp: "9 Jun 2026, 8:14 pm IST",
        status: "Current displayed version",
        text: LONG_R1_TEXT_V15,
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
// V13 owns an archive-only baseline. It never borrows v11's readiness fixture
// reset, so selecting a capture scenario cannot change Telegram configuration.
const captureArchiveBaselineV13 = structuredClone(syntheticArchiveDaysV10);

function journalTimestampSortKeyV14(value) {
  const match = String(value || "").match(/^(\d{1,2}) ([A-Z][a-z]+) (\d{4})(?:,| ·)? (\d{1,2}):(\d{2}) (am|pm)(?: IST)?$/i);
  if (!match) return null;
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const normalizedMonth = match[2].toLowerCase();
  const month = months.findIndex((name) => name === normalizedMonth || name.startsWith(normalizedMonth));
  if (month < 0) return null;
  let hour = Number(match[4]) % 12;
  if (match[6].toLowerCase() === "pm") hour += 12;
  return Date.UTC(Number(match[3]), month, Number(match[1]), hour, Number(match[5])) - 330 * 60 * 1000;
}

function compareJournalTimestampsV14(first, second) {
  const firstKey = journalTimestampSortKeyV14(first.timestamp);
  const secondKey = journalTimestampSortKeyV14(second.timestamp);
  if (firstKey != null && secondKey != null && firstKey !== secondKey) return firstKey - secondKey;
  const fallback = String(first.timestamp).localeCompare(String(second.timestamp));
  return fallback || String(first.id).localeCompare(String(second.id));
}

function decorateUploadArchiveV14(targetDays) {
  const existingDay = targetDays["2026-08-13"];
  const baselineJournal = existingDay?.journals?.find((journal) => journal.id === "u-13");
  if (baselineJournal) {
    baselineJournal.title = "evening-rain.txt";
    baselineJournal.timestamp = "13 August 2026 · 4:42 pm";
    baselineJournal.text = `${SYNTHETIC_NOTICE} We carried two cups to the balcony after the shower. The city lights returned slowly, and the fictional evening stayed unplanned.`;
    baselineJournal.uploadV14 = {
      uiHandle: "upload-source-card-v14-1",
      sourceType: "UTF-8 text",
      byteLength: 126,
      representedIdentity: "baseline-evening-rain-v14",
      duplicateProvenance: null,
      exportRestoreStatus: "Original download and complete archive export/restore inclusion represented · download, export, and restore not implemented",
    };
  }
  if (existingDay) {
    existingDay.titleProtected = true;
    existingDay.journals.sort(compareJournalTimestampsV14);
  }
  const earlierUpload = targetDays["2026-06-09"]?.journals?.find((journal) => journal.id === "u-june-09");
  if (!earlierUpload) return;
  earlierUpload.uploadV14 = {
    uiHandle: "upload-source-card-v14-2",
    sourceType: "UTF-8 Markdown",
    byteLength: 257,
    representedIdentity: "baseline-clear-table-v14",
    duplicateProvenance: null,
    exportRestoreStatus: "Original download and complete archive export/restore inclusion represented · download, export, and restore not implemented",
  };
}

decorateUploadArchiveV14(days);
decorateUploadArchiveV14(syntheticArchiveDaysV10);
decorateUploadArchiveV14(captureArchiveBaselineV13);
const uploadArchiveBaselineV14 = structuredClone(syntheticArchiveDaysV10);
delete uploadArchiveBaselineV14["2026-08-08"];

function resetCorrectionTruthForExternalArchiveResetV15() {
  cancelShellOperations(["correction"]);
  clearCorrectionCallbackReplayV15();
  pendingLeaveNavigation = null;
  pendingPopGuard = null;
  suppressGuardedPopstate = false;
  pendingCorrectionPopstateReboundV15 = null;
  clearPendingCorrectionCloseTraversalV15();
  deferredCorrectionCallbacksV15.length = 0;
  dispatchShell("CORRECTION_RESET");
  if (["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type)) state.modal = null;
}

function resetSyntheticArchiveDaysV10(populated) {
  invalidatePrivateArchiveAsyncWorkV13();
  resetUploadTruthV14({ preserveFixture: true });
  resetCorrectionTruthForExternalArchiveResetV15();
  Object.keys(days).forEach((date) => delete days[date]);
  if (!populated) return;
  Object.assign(days, structuredClone(syntheticArchiveDaysV10));
}

function restoreCaptureArchiveBaselineV13() {
  invalidatePrivateArchiveAsyncWorkV13();
  resetUploadTruthV14({ preserveFixture: true });
  resetCorrectionTruthForExternalArchiveResetV15();
  Object.keys(days).forEach((date) => delete days[date]);
  Object.assign(days, structuredClone(captureArchiveBaselineV13));
  state.captureArchiveActive = true;
  state.almanacEmptyArchive = false;
  state.selectedDate = null;
  state.screen = "month";
  state.galleryIndex = {};
  state.viewMemory.calendar = null;
  state.viewMemory.almanac = null;
  state.scrollByView.calendar = 0;
  state.scrollByView.almanac = 0;
  captureDuplicateReferenceByIdentityV13.clear();
  captureConcurrentPermitLedgerV13.clear();
  captureDayHistoryTargetsV13.clear();
  captureDayPhotoTargetsV13.clear();
}

function captureOnlyDayV13(date, title) {
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
    captureOnlyV13: true,
  };
}

function capturePhotoV13({ id, src, alt, caption, timestamp, isCover, sourceLabel = "Telegram photo", mediaAssetKey = null, sameMediaDate = null, sharedMedia = false }) {
  return { id, src, alt, caption, timestamp, isCover, sourceLabel, mediaAssetKey, sameMediaDate, sharedMedia, capturedByV13: true };
}

function attachDuplicateCaptureResultV13(fixture, identity) {
  if (fixture?.kind !== "duplicate" || !identity || captureCommittedIdentitiesV13.has(identity) || captureDuplicateReferenceByIdentityV13.has(identity)) return false;
  const existingDay = structuredClone(days[fixture.existingDate]);
  const existingPhotoIndex = existingDay?.photos?.findIndex((photo) => photo.id === "p-rain");
  if (!existingDay || existingPhotoIndex < 0 || existingDay.photos[existingPhotoIndex].mediaAssetKey !== "represented-rain-window-v14") return false;
  const representedReferenceCount = Object.values(days).reduce((count, day) => count + (day.photos || []).filter((photo) => photo.mediaAssetKey === "represented-rain-window-v14").length, 0);
  const referenceId = `capture-duplicate-reference-${representedReferenceCount + 1}-v14`;
  const existingPhoto = { ...existingDay.photos[existingPhotoIndex], sharedMedia: true };
  if (fixture.duplicateScope === "cross-day") existingPhoto.sameMediaDate = fixture.journalDate;
  existingDay.photos[existingPhotoIndex] = existingPhoto;

  if (fixture.duplicateScope === "same-day") {
    const destination = existingDay;
    if (!destination?.photos) return false;
    if (!destination.photos.some((photo) => photo.id === referenceId)) {
      destination.photos.push(capturePhotoV13({
        id: referenceId,
        src: fixture.asset,
        alt: fixture.alt,
        caption: fixture.photoCaption,
        timestamp: fixture.originalTimestamp,
        isCover: false,
        sourceLabel: fixture.sourceForm || "Telegram photo",
        mediaAssetKey: existingPhoto.mediaAssetKey,
        sharedMedia: true,
      }));
    }
    days[fixture.journalDate] = destination;
  } else {
    const currentDestination = days[fixture.journalDate];
    if (currentDestination && !currentDestination.captureOnlyV13) return false;
    const destination = currentDestination ? structuredClone(currentDestination) : captureOnlyDayV13(fixture.journalDate, fixture.photoCaption);
    destination.photos.push(capturePhotoV13({
      id: referenceId,
      src: fixture.asset,
      alt: fixture.alt,
      caption: fixture.photoCaption,
      timestamp: fixture.originalTimestamp,
      isCover: destination.photos.length === 0,
      sourceLabel: fixture.sourceForm || "Telegram photo",
      mediaAssetKey: existingPhoto.mediaAssetKey,
      sameMediaDate: fixture.existingDate,
      sharedMedia: true,
    }));
    days[fixture.existingDate] = existingDay;
    days[destination.date] = destination;
  }

  captureDuplicateReferenceByIdentityV13.set(identity, { date: fixture.journalDate, photoId: referenceId });
  captureCommittedIdentitiesV13.add(identity);
  state.almanacEmptyArchive = false;
  return true;
}

function attachCaptureResultV13(fixture, identity) {
  if (!fixture || captureCommittedIdentitiesV13.has(identity)) return false;
  if (["t5", "t6"].includes(fixture.key)) return false;
  if (["t1", "t4"].includes(fixture.key)) {
    const destination = days["2026-08-13"];
    const photoId = fixture.key === "t4" ? "capture-forwarded-v14" : "capture-receipt-v14";
    if (!destination?.photos?.some((photo) => photo.id === photoId)) {
      destination.photos.splice(0, 0, capturePhotoV13({
        id: photoId,
        src: fixture.asset,
        alt: fixture.alt,
        caption: fixture.photoCaption,
        timestamp: fixture.originalTimestamp,
        isCover: false,
      }));
    }
  } else if (fixture.key === "t2") {
    const destination = captureOnlyDayV13("2026-08-10", fixture.photoCaption);
    destination.photos.push(capturePhotoV13({
      id: "capture-document-v14",
      src: fixture.asset,
      alt: fixture.alt,
      caption: fixture.photoCaption,
      timestamp: fixture.originalTimestamp,
      isCover: true,
    }));
    days[destination.date] = destination;
  } else if (fixture.key === "t3") {
    const destination = captureOnlyDayV13("2026-08-09", fixture.photoCaption);
    destination.photos = fixture.members.map((member, index) => capturePhotoV13({
      id: `capture-group-member-v14-${index + 1}`,
      src: member.asset,
      alt: member.alt,
      caption: member.caption,
      timestamp: member.messageTime,
      isCover: index === 0,
    }));
    days[destination.date] = destination;
  } else if (fixture.key === "t7") {
    const destination = captureOnlyDayV13("2026-08-10", fixture.photoCaption);
    // Product intentionally leaves the T7 visual unspecified. The archive
    // record uses a neutral treatment flag; no T7-specific cover copy/action
    // is exposed by the companion.
    destination.photos.push(capturePhotoV13({
      id: "capture-retry-v14",
      src: "assets/photo-rain-window.svg",
      alt: "Synthetic Daily Photo represented after retry",
      caption: fixture.photoCaption,
      timestamp: fixture.originalTimestamp,
      isCover: true,
    }));
    days[destination.date] = destination;
  } else return false;
  captureCommittedIdentitiesV13.add(identity);
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

const SOURCE_CONFLICT_ITEM_V16 = Object.freeze({
  date: "2026-08-02",
  journalId: "v-02",
  sourceType: "Voice Journal",
  title: "Before sleep — synthetic fixture",
  originalTimestamp: "2 Aug 2026, 10:18 pm IST",
  journalDate: "2 August 2026",
});

const SOURCE_CONFLICT_TIMES_V16 = Object.freeze({
  c1Created: "13 August 2026 · 10:06 pm IST",
  r2Represented: "17 August 2026 · 9:42 pm IST",
  keep: "18 August 2026 · 9:06 am IST",
  displayNewest: "18 August 2026 · 9:08 am IST",
  basedOnBoth: "18 August 2026 · 9:10 am IST",
  r3Represented: "18 August 2026 · 9:12 am IST",
});

const SOURCE_CONFLICT_COPY_V16 = Object.freeze({
  entry: "VoiceNotes changed after this Correction was created. Nothing was merged. The displayed Correction remains unchanged until you choose an outcome.",
  retained: "Every Source Revision and prior Correction remains retained.",
  cancel: "Cancel closes this review without resolving it. The displayed Correction stays unchanged and Review source update remains visible.",
  keepPreview: "The current Correction will stay displayed. Voice R2 will be marked reviewed. Voice R1, Voice R2, and Correction 1 remain retained.",
  displayPreview: "Voice R2 will become displayed. Correction 1 will remain retained as Historical; it is not deleted. Voice R1 and Voice R2 remain unchanged.",
  manualPreview: "A manual workspace will open with both versions visible. The editor starts with Correction 1 only. No VoiceNotes text is inserted or merged. The conflict remains unresolved until a new Correction is saved.",
  manualIntro: "Use both versions as references. The editor starts with the displayed Correction only. Nothing from VoiceNotes is inserted or merged.",
  manualHelper: "This changes only what Life in Days displays. Every Source Revision and prior Correction remains retained.",
  empty: "Enter Correction text before saving.",
  equalsC1: "Change the displayed text before saving.",
  equalsR2: "This text matches the newest VoiceNotes revision. Choose Display newest upstream revision instead.",
  dirty: "Unsaved changes · kept only while this page remains open.",
  loading: "Loading the complete displayed Correction and newest VoiceNotes revision.",
  loadFailure: "Source update could not be loaded. The displayed Correction remains unchanged. Retry.",
  knownZero: "Conflict not resolved. The displayed Correction and every Source Revision remain unchanged. Retry.",
  unknown: "Resolution result unknown. Check resolution status before trying again.",
  reconciledZero: "No resolution was found for the original intent. The source update remains unresolved. Retry.",
  reconciledOne: "Source update already resolved. No second resolution event was created.",
  connection: "Connection interrupted. The source update remains unresolved. Nothing changed.",
  workspaceConnection: "Connection interrupted. Your draft remains in this open page. Nothing was saved.",
  stale: "A newer VoiceNotes revision arrived while this review was open. Nothing changed. Review the latest source update.",
  session: "Sign in again to return to Life in Days. Unsaved Correction text was not retained.",
  keepSuccess: "Correction kept in this tab. Voice R2 was marked reviewed. Every Source Revision and prior Correction remains retained. Nothing was persisted.",
  displaySuccess: "Voice R2 displayed in this tab. Correction 1 remains retained as Historical; it was not deleted. Nothing was persisted.",
  manualSuccess: "New Correction displayed in this tab. It is based on Voice R2 with Correction 1 lineage. Every Source Revision and prior Correction remains retained. Nothing was persisted.",
  prototype: "Prototype data · represented conflict-resolution records only. Nothing is persisted, encrypted, or sent over the network.",
  derived: "Generated fields and artwork were not refreshed in this prototype. Their lifecycle remains outside v16.",
  noCorrection: "This source changed before a Correction was saved. It is not a Source/Correction conflict. No conflict outcome was created.",
});

const SOURCE_CONFLICT_TEXT_V16 = Object.freeze({
  r1: `Rain settled against the balcony rail.
I put the blue cup beside the lamp and read until the room felt quiet.`,
  c1: `Rain settled against the balcony rail.
I put the blue cup beside the lamp, then read until the room felt quiet.`,
  r2: `Rain settled against the balcony rail.
I moved the blue cup beside the lamp and read until the room grew quiet.
Before midnight, I opened the window for a few minutes.`,
  c2: `Rain settled against the balcony rail.
I moved the blue cup beside the lamp, then read until the room grew quiet.
Before midnight, I opened the window and listened to the rain for a few minutes.`,
  r3: `Rain settled against the balcony rail.
I moved the blue cup beside the lamp and read until the room grew quiet.
Before midnight, I opened the window for a few minutes, then closed it when the rain strengthened.`,
  longC1: `At 6:10 pm the terrace was cool, the chair was dry, and the notebook lay open beside an empty glass.

I wrote a deliberately long sentence about the left shelf, the brass key, the folded map, the dim hallway, the kettle clicking off, and the slow rain returning against every window in the room so wrapping and reading order can be inspected without a nested scroll region or clipped continuation.

The third paragraph stays exactly the same in both complete documents.

The old note says that the lantern stayed beside the north window until morning.

Literal hostile fixture: <script>document.location='https://invalid.example/leak'</script> <img src=x onerror=alert(1)> [open](javascript:alert(1)) {{constructor.constructor('alert(1)')()}} " autofocus onfocus="alert(1) U+202E must all remain visible inert text.

Unbroken-wrap-token-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-end stayed in Correction 1.`,
  longR2: `At 6:10 pm the terrace was cool, the chair was dry, and the notebook lay open beside an empty glass.

I wrote a deliberately long sentence about the right shelf, the silver key, the unfolded map, the bright hallway, the kettle clicking twice, and the steady rain returning against every window in the room so wrapping and reading order can be inspected without a nested scroll region or clipped continuation.

The third paragraph stays exactly the same in both complete documents.

The newest note says that the lantern moved from the north window before morning.

Literal hostile fixture: <script>document.location='https://invalid.example/leak'</script> <img src=x onerror=alert(1)> [open](javascript:alert(1)) {{constructor.constructor('alert(1)')()}} " autofocus onfocus="alert(1) U+202E must all remain visible inert text.

Unbroken-wrap-token-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-end moved into Voice R2.`,
});

const VOICE_R2_TEXT_V16 = SOURCE_CONFLICT_TEXT_V16.r2;
const VOICE_R3_TEXT_V16 = SOURCE_CONFLICT_TEXT_V16.r3;
const VOICE_C2_TEXT_V16 = SOURCE_CONFLICT_TEXT_V16.c2;
const LONG_CONFLICT_C1_V16 = SOURCE_CONFLICT_TEXT_V16.longC1;
const LONG_CONFLICT_R2_V16 = SOURCE_CONFLICT_TEXT_V16.longR2;

const SOURCE_CONFLICT_OUTCOMES_V16 = Object.freeze({
  keep: Object.freeze({ label: "Keep the Correction", preview: SOURCE_CONFLICT_COPY_V16.keepPreview }),
  "display-newest": Object.freeze({ label: "Display newest upstream revision", preview: SOURCE_CONFLICT_COPY_V16.displayPreview }),
  "based-on-both": Object.freeze({ label: "Create a new Correction based on both", preview: SOURCE_CONFLICT_COPY_V16.manualPreview }),
});

const SOURCE_CONFLICT_BRANCHES_V16 = Object.freeze({
  success: "Matching success",
  "load-pending": "Load pending",
  "load-failure-once": "Load failure once",
  "known-zero-failure-once": "Known-zero failure once",
  "unknown-zero": "Unknown, then reconcile zero",
  "unknown-completed": "Unknown, then reconcile one",
  "reconciliation-unknown": "Reconciliation remains unknown",
  "mismatched-result": "Mismatched result rejected",
  "incomplete-result": "Incomplete effect result rejected",
  "incomplete-envelope": "Incomplete callback envelope rejected",
  "incomplete-reconciliation": "Incomplete reconciliation result rejected",
  "reconciliation-mismatch-outcome": "Reconciliation outcome mismatch rejected",
  "reconciliation-mismatch-intent": "Reconciliation intent mismatch rejected",
  "reconciliation-mismatch-r2": "Reconciliation newest revision mismatch rejected",
  "reconciliation-mismatch-c1": "Reconciliation displayed record mismatch rejected",
  "connection-before-effect": "Connection before effect",
  "workspace-connection": "Workspace connection interruption",
  "r3-before-accept": "R3 before acceptance",
  "r3-post-accept-unknown": "R3 after accepted unknown result",
  "two-tab-competing": "Two tabs choose different outcomes",
  "two-tab-keep-over-display": "Two tabs · Keep wins over Display newest",
  "two-tab-keep-over-based": "Two tabs · Keep wins over Based on both",
  "two-tab-display-over-keep": "Two tabs · Display newest wins over Keep",
  "two-tab-display-over-based": "Two tabs · Display newest wins over Based on both",
  "two-tab-based-over-keep": "Two tabs · Based on both wins over Keep",
  "two-tab-based-over-display": "Two tabs · Based on both wins over Display newest",
  "current-display-changed": "Displayed record changes before acceptance",
  "rapid-repeat": "Rapid repeated confirmation",
  "duplicate-success": "Duplicate success callback",
  "late-failure": "Late failure after success",
  "foreign-callback": "Foreign callback",
  "session-interruption": "Session interruption",
  "terminal-session-keep": "Settled Keep, then session expiry",
  "terminal-session-display-newest": "Settled Display newest, then session expiry",
  "terminal-session-based-on-both": "Settled Based on both, then session expiry",
  "navigate-before-completion": "Navigate before completion",
});

const SOURCE_CONFLICT_TERMINAL_SESSION_BRANCHES_V16 = Object.freeze({
  "terminal-session-keep": "keep",
  "terminal-session-display-newest": "display-newest",
  "terminal-session-based-on-both": "based-on-both",
});

const SOURCE_CONFLICT_TWO_TAB_BRANCHES_V16 = Object.freeze({
  "two-tab-keep-over-display": Object.freeze({ winner: "keep", loser: "display-newest" }),
  "two-tab-keep-over-based": Object.freeze({ winner: "keep", loser: "based-on-both" }),
  "two-tab-display-over-keep": Object.freeze({ winner: "display-newest", loser: "keep" }),
  "two-tab-display-over-based": Object.freeze({ winner: "display-newest", loser: "based-on-both" }),
  "two-tab-based-over-keep": Object.freeze({ winner: "based-on-both", loser: "keep" }),
  "two-tab-based-over-display": Object.freeze({ winner: "based-on-both", loser: "display-newest" }),
});

const SOURCE_CONFLICT_RECONCILIATION_MISMATCH_BRANCHES_V16 = Object.freeze([
  "reconciliation-mismatch-outcome",
  "reconciliation-mismatch-intent",
  "reconciliation-mismatch-r2",
  "reconciliation-mismatch-c1",
]);

const SOURCE_CONFLICT_FIXTURES_V16 = Object.freeze({
  primary: "Primary C1/R2 conflict",
  "long-hostile": "Long inert comparison",
  "no-current-correction": "No current Correction",
});

const SOURCE_CONFLICT_INTENTS_V16 = Object.freeze({
  keep: "intent-v16-conflict-keep-01",
  "display-newest": "intent-v16-conflict-display-newest-01",
  "based-on-both": "intent-v16-conflict-based-on-both-01",
});

const SOURCE_CONFLICT_COMPLETENESS_V16 = Object.freeze({
  snapshot: "source-conflict-snapshot-v16-complete",
  result: "source-conflict-result-v16-complete",
  callback: "source-conflict-callback-v16-complete",
});

const SOURCE_CONFLICT_SNAPSHOT_KEYS_V16 = Object.freeze([
  "completeness", "conflictGeneration", "displayed", "displayEpoch", "displayedRecordId",
  "newestRecordId", "newestRevision", "outcome", "draft",
]);

const SOURCE_CONFLICT_RESULT_KEYS_V16 = Object.freeze([
  "completeness", "conflictGeneration", "outcome", "displayed", "displayEpoch", "displayedRecordId",
  "newestRevision", "newestRecordId", "intent", "draft",
]);

const SOURCE_CONFLICT_CALLBACK_KEYS_V16 = Object.freeze([
  "completeness", "kind", "origin", "generation", "operation", "operationSequence",
  "operationIncarnation", "result", "copy",
]);

function nextSourceConflictEditorIncarnationV16() {
  return Object.freeze({});
}

function initialSourceConflictV16(generation = 0) {
  return {
    generation,
    active: false,
    fixture: "primary",
    eligibility: "conflict",
    stage: "source-card-conflict",
    loadBranch: "success",
    branch: "success",
    compareMode: "complete",
    expandedUnchanged: false,
    compactDocument: "c1",
    newestRevision: "r2",
    outcome: null,
    previewInvoker: null,
    draft: SOURCE_CONFLICT_TEXT_V16.c1,
    draftSelection: null,
    draftScrollTop: 0,
    editorIncarnation: null,
    validation: "equals-c1",
    validationAttempted: false,
    dirty: false,
    expectedSnapshot: null,
    operation: null,
    operationPhase: "idle",
    intent: null,
    failureCopy: "",
    resultCopy: "",
    terminal: null,
    displayed: "c1",
    displayEpoch: 0,
    revisions: 2,
    corrections: 1,
    c2Text: null,
    events: 0,
    revisionRecords: Object.freeze([
      Object.freeze({ id: "Voice R1", text: SOURCE_CONFLICT_TEXT_V16.r1, author: "Archive owner · simulated", represented: SOURCE_CONFLICT_ITEM_V16.originalTimestamp }),
      Object.freeze({ id: "Voice R2", text: VOICE_R2_TEXT_V16, author: "Archive owner · simulated", represented: SOURCE_CONFLICT_TIMES_V16.r2Represented }),
    ]),
    correctionRecords: Object.freeze([
      Object.freeze({ id: "C-VOICE-1", ordinal: 1, text: SOURCE_CONFLICT_TEXT_V16.c1, author: "Archive owner · simulated", created: SOURCE_CONFLICT_TIMES_V16.c1Created, base: "Voice R1", lineage: null }),
    ]),
    resolutionEvents: Object.freeze([]),
    c1Status: "Current",
    r2Reviewed: false,
    r3Queued: false,
    latestReviewed: false,
    returnContext: null,
    lastProbe: "Not run",
  };
}

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
const allowedViews = new Set(["calendar", "almanac", "search", "settings", "date-review", "telegram-capture", "source-conflict"]);
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
  scrollByView: { calendar: 0, almanac: 0, search: 0, settings: 0, "date-review": 0, "telegram-capture": 0, "source-conflict": 0 },
  viewMemory: { calendar: null, almanac: null, search: null, settings: null, "date-review": null, "telegram-capture": null, "source-conflict": null },
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
  capture: initialCaptureStateV13(),
  captureArchiveActive: false,
  upload: initialUploadStateV14(),
  sourceConflict: initialSourceConflictV16(),
};

const shellOperations = new Map();
const shellOperationTimers = new Map();
const privateArchiveTimersV13 = new Set();
const privateJournalReadersV13 = new Set();
let shellOperationSequence = 0;
let pendingLeaveNavigation = null;
let pendingPopGuard = null;
let suppressGuardedPopstate = false;
let pendingUploadPopstateReboundV14 = null;
let pendingCorrectionPopstateReboundV15 = null;
let pendingCorrectionCloseTraversalV15 = null;
const deferredCorrectionCallbacksV15 = [];
const correctionEditorIncarnationsV15 = new WeakMap();
const correctionInputUndoV15 = new Map();
let correctionCallbackReplayV15 = { saveReady: null, removeReady: null };
let correctionCallbackProbeV15 = { foreignSaveIgnored: null, priorFlowSaveIgnored: null, staleEditorInputIgnored: null, staleSaveReadyIgnored: null, touchCompatibility: null };
let expiredSessionCallbackProbeV15 = null;
let inheritedAsyncGenerationV10 = 0;
let liveAnnouncementEpochV10 = 0;
let dateReviewAnnouncementEpochV11 = 0;
let dateReviewOperationSequenceV11 = 0;
let dateReviewLoadSequenceV11 = 0;
const dateReviewTimersV11 = new Map();
const captureTimersV13 = new Map();
const captureCommittedIdentitiesV13 = new Set();
const captureResolvedReviewIdentitiesV13 = new Set();
const captureDuplicateReferenceByIdentityV13 = new Map();
const captureConcurrentPermitLedgerV13 = new Map();
const uploadTimersV14 = new Map();
const deferredUploadCallbacksV14 = [];
const uploadReadersV14 = new Set();
const uploadCommittedIntentsV14 = new Map();
const uploadOriginalBytesV14 = new Map();
const uploadDayHistoryTargetsV14 = new Map();
const uploadPrivateDatesV14 = new Set();
const uploadDayDomHandlesV14 = new Map();
let captureOperationSequenceV13 = 0;
let captureSyntheticIdentitySequenceV13 = 0;
let captureAnnouncementEpochV13 = 0;
let uploadOperationSequenceV14 = 0;
let uploadIntentSequenceV14 = 0;
let uploadInternalSourceSequenceV14 = 0;
let uploadSourceUiSequenceV14 = 2;
let uploadDayUiSequenceV14 = 0;
let uploadAnnouncementEpochV14 = 0;
let uploadArchiveRevisionV14 = 0;
let uploadFocusEpochV14 = 0;
let correctionFocusEpochV15 = 0;
let navigationFocusEpochV13 = 0;
let pendingNavigationFocusV13 = null;
const sourceConflictTimersV16 = new Set();
const sourceConflictAcceptedResultsV16 = new WeakMap();
const sourceConflictEditorIncarnationsV16 = new WeakMap();
let sourceConflictReplayEnvelopeV16 = null;
let sourceConflictAnnouncementEpochV16 = 0;
let sourceConflictFocusEpochV16 = 0;
let sourceConflictOperationSequenceV16 = 0;
let pendingSourceConflictNavigationV16 = null;
let pendingSourceConflictPopReboundV16 = null;
let sourceConflictWorkbenchHistoryEntryIdV16 = null;
let sourceConflictReboundActionSequenceV16 = 0;
let sourceConflictSessionResumeV16 = null;
let viewScrollRestoreEpochV13 = 0;
let almanacRestoreTokenV13 = 0;
let almanacRestoreOverflowAnchorV13 = null;
const historyPositions = new Map();
let currentHistoryPosition = 0;

function clearUploadAnnouncementV14() {
  uploadAnnouncementEpochV14 += 1;
  if (uploadStatusLiveV14) uploadStatusLiveV14.textContent = "";
}

function announceUploadV14(message) {
  if (!uploadStatusLiveV14) return;
  const epoch = ++uploadAnnouncementEpochV14;
  uploadStatusLiveV14.textContent = "";
  requestAnimationFrame(() => {
    if (epoch === uploadAnnouncementEpochV14) uploadStatusLiveV14.textContent = message;
  });
}

function clearUploadTimersV14() {
  for (const timer of uploadTimersV14.values()) window.clearTimeout(timer);
  uploadTimersV14.clear();
  deferredUploadCallbacksV14.length = 0;
  for (const reader of [...uploadReadersV14]) {
    if (reader.readyState === 1) reader.abort();
  }
  uploadReadersV14.clear();
}

function cancelUploadPopstateReboundV14() {
  pendingUploadPopstateReboundV14 = null;
  deferredUploadCallbacksV14.length = 0;
}

function resetUploadTruthV14({ preserveFixture = true, preserveArchive = false } = {}) {
  clearUploadTimersV14();
  cancelUploadPopstateReboundV14();
  clearUploadAnnouncementV14();
  scrubUploadHistorySnapshotsV14();
  if (!preserveArchive) {
    uploadCommittedIntentsV14.clear();
    uploadOriginalBytesV14.clear();
    uploadDayHistoryTargetsV14.clear();
    uploadPrivateDatesV14.clear();
    uploadDayDomHandlesV14.clear();
    uploadArchiveRevisionV14 = 0;
  }
  const fixture = preserveFixture ? state.upload?.fixture : "valid-md";
  const branch = preserveFixture ? state.upload?.branch : "success";
  state.upload = initialUploadStateV14((state.upload?.generation || 0) + 1, fixture, branch);
  if (state.modal?.type === "upload") state.modal = null;
}

function dispatchShell(type, payload = {}) {
  const priorEditorIncarnation = state.shell.correction.editorIncarnation;
  const priorEditorInput = state.modal?.type === "correction-v10"
    ? modalRoot.querySelector("#correction-draft-v10")
    : correctionInputReconcileOwnerV15;
  if (["FIXTURE_SET", "CORRECTION_RESET", "SESSION_EXPIRE", "REAUTH_START", "REAUTH_RETURN"].includes(type)) {
    invalidateShellCompositionHistoryV15(priorEditorInput);
    clearCorrectionCallbackReplayV15();
    clearSourceConflictReplayLedgerV16();
    correctionInputUndoV15.clear();
  }
  if (type === "CORRECTION_RESET") {
    correctionOperationSequenceV15 = 0;
    correctionIntentCountsV15.clear();
  }
  state.shell = transitionShell(state.shell, type, payload);
  if (priorEditorIncarnation && state.shell.correction.editorIncarnation !== priorEditorIncarnation) {
    invalidateShellCompositionHistoryV15(priorEditorInput);
    correctionInputUndoV15.delete(priorEditorIncarnation);
  }
  return state.shell;
}

function nextCaptureSyntheticIdentityV13() {
  let identity = "";
  do {
    identity = `capture-v14-${++captureSyntheticIdentitySequenceV13}`;
  } while (
    identity === state.capture.fixtureIdentity
    || captureCommittedIdentitiesV13.has(identity)
    || captureDuplicateReferenceByIdentityV13.has(identity)
    || captureConcurrentPermitLedgerV13.has(identity)
    || [...captureConcurrentPermitLedgerV13.values()].some((ledger) => ledger.secondaryIdentity === identity)
  );
  return identity;
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
    if (!isCurrentOp(token)) {
      finishOp(token);
      return;
    }
    if (token.kind === "correction" && pendingCorrectionPopstateReboundV15) {
      deferredCorrectionCallbacksV15.push(() => {
        if (!isCurrentOp(token)) {
          finishOp(token);
          return;
        }
        callback(token);
        finishOp(token);
      });
      return;
    }
    callback(token);
    finishOp(token);
  }, delay);
  shellOperationTimers.set(token.identity, timer);
}

function cancelShellOperations(kinds = null) {
  const kindSet = kinds ? new Set(kinds) : null;
  if (!kindSet || kindSet.has("correction")) deferredCorrectionCallbacksV15.length = 0;
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

function deferCorrectionWorkForReboundV15(work) {
  if (!pendingCorrectionPopstateReboundV15) return false;
  deferredCorrectionCallbacksV15.push(work);
  return true;
}

function flushDeferredCorrectionCallbacksV15() {
  const callbacks = deferredCorrectionCallbacksV15.splice(0);
  callbacks.forEach((callback) => callback());
  return callbacks.length;
}

function schedulePrivateArchiveTimeoutV13(callback, delay) {
  const timer = window.setTimeout(() => {
    privateArchiveTimersV13.delete(timer);
    callback();
  }, delay);
  privateArchiveTimersV13.add(timer);
  return timer;
}

function readPrivateJournalFileV13(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    privateJournalReadersV13.add(reader);
    const finish = () => {
      privateJournalReadersV13.delete(reader);
      reader.onload = null;
      reader.onerror = null;
      reader.onabort = null;
    };
    reader.onload = () => {
      const result = reader.result;
      finish();
      resolve(result);
    };
    reader.onerror = () => {
      const error = reader.error || new Error("read-failed");
      finish();
      reject(error);
    };
    reader.onabort = () => {
      finish();
      reject(new DOMException("File read cancelled", "AbortError"));
    };
    reader.readAsArrayBuffer(file);
  });
}

function beginAlmanacRestorationV13() {
  if (almanacRestoreOverflowAnchorV13 === null) {
    almanacRestoreOverflowAnchorV13 = document.documentElement.style.overflowAnchor;
  }
  const token = ++almanacRestoreTokenV13;
  document.documentElement.style.overflowAnchor = "none";
  state.almanacRestoringHistory = true;
  return token;
}

function finishAlmanacRestorationV13(token) {
  if (almanacRestoreTokenV13 !== token) return false;
  document.documentElement.style.overflowAnchor = almanacRestoreOverflowAnchorV13 ?? "";
  almanacRestoreOverflowAnchorV13 = null;
  state.almanacRestoringHistory = false;
  return true;
}

function invalidateAlmanacRestorationV13() {
  almanacRestoreTokenV13 += 1;
  document.documentElement.style.overflowAnchor = almanacRestoreOverflowAnchorV13 ?? "";
  almanacRestoreOverflowAnchorV13 = null;
  state.almanacRestoringHistory = false;
}

function invalidatePrivateArchiveAsyncWorkV13() {
  inheritedAsyncGenerationV10 += 1;
  liveAnnouncementEpochV10 += 1;
  calendarStatusLive.textContent = "";
  almanacStatusLive.textContent = "";
  shellStatusLive.textContent = "";
  correctionStatusLiveV15.textContent = "";
  state.almanacStatusMessage = "";
  toastRegion.innerHTML = "";
  clearUploadTimersV14();
  if (state.almanacStatus === "loading") {
    state.almanacLoadRequestId += 1;
    state.almanacStatus = "idle";
    state.almanacFailNext = false;
  }
  viewScrollRestoreEpochV13 += 1;
  invalidateAlmanacRestorationV13();
  for (const timer of privateArchiveTimersV13) window.clearTimeout(timer);
  privateArchiveTimersV13.clear();
  for (const reader of [...privateJournalReadersV13]) {
    if (reader.readyState === 1) reader.abort();
  }
  privateJournalReadersV13.clear();
  if (almanacScrollFrame) window.cancelAnimationFrame(almanacScrollFrame);
  if (almanacMemoryTimer) window.clearTimeout(almanacMemoryTimer);
  almanacScrollFrame = 0;
  almanacMemoryTimer = 0;
  state.generation = {};
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
    selector: `#chapter-${uploadDayDomTokenV14(state.selectedDate)}`,
    announcement: `Showing ${longDate(state.selectedDate)} in the Almanac.`,
  };
}

// Browser history carries only an opaque entry key. Scroll, focus, transient
// input state, and prototype-only flags stay in this tab's memory and vanish
// on reload. This keeps private reading context out of browser history.
const historyEntries = new Map();
// Capture View-day destinations are resolved only behind the opaque browser
// entry ID. The exact Journal Date never enters the URL or history.state.
const captureDayHistoryTargetsV13 = new Map();
const captureDayPhotoTargetsV13 = new Map();
// Source-conflict return destinations are resolved only behind the opaque
// browser entry ID. The fixture Journal Date never enters the URL or
// history.state, and this live-memory map vanishes on reload or reset.
const sourceConflictReturnTargetsV16 = new Map();
let historyEntryCounter = 0;
const nextHistoryEntryId = () => `e${++historyEntryCounter}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;

function normalizeSourceConflictReturnTargetV16(target) {
  if (!target || !["calendar", "almanac"].includes(target.view) || !isDateKey(target.date)) return null;
  return Object.freeze({
    view: target.view,
    date: target.date,
    screen: target.screen === "day" ? "day" : "month",
  });
}

function sourceConflictReturnTargetMatchesStateV16(target) {
  return Boolean(target)
    && target.view === state.view
    && target.date === state.selectedDate
    && target.screen === state.screen;
}

function sourceConflictSafeHistorySnapshotV16(entryId, snapshot) {
  if (!sourceConflictReturnTargetsV16.has(entryId)) return snapshot;
  const focusSelector = typeof snapshot?.focusSelector === "string"
    && snapshot.focusSelector.includes("source-conflict")
    ? snapshot.focusSelector
    : null;
  return {
    scrollY: Number(snapshot?.scrollY) || 0,
    focusSelector,
    focusTop: Number.isFinite(snapshot?.focusTop) ? snapshot.focusTop : null,
    calendarMonth: isMonthKey(snapshot?.calendarMonth) ? snapshot.calendarMonth : "2026-08",
    almanacVisibleMonth: isMonthKey(snapshot?.almanacVisibleMonth) ? snapshot.almanacVisibleMonth : "2026-08",
  };
}

const html = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
  );

const correctionSourceHandlesByJournalV15 = new WeakMap();
const correctionSourcesByHandleV15 = new Map();
const correctionHiddenSourceHandlesV15 = new Set();
let correctionSourceHandleSequenceV15 = 0;
let correctionOperationSequenceV15 = 0;
const correctionIntentCountsV15 = new Map();
const CORRECTION_INTENT_BASES_V15 = Object.freeze({
  voiceCreate: "intent-v15-voice-create-01",
  uploadCreate: "intent-v15-upload-create-01",
  uploadUpdate: "intent-v15-upload-update-01",
  uploadRemove: "intent-v15-upload-remove-01",
});

function correctionSourceMetaV15(day, journal) {
  const uploaded = Boolean(journal.uploadV14) || String(journal.kind).toLocaleLowerCase("en-IN").includes("uploaded");
  const sourceType = uploaded ? "Uploaded Journal" : "Voice Journal";
  const sourceKey = `${day.date}:${journal.id}`;
  const hasCompleteBase = typeof journal.text === "string" && Boolean(journal.text.trim());
  const baseRevisionToken = hasCompleteBase ? `${journal.id}:source-revision-1` : null;
  const liveRevision = state.shell.correctionSourceRevisions?.[sourceKey] || null;
  const sourceChanged = Boolean(liveRevision && liveRevision.token !== baseRevisionToken);
  return {
    sourceType,
    sourceTitle: journal.title,
    journalDate: `${longDate(day.date)} · Asia/Kolkata`,
    sourceTimestamp: journal.timestamp,
    sourceStatus: uploaded ? "Original imported revision selected" : journal.status,
    baseRevisionLabel: `${uploaded ? "Uploaded" : "Voice"} R1`,
    baseRevisionToken,
    baseText: journal.text,
    baseComplete: hasCompleteBase,
    sourceChanged,
    eligible: hasCompleteBase
      && Boolean(baseRevisionToken)
      && !sourceChanged
      && !day.conflict
      && !String(journal.status).toLocaleLowerCase("en-IN").includes("newest upstream revision"),
  };
}

function registerCorrectionSourceV15(day, journal) {
  let handle = correctionSourceHandlesByJournalV15.get(journal);
  if (!handle) {
    handle = `correction-source-${++correctionSourceHandleSequenceV15}`;
    correctionSourceHandlesByJournalV15.set(journal, handle);
  }
  correctionSourcesByHandleV15.set(handle, { day, journal });
  return handle;
}

function resolveCorrectionSourceV15(handle) {
  return correctionSourcesByHandleV15.get(handle) || null;
}

function correctionLifecycleV15(date, journalId) {
  return state.shell.representedCorrections[`${date}:${journalId}`] || { records: [], activeRecordId: null, removal: null };
}

function activeCorrectionRecordV15(date, journalId) {
  const lifecycle = correctionLifecycleV15(date, journalId);
  return lifecycle.records.find((record) => record.id === lifecycle.activeRecordId) || null;
}

function correctionRecordTimestampV15(sourceType, updating) {
  if (updating) return CORRECTION_TIMES_V15.update;
  return sourceType === "Uploaded Journal" ? CORRECTION_TIMES_V15.uploadCreate : CORRECTION_TIMES_V15.voiceCreate;
}

function correctionRecordForIntentV15(correction, intentKey) {
  const lifecycle = correctionLifecycleV15(correction.date, correction.journalId);
  return {
    id: `represented-correction-${lifecycle.records.length + 1}`,
    ordinal: lifecycle.records.length + 1,
    text: correction.draft,
    author: CORRECTION_AUTHOR_V15,
    timestamp: correctionRecordTimestampV15(correction.sourceType, Boolean(correction.activeRecord)),
    baseRevisionLabel: correction.baseRevisionLabel,
    baseRevisionToken: correction.baseRevisionToken,
    intentKey,
    state: "Displayed",
  };
}

function correctionRemovalForIntentV15(correction, intentKey) {
  return {
    intentKey,
    timestamp: CORRECTION_TIMES_V15.removal,
    author: CORRECTION_AUTHOR_V15,
    sourceKey: `${correction.date}:${correction.journalId}`,
    baseRevisionToken: correction.baseRevisionToken,
    recordId: correction.activeRecord?.id || null,
  };
}

function nextCorrectionIntentV15(kind, correction) {
  correctionOperationSequenceV15 += 1;
  const saveLike = kind === "save" || kind === "fixture";
  const canonicalBase = correction.date === "2026-08-02" && correction.journalId === "v-02" && saveLike && !correction.activeRecord
    ? CORRECTION_INTENT_BASES_V15.voiceCreate
    : correction.date === "2026-08-08" && correction.journalId === "u-08" && saveLike
      ? correction.activeRecord
        ? CORRECTION_INTENT_BASES_V15.uploadUpdate
        : CORRECTION_INTENT_BASES_V15.uploadCreate
      : correction.date === "2026-08-08" && correction.journalId === "u-08" && kind === "remove"
        ? CORRECTION_INTENT_BASES_V15.uploadRemove
        : null;
  if (!canonicalBase) return `${kind}:${correction.date}:${correction.journalId}:${correctionOperationSequenceV15}`;
  const ordinal = (correctionIntentCountsV15.get(canonicalBase) || 0) + 1;
  correctionIntentCountsV15.set(canonicalBase, ordinal);
  if (ordinal === 1) return canonicalBase;
  return `${canonicalBase.slice(0, -2)}${String(ordinal).padStart(2, "0")}`;
}

function correctionOperationOriginV15(kind, correction, retry) {
  if (!retry) return `${kind}-user`;
  if (correction.intentResolution === "unknown") return `${kind}-status-check`;
  if (correction.intentResolution === "unknown-zero" && correction.unknownZeroRetryRemaining === 1) return `${kind}-unknown-zero-retry`;
  if (correction.intentResolution === "known-zero") return `${kind}-known-zero-retry`;
  return null;
}

function representCorrectionSourceRevisionChangeV15(correction) {
  const sourceKey = `${correction.date}:${correction.journalId}`;
  const currentRevision = state.shell.correctionSourceRevisions?.[sourceKey];
  if (!currentRevision || currentRevision.token !== correction.liveRevisionToken || currentRevision.epoch !== correction.liveRevisionEpoch) return false;
  const before = state.shell;
  dispatchShell("SOURCE_REVISION_CHANGED", {
    sourceKey,
    expectedToken: currentRevision.token,
    expectedEpoch: currentRevision.epoch,
    nextToken: `${correction.baseRevisionToken}:upstream-${currentRevision.epoch + 1}`,
  });
  return state.shell !== before;
}

function correctionOperationEnvelopeV15(token, correction, intentKey, operationOrigin, fixtureAuthority = null) {
  return Object.freeze({
    intentKey,
    operationKey: token.identity,
    operationId: token.id,
    operationGeneration: token.generation,
    operationOrigin,
    sourceSnapshot: correctionOperationSnapshotV15(correction),
    ...(fixtureAuthority ? { fixtureAuthority } : {}),
  });
}

function correctionCallbackEnvelopeV15(operation) {
  if (!operation) return null;
  return {
    intentKey: operation.intentKey,
    operationKey: operation.operationKey,
    operationId: operation.operationId,
    operationGeneration: operation.generation,
    operationOrigin: operation.origin,
    sourceSnapshot: operation.sourceSnapshot,
  };
}

function dispatchCorrectionCallbackV15(type, payload) {
  const before = state.shell;
  dispatchShell(type, payload);
  const accepted = state.shell !== before;
  if (accepted && type === "CORRECTION_SAVE_READY") correctionCallbackReplayV15.saveReady = payload;
  if (accepted && type === "CORRECTION_REMOVE_READY") correctionCallbackReplayV15.removeReady = payload;
  return accepted;
}

function clearCorrectionCallbackReplayV15() {
  correctionCallbackReplayV15 = { saveReady: null, removeReady: null };
  correctionCallbackProbeV15 = { foreignSaveIgnored: null, priorFlowSaveIgnored: null, staleEditorInputIgnored: null, staleSaveReadyIgnored: null, touchCompatibility: null };
  correctionHiddenSourceHandlesV15.clear();
}

function announceCorrectionV15(message, { assertive = false } = {}) {
  if (!correctionStatusLiveV15) return;
  correctionStatusLiveV15.setAttribute("aria-live", assertive ? "assertive" : "polite");
  queueLiveAnnouncementV10(correctionStatusLiveV15, message);
}

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

function uploadDayDomTokenV14(date) {
  return uploadDayDomHandlesV14.get(date) || date;
}

function ensureUploadDayDomTokenV14(date) {
  if (!days[date]) return date;
  if (!uploadDayDomHandlesV14.has(date)) {
    uploadDayDomHandlesV14.set(date, `upload-day-v14-${++uploadDayUiSequenceV14}`);
  }
  return uploadDayDomHandlesV14.get(date);
}

function resolveUploadDayDomTokenV14(value) {
  if (!value || isDateKey(value)) return value;
  return [...uploadDayDomHandlesV14.entries()].find(([, handle]) => handle === value)?.[0] || value;
}

function journalDayDisplayTitleV14(day) {
  return day?.uploadOnlyV14 && day.uploadDerivedStateV14 === "pending" ? "Journal Day" : day?.title || "Journal Day";
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
      ? `${cover.sourceLabel || "Telegram photo"} cover`
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
  if (cover?.kind === "photo") return `Calendar Cover · ${cover.sourceLabel || "Telegram photo"}`;
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
            ${assigning ? '<p class="date-review-status-v11 is-pending" id="date-review-operation-status-v11" aria-label="Assigning" tabindex="-1">Assigning…</p>' : ""}
            ${failed ? '<div class="date-review-status-v11 is-failure" id="date-review-assignment-failure-v11" role="alert" tabindex="-1"><strong>Journal Date was not assigned. The preserved item remains in Needs Date Review.</strong></div>' : ""}
            <p class="date-review-invariant-v11">Original Timestamp and source content will not change.</p>
            <div class="date-review-actions-v11">
              <button type="button" class="secondary-button" data-action="close-date-review-item">Cancel</button>
              ${failed ? `<button type="button" class="primary-button" data-action="retry-date-review-assignment" ${disconnected ? "disabled" : ""}>Retry assigning</button>` : `<button type="submit" class="primary-button" ${assigning ? 'aria-label="Assigning"' : ""} ${!valid || assigning || disconnected ? "disabled" : ""}>${assigning ? "Assigning…" : "Assign Journal Date"}</button>`}
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
      <strong>Throwaway UI prototype · v16</strong>
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
  const domDate = uploadDayDomTokenV14(date);
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
      data-date="${domDate}"
      data-calendar-date="${domDate}"
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
      ${day && !cover && !day.imageFailed ? `<span class="paper-day"><strong>${html(journalDayDisplayTitleV14(day))}</strong><small>${counts.journalCount} ${counts.journalCount === 1 ? "journal" : "journals"}</small></span>` : ""}
      ${day && cover && !isMosaic && !coverUnavailable ? `<span class="tile-caption"><strong>${html(journalDayDisplayTitleV14(day))}</strong><small>${counts.label}</small></span>` : ""}
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
  const domDate = uploadDayDomTokenV14(day.date);
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
          ${canRetry ? `<button type="button" class="secondary-button" data-action="retry-shell-image" data-date="${domDate}" data-photo-id="${html(cover.id)}" ${pending ? 'aria-label="Retrying image" aria-disabled="true"' : ""}>${pending ? "Retrying image…" : "Retry image"}</button>` : '<small>Restore the connection before retrying this image.</small>'}
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
  const domDate = uploadDayDomTokenV14(day.date);
  const isCurrent = state.almanacVisibleDate === day.date;
  const isRetainedSourceCaption = day.captureOnlyV13 && day.titleStatus === "Source caption";
  const isUploadPending = day.uploadOnlyV14 && day.uploadDerivedStateV14 === "pending";
  const isUploadStale = day.uploadDerivedStateV14 === "stale";
  return `
    <article class="almanac-chapter almanac-chapter-v9 ${state.selectedDate === day.date ? "is-selected" : ""} ${isCurrent ? "is-current" : ""}" id="chapter-${domDate}" data-chapter-date="${domDate}" aria-labelledby="almanac-day-title-${domDate}" tabindex="-1">
      <header class="almanac-chapter-heading-v9">
        <div>
          <p class="almanac-chapter-date-v9">${longDate(day.date)} · ${counts.label}</p>
          <span class="almanac-title-origin-v9">${isRetainedSourceCaption ? "Photo Caption · retained source" : isUploadPending ? "Derived state · not generated" : "Generated title · reading aid"}</span>
          <h3 id="almanac-day-title-${domDate}">${html(journalDayDisplayTitleV14(day))}</h3>
        </div>
        ${day.attention && !day.imageFailed ? `<span class="almanac-review-state">${isUploadStale ? "Source changed · refresh pending" : "Review update"}</span>` : ""}
      </header>
      ${chapterMedia(day)}
      ${isRetainedSourceCaption ? "" : isUploadPending ? `<div class="upload-derived-state-v14 is-pending"><strong>Waiting for source quiet period</strong><p>No title, summary, tags, or artwork were fabricated.</p></div>` : `${isUploadStale ? '<div class="upload-derived-state-v14 is-stale"><strong>Source changed · refresh pending</strong><p>Existing generated and protected values remain visible and unchanged. Artwork was not regenerated.</p></div>' : ""}<div class="almanac-reflection-preview-v9">
        <p class="eyebrow">Generated reflection · reading aid</p>
        <p class="almanac-summary-preview-v9">${html(day.summary)}</p>
        <ul aria-label="Selected tags">${day.tags.slice(0, 3).map((tag) => `<li>${html(tag)}</li>`).join("")}</ul>
      </div>`}
      <footer class="chapter-footer">
        <button type="button" class="primary-button almanac-read-day" data-action="open-full-day" data-date="${domDate}" aria-label="Read full Journal Day for ${longDate(day.date)}">Read full Journal Day</button>
        <button type="button" class="text-button" data-action="open-upload" data-date="${domDate}" aria-label="Upload journal for ${longDate(day.date)}">Upload journal</button>
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
        <button class="upload-quiet" type="button" data-action="open-upload">Upload journal</button>
      </div>
    </header>`;
}

function calendarSelection(day) {
  if (!day) return "";
  const domDate = uploadDayDomTokenV14(day.date);
  const cover = calendarCover(day);
  const coverUnavailable = Boolean(cover?.unavailable);
  const mediaPending = coverUnavailable && mediaStateForPhoto(cover)?.status === "pending";
  const canRetryMedia = state.shell.connection === "connected";
  const counts = dayCounts(day);
  const sourceLabel = day.imageFailed || coverUnavailable ? "Calendar Cover unavailable" : cover?.kind === "photo" ? `Calendar Cover · ${cover.sourceLabel || "Telegram photo"}` : cover?.kind === "artwork" ? "Calendar Cover · AI artwork" : "No cover image · Journal only";
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
        <figure id="museum-media-${domDate}" class="museum-figure${coverUnavailable ? " is-media-unavailable-v10" : ""}" tabindex="-1" aria-label="${html(sourceLabel)}">
          ${cover && !coverUnavailable
            ? `<img src="${html(cover.src)}" alt="${html(cover.alt)}" />`
            : `<div class="museum-paper-memory"><span>${dateParts(day.date).day}</span><p>${coverUnavailable ? "cover image unavailable" : html(journalDayDisplayTitleV14(day))}</p></div>`}
        </figure>
        <aside class="museum-placard" aria-label="Selected day details and provenance">
          <p class="museum-source">${sourceLabel}</p>
          ${coverUnavailable ? '<p class="surface-state-row-v10">This image could not be loaded. The photo record and authentic journals remain available; this prototype does not verify the Original.</p>' : ""}
          ${coverUnavailable ? canRetryMedia ? `<button type="button" class="secondary-button" data-action="retry-shell-image" data-date="${domDate}" data-photo-id="${html(cover.id)}" ${mediaPending ? 'aria-label="Retrying image" aria-disabled="true"' : ""}>${mediaPending ? "Retrying image…" : "Retry image"}</button>` : '<small>Restore the connection before retrying this image.</small>' : ""}
          <h2 id="calendar-selection-title">${html(journalDayDisplayTitleV14(day))}</h2>
          <p class="museum-date">${longDate(day.date)}</p>
          <p class="museum-counts">${counts.label}</p>
          ${day.attention ? `<div class="museum-attention"><strong>Needs attention</strong><span>${html(day.attention)}</span></div>` : ""}
          <p class="museum-description">${html(description)}</p>
          <dl class="museum-provenance">
            <div><dt>${day.imageFailed || coverUnavailable ? "Status" : cover?.kind === "photo" ? "Original Timestamp" : cover?.kind === "artwork" ? "Generation" : "Archive status"}</dt><dd>${html(sourceDetail)}</dd></div>
          </dl>
          ${day.imageFailed ? '<button type="button" class="secondary-button" data-action="retry-image">Retry image</button>' : ""}
          <button type="button" class="primary-button museum-open-day" data-action="open-full-day" data-date="${domDate}">Open full Journal Day</button>
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
            ${monthDays.length ? `<ol>${monthDays.map((day) => `<li><button type="button" data-action="select-almanac-chapter" data-date="${uploadDayDomTokenV14(day.date)}" ${state.almanacVisibleDate === day.date ? 'aria-current="location"' : ""}><span><strong>${shortDate(day.date)}</strong>${html(journalDayDisplayTitleV14(day))}</span><small>${almanacCoverIndicator(day)}</small></button></li>`).join("")}</ol>` : '<p class="almanac-index-empty-v9">No Journal Days</p>'}
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
    .filter((day) => {
      const searchableTitle = day.captureOnlyV13 && day.titleStatus === "Source caption" || day.uploadOnlyV14 ? "" : day.title;
      return !needle || [searchableTitle, day.summary, day.tags.join(" "), combinedJournalText(day)].join(" ").toLocaleLowerCase("en-IN").includes(needle);
    })
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
          const domDate = uploadDayDomTokenV14(day.date);
          const resultTitle = day.captureOnlyV13 && day.titleStatus === "Source caption" || day.uploadOnlyV14 ? "Journal Day" : day.title;
          return `<button type="button" class="search-result-card-v9" data-action="open-search-result" data-date="${domDate}" aria-label="${html(`${shortDate(day.date)}: ${resultTitle}${cover?.kind === "artwork" ? ", AI artwork" : ""}`)}" aria-describedby="search-result-description-${domDate}">
            <span class="search-result-media-v9 ${cover ? "has-media" : "is-paper"}">${cover ? `<img src="${html(cover.src)}" alt="" />` : `<span>${dateParts(day.date).day}</span>`}</span>
            <span class="search-result-copy-v9"><small>${shortDate(day.date)} · ${counts.label}${cover?.kind === "artwork" ? " · AI artwork" : ""}</small><strong>${html(resultTitle)}</strong><span id="search-result-description-${domDate}">${html(day.summary)}</span><em>${day.tags.map((tag) => html(tag)).join(" · ")}</em></span>
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
      <section class="settings-group" aria-labelledby="capture-source-a-settings-title-v14">
        <div class="settings-group-heading"><div><p class="eyebrow">Journal capture</p><h3 id="capture-source-a-settings-title-v14" tabindex="-1">VoiceNotes</h3></div><span class="settings-state is-neutral">${voiceNotesStatus}</span></div>
        ${settingsRows([
          { label: "Eligibility tag", value: "life-in-days", stateLabel: "Exact · read-only" },
          { label: "Integration Activation", value: "Not activated", detail: "Activation cannot be backdated through Settings." },
          { label: "Last reconciliation", value: "Never run in prototype" },
        ])}
        <p class="settings-boundary-copy">Only notes tagged exactly <code>life-in-days</code> and created at or after Integration Activation are eligible. Older notes are never imported automatically, even if edited or tagged later.</p>
      </section>
      <section class="settings-group" aria-labelledby="capture-source-b-settings-title-v14">
        <div class="settings-group-heading"><div><p class="eyebrow">Photo capture</p><h3 id="capture-source-b-settings-title-v14" tabindex="-1">Telegram</h3></div><span class="settings-state is-neutral">${telegramStatus}</span></div>
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

function captureSelectedFixtureV13() {
  return captureFixtureV13(state.capture.selection);
}

function captureLongDateV13(date) {
  return date ? dateReviewDisplayDate(date) : "Needs Date Review";
}

function captureGuideMarkupV13() {
  const expanded = captureSelectedFixtureV13().kind === "guide";
  return `
    <details class="telegram-guide" id="capture-guide-v14" ${expanded ? "open" : ""}>
    <summary id="capture-guide-summary-v14">Telegram photo guide</summary>
      <ol>${CAPTURE_GUIDE_V13.map((item) => `<li>${html(item)}</li>`).join("")}</ol>
    </details>`;
}

function capturePreviewMarkupV13(fixture) {
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

function captureInputMarkupV13() {
  const fixture = captureSelectedFixtureV13();
  if (fixture.kind === "guide") {
    return `<section class="telegram-empty" aria-labelledby="capture-selected-title-v14"><h2 id="capture-selected-title-v14" tabindex="-1">Synthetic Telegram message</h2><p>No Telegram activity is being read. Choose a synthetic message to inspect its path.</p></section>`;
  }
  if (fixture.kind === "authorization") {
    return `
      <article class="telegram-input" aria-labelledby="capture-selected-title-v14">
        <header><p class="eyebrow">Selected synthetic request</p><h2 id="capture-selected-title-v14" tabindex="-1">Synthetic Telegram message</h2></header>
        <p>Authorization is represented before media download. Media preview and metadata remain unavailable.</p>
      </article>`;
  }
  const isMedia = fixture.kind === "media";
  const isCaption = fixture.kind === "caption";
  const isDuplicate = fixture.kind === "duplicate";
  const unspecified = "Not specified in this synthetic fixture";
  const sourceForm = fixture.sourceForm || unspecified;
  const decodedFormat = fixture.format || unspecified;
  const messageTime = fixture.messageTime || unspecified;
  const receivedTime = fixture.receivedTime || unspecified;
  const rawCaption = fixture.rawCaption ?? fixture.raw ?? unspecified;
  return `
    <article class="telegram-input" aria-labelledby="capture-selected-title-v14">
        <header><p class="eyebrow">${isMedia ? "Media validation fixture" : isCaption ? "Caption grammar fixture" : isDuplicate ? "Duplicate handling fixture" : "Selected synthetic input"}</p><h2 id="capture-selected-title-v14" tabindex="-1">Synthetic Telegram message</h2><p class="telegram-status"><strong>${html(fixture.title || fixture.label)}</strong></p></header>
      <div class="telegram-input-grid">
        ${capturePreviewMarkupV13(fixture)}
        <dl class="telegram-facts">
          <div><dt>Source form</dt><dd>${html(sourceForm)}</dd></div>
          <div><dt>Decoded format</dt><dd>${html(decodedFormat)}</dd></div>
          <div><dt>Exact bytes</dt><dd>${fixture.bytes == null ? "Not specified in this synthetic fixture" : Number(fixture.bytes).toLocaleString("en-US")}</dd></div>
          <div><dt>Dimensions</dt><dd>${fixture.width == null || fixture.height == null ? "Not specified in this synthetic fixture" : `${Number(fixture.width).toLocaleString("en-US")} × ${Number(fixture.height).toLocaleString("en-US")} pixels`}</dd></div>
          <div><dt>Telegram message time</dt><dd>${html(messageTime)}</dd></div>
          <div><dt>Received by Life in Days</dt><dd>${html(receivedTime)}</dd></div>
          <div><dt>Raw caption</dt><dd class="telegram-caption">${html(rawCaption)}</dd></div>
          ${isDuplicate ? `<div><dt>Requested Journal Date</dt><dd>${html(captureLongDateV13(fixture.journalDate))}</dd></div><div><dt>Duplicate boundary</dt><dd>Different synthetic Telegram message · identical bytes represented only after validation</dd></div>` : ""}
          ${fixture.forwarded ? "<div><dt>Forwarded</dt><dd>Forwarded photo · current private chat authorization represented</dd></div>" : ""}
          ${fixture.key === "t3" ? "<div><dt>Received photos</dt><dd>3 received photos · each represented independently</dd></div>" : ""}
          ${fixture.note ? `<div><dt>Prototype detail</dt><dd>${html(fixture.note)}</dd></div>` : ""}
        </dl>
      </div>
    </article>`;
}

function captureStageStateV13(name) {
  const capture = state.capture;
  const selectedFixture = captureSelectedFixtureV13();
  const duplicateFixture = selectedFixture.kind === "duplicate" || selectedFixture.representedMatch === false;
  const order = duplicateFixture
    ? ["received", "authorizing", "validating", "duplicate-check", "waiting"]
    : ["received", "authorizing", "validating", "waiting"];
  const currentIndex = order.indexOf(capture.stage);
  const stageIndex = order.indexOf(name);
  if (capture.stage === name && capture.active) return { word: "In progress", modifier: "pending" };
  if (capture.stage === "interrupted" && capture.terminal?.decisionPreserved && duplicateFixture) {
    return stageIndex <= order.indexOf("duplicate-check")
      ? { word: "Complete", modifier: "complete" }
      : { word: "Unavailable", modifier: "unavailable" };
  }
  const interruptedAtIndex = order.indexOf(capture.terminal?.interruptedAt);
  if (["interrupted", "partial"].includes(capture.stage) && interruptedAtIndex >= 0) {
    return interruptedAtIndex > stageIndex
      ? { word: "Complete", modifier: "complete" }
      : { word: "Unavailable", modifier: "unavailable" };
  }
  if (currentIndex > stageIndex || ["captured-valid", "captured-review", "capture-failed", "media-accepted", "media-rejected", "authorization-rejected", "caption-result", "partial", "duplicate-decision", "duplicate-cancelled", "duplicate-check-failed", "duplicate-add-failed", "duplicate-added"].includes(capture.stage)) {
    const terminalBefore = (capture.stage === "authorization-rejected" && stageIndex > 1)
      || (["media-accepted", "media-rejected", "caption-result"].includes(capture.stage) && stageIndex > 2)
      || (["duplicate-decision", "duplicate-cancelled", "duplicate-check-failed"].includes(capture.stage) && stageIndex > 3);
    if (!terminalBefore) return { word: "Complete", modifier: "complete" };
  }
  return { word: "Unavailable", modifier: "unavailable" };
}

function capturePathMarkupV13() {
  const fixture = captureSelectedFixtureV13();
  if (fixture.kind === "guide" || state.capture.stage === "selected") {
    return `<section class="telegram-conversation" aria-labelledby="capture-path-title-v14"><h2 id="capture-path-title-v14">Simulated Telegram path</h2><p class="telegram-empty">No archive outcome has been represented.</p></section>`;
  }
  const authorizationRepresented = fixture.kind !== "authorization"
    && !["received", "authorizing", "selected", "guide"].includes(state.capture.stage);
  const stages = [
    ["received", "Received", "Synthetic input received in this browser."],
    ["authorizing", "Authorizing", authorizationRepresented ? "Authorized private chat represented" : "Private-chat authorization is represented before media download."],
    ["validating", "Validating", "Decoded type and inclusive per-file thresholds are evaluated."],
    ...(fixture.kind === "duplicate" || fixture.representedMatch === false ? [["duplicate-check", "Checking for identical bytes…", fixture.representedMatch === false ? "No identical-photo match is represented; the inherited capture path continues." : "A deterministic synthetic match is represented without displaying a checksum."]] : []),
    ["waiting", "Waiting for durable capture…", state.capture.albumProgress ? `${state.capture.albumProgress} received photos represented so far.` : "No acknowledgement is represented before a terminal result."],
  ];
  const terminal = state.capture.terminal;
  const terminalLabel = terminal?.type === "captured-valid" || terminal?.type === "duplicate-added" ? "Captured"
    : terminal?.type === "captured-review" ? "Needs Date Review"
      : terminal?.type === "authorization-rejected" ? "Request not accepted"
        : terminal?.type === "media-rejected" ? "Photo not added"
          : terminal?.type === "media-accepted" || terminal?.type === "caption-result" ? "Validation complete"
            : terminal?.type === "duplicate-decision" ? fixture.decisionHeading
              : terminal?.type === "interrupted" && terminal.decisionPreserved ? fixture.decisionHeading
              : terminal?.type === "duplicate-cancelled" ? "Duplicate not added"
                : terminal?.type === "duplicate-check-failed" ? "Duplicate check could not finish"
                  : terminal?.type === "duplicate-add-failed" ? "Duplicate photo was not added"
                    : terminal?.type === "partial" ? terminal.albumProgress === 3 ? "Final acknowledgement not represented" : "Waiting for another received photo"
              : terminal ? "Capture unavailable" : "Terminal outcome";
  const terminalState = terminal?.type === "captured-valid" || terminal?.type === "duplicate-added" || terminal?.type === "media-accepted" || terminal?.type === "caption-result" ? "complete"
    : terminal?.type === "captured-review" || terminal?.type === "partial" || terminal?.type === "duplicate-decision" || terminal?.type === "duplicate-cancelled" ? "attention"
      : terminal ? "attention" : "unavailable";
  return `
    <section class="telegram-conversation" aria-labelledby="capture-path-title-v14">
      <h2 id="capture-path-title-v14">Simulated Telegram path</h2>
      <ol class="telegram-path" ${state.capture.active ? 'aria-busy="true"' : ""}>
        ${stages.map(([key, title, copy]) => {
          const status = captureStageStateV13(key);
          return `<li><article class="telegram-stage telegram-stage--${status.modifier}" data-state="${status.modifier}"><div><h3>${title}</h3><p>${html(copy)}</p></div><span class="telegram-status">${status.word}</span></article></li>`;
        }).join("")}
        <li><article class="telegram-stage telegram-stage--${terminalState}" data-state="${terminalState}"><div><h3>${html(terminalLabel)}</h3><p>${terminal ? "A terminal prototype outcome is shown below." : "No terminal outcome yet."}</p></div><span class="telegram-status">${terminal ? terminalState === "complete" ? "Complete" : "Needs attention" : "Unavailable"}</span></article></li>
      </ol>
    </section>`;
}

function capturePrivateActionV13(action, label, { disabled = false } = {}) {
  return `<div class="telegram-action-pair"><button type="button" class="${action === "capture-review-date" ? "primary-button" : "secondary-button"}" data-action="${action}" ${disabled ? 'aria-disabled="true"' : ""}>${label}</button><span class="telegram-private-link">Private link · authentication required</span></div>`;
}

function captureFactsV13(fixture, { includeDestination = true } = {}) {
  const caption = fixture.key === "t3"
    ? "Received photo 1 · Sunday market flowers; received photos 2 and 3 · No Photo Caption"
    : fixture.photoCaption ? fixture.photoCaption : "No Photo Caption";
  const dateValue = fixture.journalDate ? captureLongDateV13(fixture.journalDate) : "Needs Date Review";
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

function captureDuplicateRelationshipMarkupV13(fixture, { existingDayAction = "capture-view-existing-duplicate-day" } = {}) {
  const referenceCount = Object.values(days).reduce((count, day) => count + (day.photos || []).filter((photo) => photo.mediaAssetKey === "represented-rain-window-v14").length, 0);
  const relationshipSummary = referenceCount === 2
    ? "Two distinct Daily Photos are represented as using one shared Media Asset."
    : `${referenceCount} distinct Daily Photos are represented as using one shared Media Asset.`;
  const crossDayLink = fixture.duplicateScope === "cross-day"
    ? `<div class="telegram-actions">${capturePrivateActionV13(existingDayAction, "View 13 August 2026")}</div>`
    : "";
  return `<section class="telegram-media-relationship-v14" aria-labelledby="capture-relationship-title-v14">
    <h3 id="capture-relationship-title-v14">Represented media relationship</h3>
    <p><strong>${html(relationshipSummary)}</strong></p>
    <p class="telegram-boundary">Prototype representation only · checksum matching, encryption, stored bytes, durable references, and physical deduplication are not verified.</p>
    <dl class="telegram-facts"><div><dt>Represented relationship</dt><dd>1 represented Media Asset · ${referenceCount} Daily Photo references</dd></div>${fixture.duplicateScope === "cross-day" ? "<div><dt>Web provenance</dt><dd>Same media as another day</dd></div>" : `<div><dt>Journal Date</dt><dd>${referenceCount} represented Daily Photos are on 13 August 2026.</dd></div>`}</dl>
    ${crossDayLink}
  </section>`;
}

function captureDuplicateOutcomeMarkupV13(fixture, terminal) {
  const disabled = state.shell.connection !== "connected" ? 'aria-disabled="true"' : "";
  if (terminal.type === "duplicate-decision" || (terminal.type === "interrupted" && terminal.decisionPreserved)) {
    const match = fixture.duplicateScope === "same-day" ? "Same Journal Date" : "Another Journal Date";
    const concurrentDecision = state.capture.duplicateBranch === "concurrent-permit"
      && captureConcurrentPermitLedgerV13.has(state.capture.fixtureIdentity);
    const decisionScope = concurrentDecision ? "<p><strong>Message A</strong></p>" : "";
    const currentResultLabel = concurrentDecision ? "Current result for Message A" : "Current result";
    const permitPending = state.capture.active?.intended === "duplicate-permit";
    const freshness = terminal.type === "interrupted"
      ? `<p class="telegram-boundary"><strong>Freshness unknown after connection interruption.</strong> Nothing resumed or changed automatically. Choose an action explicitly after the connection returns.</p>`
      : "";
    const pending = permitPending ? `<p class="telegram-boundary"><strong>Waiting for durable capture…</strong> Nothing is acknowledged until the represented reference commit finishes.</p>` : "";
    return `<section class="telegram-outcome telegram-outcome--review telegram-duplicate-decision-v14" data-state="review" aria-labelledby="capture-outcome-title-v14">
      <h2 id="capture-outcome-title-v14" tabindex="-1">${html(fixture.decisionHeading)}</h2>
      <div class="telegram-outcome-body">
        ${decisionScope}
        <p>${html(fixture.decisionCopy)}</p>
        ${freshness}
        ${pending}
        <dl class="telegram-facts">
          <div><dt>Match</dt><dd>${html(match)}</dd></div>
          <div><dt>Existing Journal Date</dt><dd>13 August 2026</dd></div>
          <div><dt>Requested Journal Date</dt><dd>${html(captureLongDateV13(fixture.journalDate))}</dd></div>
          <div><dt>Incoming Photo Caption</dt><dd class="telegram-caption">${html(fixture.photoCaption)}</dd></div>
          <div><dt>Incoming Original Timestamp</dt><dd>${html(fixture.originalTimestamp)} · Immutable</dd></div>
          <div><dt>${currentResultLabel}</dt><dd>No new Daily Photo</dd></div>
        </dl>
        <div class="telegram-duplicate-actions-v14">
          <button type="button" class="secondary-button" data-action="capture-duplicate-cancel" ${disabled}>Cancel</button>
          <button type="button" class="primary-button" data-action="capture-duplicate-permit" ${disabled || permitPending ? 'aria-disabled="true"' : ""}>${html(fixture.permitLabel)}</button>
        </div>
        <div class="telegram-actions telegram-existing-day-action-v14">${capturePrivateActionV13("capture-view-existing-duplicate-day", "View 13 August 2026", { disabled: state.shell.connection !== "connected" || permitPending })}</div>
      </div>
    </section>`;
  }
  if (terminal.type === "duplicate-cancelled") {
    const concurrentScope = state.capture.duplicateBranch === "concurrent-permit"
      && captureConcurrentPermitLedgerV13.has(state.capture.fixtureIdentity)
      ? "<p><strong>Message A</strong></p>"
      : "";
    const concurrentStateScope = concurrentScope ? "For message A · " : "";
    return `<section class="telegram-outcome telegram-outcome--review" data-state="review" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Duplicate not added</h2><div class="telegram-outcome-body">${concurrentScope}<p>Nothing was added. The existing Daily Photo is unchanged.</p><p><strong>${concurrentStateScope}No new Daily Photo · no Journal Day change · no Media Asset change</strong></p></div></section>`;
  }
  if (terminal.type === "duplicate-check-failed") {
    return `<section class="telegram-outcome telegram-outcome--failure" data-state="failure" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Duplicate check could not finish</h2><div class="telegram-outcome-body"><p>Nothing was added because Life in Days could not check for an existing photo.</p><p><strong>No new Daily Photo · existing archive unchanged · safe to retry</strong></p><div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-retry" ${disabled}>Try again</button></div></div></section>`;
  }
  if (terminal.type === "duplicate-add-failed") {
    const concurrentScope = state.capture.duplicateBranch === "concurrent-permit"
      && captureConcurrentPermitLedgerV13.has(state.capture.fixtureIdentity)
      ? "<p><strong>Message A</strong></p>"
      : "";
    return `<section class="telegram-outcome telegram-outcome--failure" data-state="failure" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Duplicate photo was not added</h2><div class="telegram-outcome-body">${concurrentScope}<p>Life in Days could not finish saving the new Daily Photo. Nothing changed.</p><p><strong>No new Daily Photo · existing archive unchanged · safe to retry</strong></p><div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-retry" ${disabled}>Try again</button></div></div></section>`;
  }
  if (terminal.type === "duplicate-added") {
    const destination = days[fixture.journalDate];
    return `<section class="telegram-outcome telegram-outcome--accepted" data-state="accepted" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Life in Days outcome</h2><div class="telegram-outcome-body"><p><strong>${html(fixture.success)}</strong></p>${captureFactsV13(fixture, { includeDestination: false })}<dl class="telegram-facts"><div><dt>Incoming Photo Caption</dt><dd class="telegram-caption">${html(fixture.photoCaption)}</dd></div><div><dt>Incoming Original Timestamp</dt><dd>${html(fixture.originalTimestamp)} · Immutable</dd></div><div><dt>Requested Journal Day</dt><dd>${destination ? html(dayCounts(destination).label) : "0 photos · 0 journals"}</dd></div><div><dt>Represented archive result</dt><dd>One distinct Daily Photo and Source Item reference represented after explicit permission.</dd></div></dl><div class="telegram-actions">${capturePrivateActionV13("capture-view-day", "View day")}</div>${captureDuplicateRelationshipMarkupV13(fixture)}</div></section>`;
  }
  return "";
}

function captureConcurrentSecondaryOutcomeMarkupV13(fixture) {
  if (fixture.kind !== "duplicate" || state.capture.duplicateBranch !== "concurrent-permit") return "";
  const ledger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
  if (!ledger || ledger.secondaryStatus !== "added") return "";
  const reference = captureDuplicateReferenceByIdentityV13.get(ledger.secondaryIdentity);
  const destination = reference ? days[reference.date] : null;
  if (!reference || !destination?.photos?.some((photo) => photo.id === reference.photoId)) return "";
  const relationshipAlreadyShown = state.capture.terminal?.type === "duplicate-added";
  return `<section class="telegram-outcome telegram-outcome--accepted telegram-concurrent-secondary-outcome-v14" data-state="accepted" aria-labelledby="capture-secondary-outcome-title-v14">
    <h2 id="capture-secondary-outcome-title-v14" tabindex="-1">Different message result</h2>
    <div class="telegram-outcome-body">
      <p><strong>${html(fixture.success)}</strong></p>
      <p>A separately permitted synthetic message created exactly one distinct Daily Photo and Source Item reference.</p>
      <dl class="telegram-facts"><div><dt>Message B</dt><dd>Added after its own explicit permit</dd></div><div><dt>Requested Journal Day</dt><dd>${html(dayCounts(destination).label)}</dd></div><div><dt>Incoming Photo Caption</dt><dd class="telegram-caption">${html(fixture.photoCaption)}</dd></div><div><dt>Incoming Original Timestamp</dt><dd>${html(fixture.originalTimestamp)} · Immutable</dd></div></dl>
      <div class="telegram-actions">${capturePrivateActionV13("capture-view-concurrent-day", "View day")}</div>
      ${relationshipAlreadyShown ? "" : captureDuplicateRelationshipMarkupV13(fixture, { existingDayAction: "capture-view-concurrent-existing-day" })}
    </div>
  </section>`;
}

function captureOutcomeMarkupV13() {
  const fixture = captureSelectedFixtureV13();
  const terminal = state.capture.terminal;
  if (fixture.kind === "duplicate" && state.capture.active?.intended === "duplicate-permit" && terminal?.type === "duplicate-decision") {
    return `${captureDuplicateOutcomeMarkupV13(fixture, terminal)}${captureConcurrentSecondaryOutcomeMarkupV13(fixture)}`;
  }
  if (!terminal || (fixture.kind === "duplicate" && state.capture.active)) {
    const duplicatePending = fixture.kind === "duplicate" && state.capture.active
      ? state.capture.stage === "duplicate-check"
        ? "Checking for identical bytes… Nothing has been added."
        : state.capture.stage === "waiting"
          ? "Waiting for durable capture… No success acknowledgement has been represented."
          : "The synthetic request is being evaluated. Nothing has been added."
      : "No archive outcome has been represented.";
    return `<section class="telegram-outcome" data-state="pending" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14">Life in Days outcome</h2><div class="telegram-outcome-body"><p>${html(duplicatePending)}</p></div></section>`;
  }
  if (["duplicate-decision", "duplicate-cancelled", "duplicate-check-failed", "duplicate-add-failed", "duplicate-added"].includes(terminal.type)
    || (terminal.type === "interrupted" && terminal.decisionPreserved)) {
    return `${captureDuplicateOutcomeMarkupV13(fixture, terminal)}${captureConcurrentSecondaryOutcomeMarkupV13(fixture)}`;
  }
  if (terminal.type === "authorization-rejected") {
    return `<section class="telegram-outcome telegram-outcome--rejected" data-state="rejected" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Request not accepted</h2><div class="telegram-outcome-body"><p>This request was not accepted. No photo was downloaded or added.</p><p><strong>Rejected before media download · no Source Item</strong></p><p>No Telegram reply is represented.</p></div></section>`;
  }
  if (terminal.type === "media-rejected") {
    return `<section class="telegram-outcome telegram-outcome--rejected" data-state="rejected" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Photo not added</h2><div class="telegram-outcome-body"><p>${html(terminal.message)}</p><p><strong>No Source Item was created. The Telegram message remains in this chat.</strong></p>${terminal.detail ? `<details><summary>Prototype gate details</summary><p>${html(terminal.detail)}</p></details>` : ""}</div></section>`;
  }
  if (terminal.type === "media-accepted") {
    return `<section class="telegram-outcome telegram-outcome--accepted" data-state="accepted" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14">Life in Days outcome</h2><div class="telegram-outcome-body"><p>${html(terminal.message)}</p><p>No archive outcome has been represented by this validation fixture.</p></div></section>`;
  }
  if (terminal.type === "caption-result") {
    const analysis = terminal.analysis;
    const caption = analysis.photoCaption ? analysis.photoCaption : "No Photo Caption";
    return `<section class="telegram-outcome ${analysis.review ? "telegram-outcome--review" : "telegram-outcome--accepted"}" data-state="${analysis.review ? "review" : "accepted"}" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14">Caption result</h2><div class="telegram-outcome-body"><dl class="telegram-facts"><div><dt>Leading instruction</dt><dd>${analysis.matched ? "Exact-shaped token matched" : "No leading date instruction matched"}</dd></div><div><dt>Journal Date source</dt><dd>${html(analysis.dateSource)}</dd></div><div><dt>Journal Date</dt><dd>${analysis.journalDate ? html(captureLongDateV13(analysis.journalDate)) : "Needs Date Review"}</dd></div><div><dt>Photo Caption state</dt><dd class="telegram-caption">${html(caption)}</dd></div>${analysis.reviewReason ? `<div><dt>Review reason</dt><dd>${html(analysis.reviewReason)}</dd></div>` : ""}</dl><p>No Source Item or archive change is represented by this grammar fixture.</p></div></section>`;
  }
  if (terminal.type === "captured-review") {
    if (terminal.reviewResolved || state.capture.reviewResolved) {
      return `<section class="telegram-outcome telegram-outcome--accepted" data-state="accepted" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Journal Date assigned</h2><div class="telegram-outcome-body"><p>The matching item is no longer unresolved in Needs Date Review.</p><p>Returning here did not recreate the item or repeat its capture acknowledgement.</p></div></section>`;
    }
    return `<section class="telegram-outcome telegram-outcome--review" data-state="review" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14">Life in Days outcome</h2><div class="telegram-outcome-body"><p>${html(fixture.reviewMessage)}</p><p><strong>${html(fixture.reviewBoundary)}</strong></p>${captureFactsV13(fixture, { includeDestination: false })}<dl class="telegram-facts"><div><dt>Product-defined destination effect</dt><dd>Needs Date Review only · no Calendar or Almanac change.</dd></div><div><dt>Represented archive result</dt><dd>One undated holding item represented after media and holding-record completion.</dd></div></dl><div class="telegram-actions">${capturePrivateActionV13("capture-review-date", "Review date")}</div></div></section>`;
  }
  if (terminal.type === "capture-failed" || terminal.type === "interrupted") {
    const disconnected = state.shell.connection !== "connected";
    const message = terminal.type === "interrupted"
      ? "The capture result is unavailable while the connection is interrupted. Nothing was queued or added."
      : fixture.failure || "Photo was not saved because Life in Days could not finish storing it. Nothing was added. The Telegram message remains in this chat.";
    const stateLine = fixture.failureState || "No Source Item · no Journal Day change · safe to retry";
    return `<section class="telegram-outcome telegram-outcome--failure" data-state="failure" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">Photo not saved</h2><div class="telegram-outcome-body"><p>${html(message)}</p><p><strong>${html(stateLine)}</strong></p>${captureFactsV13(fixture, { includeDestination: false })}<div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-retry" ${disconnected ? 'aria-disabled="true"' : ""}>Try again</button></div></div></section>`;
  }
  if (terminal.type === "partial") {
    const count = Math.max(1, Math.min(3, Number(terminal.albumProgress) || 1));
    const members = count === 1 ? "Received photo 1 is" : count === 2 ? "Received photos 1 and 2 are" : "Received photos 1, 2, and 3 are";
    const heading = count === 3 ? "Final acknowledgement not represented" : "Waiting for another received photo";
    const attemptNote = terminal.continuationAttemptAddedNothing ? "<p><strong>The new continuation attempt added nothing.</strong> The already represented photos remain unchanged.</p>" : "";
    const retryAction = terminal.retryAvailable
      ? `<div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-retry" ${state.shell.connection !== "connected" ? 'aria-disabled="true"' : ""}>Try again</button></div>`
      : "";
    return `<section class="telegram-outcome telegram-outcome--review" data-state="review" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14" tabindex="-1">${heading}</h2><div class="telegram-outcome-body"><p>${count} of 3 received photos have been represented so far.</p><p>${members} represented durably. No complete-album claim or terminal Telegram acknowledgement is represented.</p>${attemptNote}${retryAction}</div></section>`;
  }
  const isT7 = fixture.key === "t7";
  const actions = isT7 ? "" : (fixture.actions || []).map((action) => action === "view-day"
    ? capturePrivateActionV13("capture-view-day", "View day")
    : capturePrivateActionV13("capture-change-date", "Change Journal Date")).join("");
  return `<section class="telegram-outcome telegram-outcome--accepted" data-state="accepted" aria-labelledby="capture-outcome-title-v14"><h2 id="capture-outcome-title-v14">Life in Days outcome</h2><div class="telegram-outcome-body"><p><strong>${html(fixture.success)}</strong></p>${captureFactsV13(fixture, { includeDestination: !isT7 })}<dl class="telegram-facts"><div><dt>Represented archive result</dt><dd>${isT7 ? "One Daily Photo attachment represented after exactly one retry success." : "The Product-defined Daily Photo attachment and destination recalculation are represented once."}</dd></div></dl>${actions ? `<div class="telegram-actions">${actions}</div>` : ""}</div></section>`;
}

function renderCaptureChangeDateV13() {
  const fixture = captureSelectedFixtureV13();
  return `<main id="prototype-main" class="telegram-handoff-page telegram-change-date" tabindex="-1"><button type="button" class="telegram-back" data-action="capture-handoff-back"><span aria-hidden="true">←</span> Back</button><header><p class="eyebrow">Private photo capture</p><h1 id="capture-change-title-v14" tabindex="-1">Change Journal Date</h1><p class="telegram-private-link">Private link · authentication required</p></header><dl class="telegram-facts"><div><dt>Source type</dt><dd>${html(fixture.sourceForm)}</dd></div><div><dt>Current Journal Date</dt><dd>${html(captureLongDateV13(fixture.journalDate))}</dd></div><div><dt>Original Timestamp</dt><dd>${html(fixture.originalTimestamp)} · Immutable</dd></div></dl><p class="telegram-note"><strong>Date change action is not part of this prototype.</strong></p></main>`;
}

function renderCaptureCompanionV13() {
  if (state.capture.surface === "change-date") return renderCaptureChangeDateV13();
  const fixture = captureSelectedFixtureV13();
  const active = Boolean(state.capture.active);
  const committed = Boolean(state.capture.fixtureIdentity && captureCommittedIdentitiesV13.has(state.capture.fixtureIdentity));
  const retryOnly = ["capture-failed", "interrupted", "duplicate-check-failed", "duplicate-add-failed"].includes(state.capture.terminal?.type) || Boolean(state.capture.terminal?.retryAvailable);
  const duplicateSettled = fixture.kind === "duplicate" && ["duplicate-decision", "duplicate-cancelled", "duplicate-added"].includes(state.capture.terminal?.type);
  const canRun = fixture.kind !== "guide" && !committed && !retryOnly && !duplicateSettled && state.shell.connection === "connected";
  return `
    <main id="prototype-main" class="telegram-capture-page" tabindex="-1">
      <button type="button" class="telegram-back" data-action="capture-back"><span aria-hidden="true">←</span> Back</button>
      <header class="telegram-capture-header">
        <p class="eyebrow">Private photo capture</p>
        <h1 id="capture-title-v14" tabindex="-1">Telegram Capture Companion</h1>
        <p class="telegram-intro">See what Life in Days accepts and how each Telegram outcome reaches your private archive.</p>
        <p class="telegram-boundary">Prototype data · no Telegram connection · no messages sent · no persistence</p>
        <p class="telegram-note">Prototype date · 13 August 2026 · Asia/Kolkata</p>
        ${fixture.kind === "guide" ? "" : `<p class="telegram-status">Selected synthetic state · ${fixture.kind === "authorization" ? "Authorization rejection fixture" : html(fixture.label || fixture.title)}</p>`}
      </header>
      <div class="telegram-input-summary">
        ${captureInputMarkupV13()}
      </div>
      <div class="telegram-layout">
        <div class="telegram-conversation">
          ${fixture.kind === "guide" ? "" : `<div class="telegram-actions"><button type="button" class="primary-button" data-action="capture-run" ${active ? 'aria-label="Running selected fixture"' : ""} ${active || !canRun ? 'aria-disabled="true"' : ""}>${active ? "Running selected fixture…" : "Run selected fixture"}</button></div>`}
          ${capturePathMarkupV13()}
        </div>
        <aside class="telegram-side">
          ${captureOutcomeMarkupV13()}
          ${captureGuideMarkupV13()}
        </aside>
      </div>
    </main>`;
}

function initializeConcurrentPermitLedgerV13() {
  const fixture = captureSelectedFixtureV13();
  const primaryIdentity = state.capture.fixtureIdentity;
  if (fixture.kind !== "duplicate" || !primaryIdentity || state.capture.duplicateBranch !== "concurrent-permit") return null;
  if (!captureConcurrentPermitLedgerV13.has(primaryIdentity)) {
    captureConcurrentPermitLedgerV13.set(primaryIdentity, {
      generation: state.capture.generation,
      selectionKey: state.capture.selection.key,
      secondaryIdentity: nextCaptureSyntheticIdentityV13(),
      secondaryStatus: "decision",
      secondaryPermitGranted: false,
      secondaryAcknowledged: false,
      repeatedCallbackGuarded: false,
      freshnessUnknown: false,
    });
  }
  return captureConcurrentPermitLedgerV13.get(primaryIdentity);
}

function captureConcurrentPermitMarkupV13(fixture) {
  if (fixture.kind !== "duplicate" || state.capture.duplicateBranch !== "concurrent-permit") return "";
  const ledger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
  if (!ledger) return "";
  const primaryTerminal = state.capture.terminal?.type;
  const primaryStatus = captureCommittedIdentitiesV13.has(state.capture.fixtureIdentity)
    ? "Added"
    : primaryTerminal === "duplicate-cancelled" ? "Cancelled"
      : state.capture.active?.intended === "duplicate-permit" ? "Permit pending"
        : primaryTerminal === "duplicate-add-failed" ? "Add failed · explicit retry available"
          : primaryTerminal === "interrupted" ? "Freshness unknown · explicit action required after reconnect"
            : "Decision ready";
  const primaryActionHint = primaryTerminal === "duplicate-decision"
    && !state.capture.active
    && state.shell.connection === "connected"
    && state.shell.phase === "ready"
    && !ledger.freshnessUnknown
    ? " · use the product decision action"
    : "";
  const secondaryStatus = ledger.secondaryStatus === "added" ? "Added"
    : ledger.secondaryStatus === "pending" ? "Permit pending" : "Decision ready";
  const representedReferenceCount = Object.values(days).reduce((count, day) => count + (day.photos || []).filter((photo) => photo.mediaAssetKey === "represented-rain-window-v14").length, 0);
  const representedReferenceLabel = `${representedReferenceCount} Daily Photo ${representedReferenceCount === 1 ? "reference" : "references"}`;
  const ledgerIsCurrent = ledger.generation === state.capture.generation && ledger.selectionKey === state.capture.selection.key;
  const disabled = ledger.secondaryStatus !== "decision" || !ledgerIsCurrent || state.shell.connection !== "connected" || state.shell.phase !== "ready";
  return `<fieldset class="telegram-fixture-group telegram-concurrent-proof-v14"><legend>Concurrent different-message proof</legend><p>Two distinct synthetic message identities are represented. Each can change the archive only after its own explicit permit.</p><dl class="telegram-facts"><div><dt>Message A</dt><dd>${html(primaryStatus)}${primaryActionHint}</dd></div><div><dt>Message B</dt><dd>${html(secondaryStatus)}</dd></div><div><dt>Represented relationship</dt><dd>1 represented Media Asset · ${html(representedReferenceLabel)}</dd></div><div><dt>Repeated callback</dt><dd>${ledger.repeatedCallbackGuarded ? "Ignored after the first settled result" : "Not delivered"}</dd></div></dl><button type="button" class="text-button" data-action="capture-concurrent-permit-secondary" ${disabled ? 'aria-disabled="true"' : ""}>Permit different message B</button>${ledger.freshnessUnknown ? '<p class="telegram-boundary">Freshness unknown after interruption · nothing resumed automatically</p>' : ""}</fieldset>`;
}

function duplicateFollowupWouldRequireMultiPriorDatePolicyV13(fixture) {
  return fixture.kind === "duplicate"
    && fixture.duplicateScope === "cross-day"
    && Boolean(days[fixture.journalDate]?.photos?.some((photo) => photo.mediaAssetKey === "represented-rain-window-v14"));
}

function renderCaptureFixtureConsoleV13() {
  const fixture = captureSelectedFixtureV13();
  const buttons = (entries, group) => entries.map(([key, label]) => `<button type="button" class="text-button" data-action="capture-select" data-capture-group="${group}" data-capture-key="${key}" aria-pressed="${state.capture.selection.group === group && state.capture.selection.key === key}">${html(label)}</button>`).join("");
  const concurrentLedger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
  const concurrentSecondaryPending = concurrentLedger?.secondaryStatus === "pending";
  const differentMessageNeedsFuturePolicy = duplicateFollowupWouldRequireMultiPriorDatePolicyV13(fixture);
  const differentMessageAvailable = !differentMessageNeedsFuturePolicy && !concurrentSecondaryPending;
  const duplicateIdentityActions = fixture.kind === "duplicate" && ["duplicate-added", "duplicate-cancelled"].includes(state.capture.terminal?.type)
    ? `<div class="telegram-actions"><button type="button" class="text-button" data-action="capture-replay-duplicate-message">Replay same message</button>${differentMessageAvailable ? '<button type="button" class="text-button" data-action="capture-deliver-different-duplicate-message">Deliver different equal-byte message</button>' : ""}</div>${differentMessageNeedsFuturePolicy ? '<p class="telegram-boundary">A further equal-byte message after references exist on multiple dates needs a future Product decision and is outside this bounded v14 fixture.</p>' : ""}`
    : fixture.kind === "duplicate" && state.capture.active
      ? `<div class="telegram-actions"><button type="button" class="text-button" data-action="capture-replay-pending-duplicate-message">Replay same pending message</button></div>`
      : "";
  return `<section class="telegram-fixture-group-v14 telegram-console" aria-labelledby="capture-console-title-v14"><h3 id="capture-console-title-v14">Telegram Capture Companion · synthetic states</h3><p>Live-memory-only fixtures. No control calls Telegram, a server, AI, or the network.</p><p class="prototype-data-label-v9">Current capture state · ${html(fixture.label || fixture.title || "Guide")} · ${html(state.capture.stage.replaceAll("-", " "))}<span data-capture-replay-proof-v14>${state.capture.replayGuarded ? ` · ${html(state.capture.replayProof)}` : ""}</span></p>${duplicateIdentityActions}${captureConcurrentPermitMarkupV13(fixture)}<div class="telegram-console-grid">
    <fieldset class="telegram-fixture-group"><legend>Scenario</legend><div class="telegram-fixture-controls-v14">${buttons(Object.values(CAPTURE_SCENARIOS_V13).map((item) => [item.key, item.label]), "scenario")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Authorization</legend><div class="telegram-fixture-controls-v14">${buttons(Object.entries(CAPTURE_AUTHORIZATION_FIXTURES_V13), "authorization")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Duplicate handling</legend><div class="telegram-fixture-controls-v14">${buttons(Object.entries(CAPTURE_DUPLICATE_FIXTURES_V13).map(([key, item]) => [key, item.label]), "duplicate")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Media validation</legend><div class="telegram-fixture-controls-v14">${buttons(Object.entries(CAPTURE_MEDIA_FIXTURES_V13).map(([key, item]) => [key, item.label]), "media")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Caption grammar</legend><div class="telegram-fixture-controls-v14">${buttons(Object.entries(CAPTURE_CAPTION_FIXTURES_V13).map(([key, item]) => [key, item.label]), "caption")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Operation</legend><div class="telegram-fixture-controls-v14">${Object.entries(CAPTURE_OPERATION_BRANCHES_V13).map(([key, label]) => `<button type="button" class="text-button" data-action="capture-branch" data-capture-branch="${key}" aria-pressed="${state.capture.branch === key}" ${fixture.kind === "duplicate" ? 'aria-disabled="true"' : ""}>${html(label)}</button>`).join("")}</div></fieldset>
    <fieldset class="telegram-fixture-group"><legend>Duplicate operation</legend><div class="telegram-fixture-controls-v14">${Object.entries(CAPTURE_DUPLICATE_BRANCHES_V13).map(([key, label]) => `<button type="button" class="text-button" data-action="capture-duplicate-branch" data-capture-branch="${key}" aria-pressed="${state.capture.duplicateBranch === key}" ${state.capture.active ? 'aria-disabled="true"' : ""}>${html(label)}</button>`).join("")}</div></fieldset>
  </div><div class="telegram-actions"><button type="button" class="secondary-button" data-action="capture-open-selected">Open selected state</button><button type="button" class="text-button" data-action="capture-reset">Reset capture companion</button></div></section>`;
}

function dispatchCaptureV13(type, payload = {}) {
  state.capture = transitionCaptureV13(state.capture, type, payload);
  return state.capture;
}

function announceCaptureV13(message) {
  captureAnnouncementEpochV13 += 1;
  const epoch = captureAnnouncementEpochV13;
  if (!captureStatusLiveV13) return;
  captureStatusLiveV13.setAttribute("aria-live", "polite");
  captureStatusLiveV13.textContent = "";
  requestAnimationFrame(() => {
    if (epoch === captureAnnouncementEpochV13) captureStatusLiveV13.textContent = message;
  });
}

function clearCaptureAnnouncementV13() {
  captureAnnouncementEpochV13 += 1;
  if (!captureStatusLiveV13) return;
  captureStatusLiveV13.setAttribute("aria-live", "polite");
  captureStatusLiveV13.textContent = "";
}

function clearCaptureTimersV13(token = null) {
  for (const [key, entry] of captureTimersV13) {
    if (token && entry.tokenId !== token.id) continue;
    window.clearTimeout(entry.timer);
    captureTimersV13.delete(key);
  }
}

function captureOperationIsCurrentV13(token, { requireConnection = true } = {}) {
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

function scheduleCaptureV13(token, label, delay, callback, { requireConnection = true } = {}) {
  const key = `${token.id}:${label}`;
  const timer = window.setTimeout(() => {
    captureTimersV13.delete(key);
    if (!captureOperationIsCurrentV13(token, { requireConnection })) return;
    callback();
  }, delay);
  captureTimersV13.set(key, { timer, tokenId: token.id });
}

function scheduleCaptureContinuationV13(token, label, delay, callback) {
  const key = `${token.id}:continuation:${label}`;
  const timer = window.setTimeout(() => {
    captureTimersV13.delete(key);
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
  captureTimersV13.set(key, { timer, tokenId: token.id });
}

function captureDurableMemberCountV13(identity = state.capture.fixtureIdentity) {
  if (!identity) return 0;
  return [1, 2, 3].filter((member) => captureCommittedIdentitiesV13.has(`${identity}:member-${member}`)).length;
}

function cancelCaptureOperationsV13({ keepTerminal = false, stage = "selected", terminal = null, continuationAttemptAddedNothing = false, retryAvailable = false, preserveConcurrentSecondary = false } = {}) {
  const concurrentLedger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
  const concurrentWasPending = concurrentLedger?.secondaryStatus === "pending";
  const activeIntent = state.capture.active?.intended || null;
  const interruptionPreservesPrimaryDecision = terminal?.type === "interrupted"
    && activeIntent === "duplicate-permit";
  const preserveConcurrentDecision = concurrentLedger?.secondaryStatus === "decision"
    && (preserveConcurrentSecondary || keepTerminal || interruptionPreservesPrimaryDecision);
  if (concurrentWasPending && !preserveConcurrentSecondary) {
    concurrentLedger.secondaryStatus = "decision";
    concurrentLedger.secondaryPermitGranted = false;
    concurrentLedger.freshnessUnknown = terminal?.type === "interrupted" || Boolean(terminal?.freshnessUnknown);
  }
  const interruptedTerminal = terminal?.type === "interrupted"
    ? {
      ...terminal,
      interruptedAt: terminal.interruptedAt || state.capture.stage,
      interruptedStep: terminal.interruptedStep || activeIntent,
      ...(activeIntent === "duplicate-permit" ? { decisionPreserved: true } : {}),
    }
    : terminal;
  const durableMemberCount = state.capture.active && captureSelectedFixtureV13().key === "t3"
    ? captureDurableMemberCountV13()
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
  if (preserveConcurrentSecondary && (concurrentWasPending || preserveConcurrentDecision)) {
    if (state.capture.active) clearCaptureTimersV13(state.capture.active);
  } else clearCaptureTimersV13();
  dispatchCaptureV13("CANCEL", {
    keepTerminal: keepTerminal || Boolean(cancellationTerminal),
    stage: cancellationTerminal?.stage || stage,
    terminal: cancellationTerminal,
  });
  if (concurrentWasPending || preserveConcurrentDecision) concurrentLedger.generation = state.capture.generation;
  clearCaptureAnnouncementV13();
}

function resetCaptureReviewSeedV13() {
  cancelDateReviewOperationsV11();
  restoreDateReviewDestinationsV11();
  const branch = state.dateReview?.branch || "success";
  state.dateReview = dateReviewFixtureState("date-review/empty", (state.dateReview?.generation || 0) + 1, branch);
}

function selectCaptureFixtureV13(selection, { open = true, push = false, preserveAsyncFocus = false } = {}) {
  const activeBeforeReset = preserveAsyncFocus ? document.activeElement : null;
  const focusWasUnclaimed = !activeBeforeReset
    || activeBeforeReset === document.body
    || activeBeforeReset === document.documentElement
    || activeBeforeReset === root;
  const activeSelector = preserveAsyncFocus ? selectorForLogicalFocus(activeBeforeReset) : null;
  const fixture = captureFixtureV13(selection);
  const safeSelection = fixture.kind === "guide" ? { group: "scenario", key: "guide" } : selection;
  cancelCaptureOperationsV13();
  resetCaptureReviewSeedV13();
  restoreCaptureArchiveBaselineV13();
  const fixtureIdentity = fixture.kind === "guide" ? null : nextCaptureSyntheticIdentityV13();
  dispatchCaptureV13("SELECT", { selection: safeSelection, fixtureIdentity });
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
    state.focusAfterRender = preserveAsyncFocus ? null : "#capture-selected-title-v14";
    syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  } else {
    state.focusAfterRender = preserveAsyncFocus ? null : "#capture-selected-title-v14";
    syncUrl({ push });
  }
  render();
  if (!preserveAsyncFocus) {
    withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
    return;
  }
  const activeSelectorSurvives = activeSelector && resolveLogicalSelector(activeSelector);
  const originOwnedFocus = ['[data-action="capture-run"]', '[data-action="capture-retry"]', '[data-action="capture-duplicate-permit"]']
    .includes(activeSelector);
  const activeSelectorWasRemoved = Boolean(activeSelector && !activeSelectorSurvives);
  const guardedSelector = activeSelectorSurvives && !originOwnedFocus
    ? activeSelector
    : focusWasUnclaimed || originOwnedFocus || activeSelectorWasRemoved
      ? "#capture-selected-title-v14"
      : null;
  if (!guardedSelector) return;
  if (guardedSelector === "#capture-selected-title-v14") {
    withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }
  syncUrl({ scrollY: window.scrollY, focusSelector: guardedSelector, focusTop: null });
  reinforceNavigationFocusV13(guardedSelector, "telegram-capture", "companion");
}

function deliverDifferentDuplicateMessageV13() {
  const fixture = captureSelectedFixtureV13();
  const concurrentLedger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
  if (fixture.kind !== "duplicate"
    || state.capture.active
    || concurrentLedger?.secondaryStatus === "pending"
    || duplicateFollowupWouldRequireMultiPriorDatePolicyV13(fixture)
    || !["duplicate-added", "duplicate-cancelled"].includes(state.capture.terminal?.type)) return;
  clearCaptureTimersV13();
  captureConcurrentPermitLedgerV13.delete(state.capture.fixtureIdentity);
  dispatchCaptureV13("SELECT", {
    selection: { ...state.capture.selection },
    fixtureIdentity: nextCaptureSyntheticIdentityV13(),
  });
  state.capture.surface = "companion";
  state.focusAfterRender = "#capture-selected-title-v14";
  syncUrl();
  render();
  announceCaptureV13("A different synthetic message with the same represented bytes is ready for its own decision.");
}

function replaySettledDuplicateMessageV13() {
  const fixture = captureSelectedFixtureV13();
  if (fixture.kind !== "duplicate" || state.capture.active || !["duplicate-added", "duplicate-cancelled"].includes(state.capture.terminal?.type)) return;
  dispatchCaptureV13("REPLAY_GUARDED", {
    fixtureIdentity: state.capture.fixtureIdentity,
    proof: state.capture.terminal.type === "duplicate-cancelled"
      ? "Same message replay ignored · settled Cancel unchanged"
      : "Same message replay ignored · settled result unchanged",
  });
  const proof = root.querySelector("[data-capture-replay-proof-v14]");
  if (proof) proof.textContent = ` · ${state.capture.replayProof}`;
  announceCaptureV13("The represented result is unchanged.");
}

function replayPendingDuplicateMessageV13() {
  const fixture = captureSelectedFixtureV13();
  const active = state.capture.active;
  if (fixture.kind !== "duplicate" || !active || active.fixtureIdentity !== state.capture.fixtureIdentity) return;
  dispatchCaptureV13("PENDING_REPLAY_GUARDED", {
    fixtureIdentity: state.capture.fixtureIdentity,
    proof: "Pending same-message replay ignored · 0 extra lookups · 0 extra decisions · 0 extra permits · 0 extra mutations · 0 extra acknowledgements",
  });
  const proof = root.querySelector("[data-capture-replay-proof-v14]");
  if (proof) proof.textContent = ` · ${state.capture.replayProof}`;
  announceCaptureV13("The pending same-message replay was ignored. The original operation continues unchanged.");
}

function seedCaptureReviewItemV13(key) {
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

function attachCaptureGroupProgressV13(fixture, identity, count) {
  if (fixture.key !== "t3") return false;
  let destination = days[fixture.journalDate];
  if (!destination?.captureOnlyV13) {
    destination = captureOnlyDayV13(fixture.journalDate, fixture.photoCaption);
    days[fixture.journalDate] = destination;
  }
  fixture.members.slice(0, count).forEach((member, index) => {
    const memberIdentity = `${identity}:member-${index + 1}`;
    if (captureCommittedIdentitiesV13.has(memberIdentity)) return;
    const id = `daily-photo-v14-${String.fromCharCode(97 + index)}`;
    if (!destination.photos.some((photo) => photo.id === id)) {
      destination.photos.push(capturePhotoV13({ id, src: member.asset, alt: member.alt, caption: member.caption, timestamp: member.messageTime, isCover: index === 0 }));
    }
    captureCommittedIdentitiesV13.add(memberIdentity);
  });
  state.almanacEmptyArchive = false;
  return true;
}

function captureTerminalV13(token, terminal, { focusOutcome = false, preserveFocus = false, focusOutcomeWhenUnclaimed = false, focusFallbackWhenUnclaimed = null, announcement = "" } = {}) {
  if (!captureOperationIsCurrentV13(token)) return;
  const activeBeforeRender = document.activeElement;
  const focusWasUnclaimed = !activeBeforeRender || activeBeforeRender === document.body || activeBeforeRender === document.documentElement || activeBeforeRender === root;
  const activeSelectorBeforeRender = selectorForLogicalFocus(activeBeforeRender);
  const outcomeOriginSelector = focusOutcome && [
    '[data-action="capture-run"]',
    '[data-action="capture-duplicate-permit"]',
    '[data-action="capture-duplicate-cancel"]',
    '[data-action="capture-retry"]',
  ].includes(activeSelectorBeforeRender);
  const preservedFocusSelector = preserveFocus && !focusWasUnclaimed && !outcomeOriginSelector ? activeSelectorBeforeRender : null;
  const normalizedTerminal = captureSelectedFixtureV13().key === "t3"
    ? {
      ...terminal,
      albumProgress: Math.max(
        state.capture.albumProgress,
        captureDurableMemberCountV13(token.identity),
        Number(terminal.albumProgress) || 0,
      ),
    }
    : terminal;
  clearCaptureTimersV13(token);
  dispatchCaptureV13("TERMINAL", { token, terminal: normalizedTerminal });
  state.focusAfterRender = preserveFocus
    ? null
    : focusOutcome
      ? "#capture-outcome-title-v14"
      : '[data-action="capture-run"]';
  render();
  if (preserveFocus) {
    const preservedFocusSurvives = preservedFocusSelector && resolveLogicalSelector(preservedFocusSelector);
    const preservedFocusWasRemoved = Boolean(preservedFocusSelector && !preservedFocusSurvives);
    const guardedSelector = preservedFocusSurvives
      ? preservedFocusSelector
      : focusOutcomeWhenUnclaimed && (focusWasUnclaimed || outcomeOriginSelector || preservedFocusWasRemoved)
        ? "#capture-outcome-title-v14"
        : focusFallbackWhenUnclaimed && focusWasUnclaimed
          ? focusFallbackWhenUnclaimed
          : null;
    if (guardedSelector) reinforceNavigationFocusV13(guardedSelector, "telegram-capture", "companion");
  }
  if (focusOutcome && ["authorization-rejected", "media-rejected", "capture-failed", "interrupted", "partial", "duplicate-cancelled", "duplicate-check-failed", "duplicate-add-failed", "duplicate-added"].includes(normalizedTerminal.type)) {
    revealCaptureFailureOutcomeV13();
  }
  if (announcement) announceCaptureV13(normalizedTerminal.type === "partial"
    ? `${normalizedTerminal.albumProgress} of 3 received photos represented; no complete acknowledgement.`
    : announcement);
}

function completeCaptureOperationV13(token, { retry = false, replay = false } = {}) {
  if (!captureOperationIsCurrentV13(token)) return;
  const fixture = captureSelectedFixtureV13();
  const branch = state.capture.branch;
  if (fixture.kind === "authorization") {
    captureTerminalV13(token, { type: "authorization-rejected", stage: "authorization-rejected" }, {
      focusOutcome: true,
      preserveFocus: true,
      focusOutcomeWhenUnclaimed: true,
      announcement: "Request not accepted before media download.",
    });
    return;
  }
  if (fixture.kind === "media") {
    const result = validateCaptureMediaV13(fixture);
    const terminal = result.accepted
      ? { type: "media-accepted", stage: "media-accepted", message: result.message }
      : { type: "media-rejected", stage: "media-rejected", message: result.message, detail: fixture.key === "malformed" ? "Decode failed first; byte and side-limit failures did not replace the primary rejection." : "" };
    captureTerminalV13(token, terminal, {
      focusOutcome: !result.accepted,
      preserveFocus: true,
      focusOutcomeWhenUnclaimed: !result.accepted,
      focusFallbackWhenUnclaimed: result.accepted ? '[data-action="capture-run"]' : null,
      announcement: result.accepted ? `${fixture.format} validation accepted.` : "Photo not added after media validation.",
    });
    return;
  }
  if (fixture.kind === "caption") {
    captureTerminalV13(token, { type: "caption-result", stage: "caption-result", analysis: fixture.analysis }, {
      preserveFocus: true,
      focusFallbackWhenUnclaimed: '[data-action="capture-run"]',
      announcement: fixture.analysis.review ? "Caption entered Needs Date Review." : "Caption grammar result ready.",
    });
    return;
  }
  if ((branch === "failure" && !retry) || (fixture.key === "t7" && !retry)) {
    if (fixture.key === "t3" && captureDurableMemberCountV13(token.identity)) {
      cancelCaptureOperationsV13({
        stage: "capture-failed",
        terminal: { type: "capture-failed", stage: "capture-failed" },
        continuationAttemptAddedNothing: true,
      });
      renderCaptureOutcomeWithGuardedFocusV13(['[data-action="capture-run"]', '[data-action="capture-retry"]']);
      announceCaptureV13("The continuation attempt added nothing. Already represented photos remain unchanged.");
      return;
    }
    captureTerminalV13(token, { type: "capture-failed", stage: "capture-failed" }, {
      focusOutcome: true,
      preserveFocus: true,
      focusOutcomeWhenUnclaimed: true,
      announcement: "Photo not saved. Nothing was added.",
    });
    return;
  }
  if (["t5", "t6"].includes(fixture.key)) {
    let reviewResolved = state.capture.reviewResolved || captureResolvedReviewIdentitiesV13.has(token.identity);
    if (!captureCommittedIdentitiesV13.has(token.identity)) {
      captureCommittedIdentitiesV13.add(token.identity);
      seedCaptureReviewItemV13(fixture.reviewKey);
    } else if (!state.dateReview.unresolved.includes(fixture.reviewKey)) {
      reviewResolved = true;
      captureResolvedReviewIdentitiesV13.add(token.identity);
    }
    captureTerminalV13(token, { type: "captured-review", stage: "captured-review", reviewResolved }, {
      preserveFocus: true,
      focusFallbackWhenUnclaimed: '[data-action="capture-run"]',
      announcement: reviewResolved ? "The represented review item is already resolved." : "Photo entered Needs Date Review.",
    });
    return;
  }
  const wasCommitted = captureCommittedIdentitiesV13.has(token.identity);
  if (fixture.key === "t3") {
    attachCaptureGroupProgressV13(fixture, token.identity, 3);
    captureCommittedIdentitiesV13.add(token.identity);
  } else attachCaptureResultV13(fixture, token.identity);
  captureTerminalV13(token, { type: "captured-valid", stage: "captured-valid", albumProgress: fixture.key === "t3" ? 3 : 0 }, {
    preserveFocus: true,
    focusFallbackWhenUnclaimed: '[data-action="capture-run"]',
    announcement: wasCommitted || replay ? "The represented terminal result is unchanged." : fixture.key === "t3" ? "3 received photos saved to 9 August 2026." : `Photo saved to ${captureLongDateV13(fixture.journalDate)}.`,
  });
  if (branch === "replay" && !replay && !wasCommitted) {
    scheduleCaptureContinuationV13(token, "replay", 220, () => {
      if (!captureCommittedIdentitiesV13.has(token.identity) || state.capture.terminal?.type !== "captured-valid") return;
      dispatchCaptureV13("REPLAY_GUARDED", { fixtureIdentity: token.fixtureIdentity, proof: "Replay ignored · existing represented result unchanged" });
      const proof = root.querySelector("[data-capture-replay-proof-v14]");
      if (proof) proof.textContent = " · Replay ignored · existing represented result unchanged";
    });
  }
}

function completeDuplicateCheckV13(token, { retry = false } = {}) {
  if (!captureOperationIsCurrentV13(token)) return;
  if (state.capture.duplicateBranch === "lookup-failure" && !retry) {
    captureTerminalV13(token, { type: "duplicate-check-failed", stage: "duplicate-check-failed" }, { focusOutcome: true, preserveFocus: true, focusOutcomeWhenUnclaimed: true });
    announceCaptureV13("Duplicate check could not finish. Nothing was added.");
    return;
  }
  if (state.capture.duplicateBranch === "concurrent-permit") initializeConcurrentPermitLedgerV13();
  captureTerminalV13(token, { type: "duplicate-decision", stage: "duplicate-decision" }, { preserveFocus: true, focusOutcomeWhenUnclaimed: true, announcement: "An identical photo needs a decision." });
}

function settleConcurrentSecondaryPermitV13(primaryIdentity) {
  const ledger = captureConcurrentPermitLedgerV13.get(primaryIdentity);
  const fixture = captureSelectedFixtureV13();
  if (!ledger
    || ledger.secondaryStatus !== "pending"
    || state.capture.fixtureIdentity !== primaryIdentity
    || state.capture.generation !== ledger.generation
    || state.capture.selection.key !== ledger.selectionKey
    || state.capture.duplicateBranch !== "concurrent-permit"
    || fixture.kind !== "duplicate"
    || state.shell.phase !== "ready"
    || state.shell.connection !== "connected"
    || state.view !== "telegram-capture") return;
  const committed = attachDuplicateCaptureResultV13(fixture, ledger.secondaryIdentity);
  const repeatedCallbackIgnored = !attachDuplicateCaptureResultV13(fixture, ledger.secondaryIdentity);
  ledger.secondaryStatus = committed || captureCommittedIdentitiesV13.has(ledger.secondaryIdentity) ? "added" : "decision";
  ledger.secondaryAcknowledged = ledger.secondaryStatus === "added";
  ledger.repeatedCallbackGuarded = repeatedCallbackIgnored;
  ledger.freshnessUnknown = false;
  const focusSelector = selectorForLogicalFocus(document.activeElement);
  state.focusAfterRender = null;
  render();
  if (focusSelector && resolveLogicalSelector(focusSelector)) {
    reinforceNavigationFocusV13(focusSelector, "telegram-capture", "companion");
  }
  if (ledger.secondaryStatus === "added") announceCaptureV13("A separately permitted synthetic message added one represented reference.");
}

function beginConcurrentSecondaryPermitV13() {
  const primaryIdentity = state.capture.fixtureIdentity;
  const ledger = captureConcurrentPermitLedgerV13.get(primaryIdentity);
  if (!ledger
    || ledger.secondaryStatus !== "decision"
    || ledger.generation !== state.capture.generation
    || ledger.selectionKey !== state.capture.selection.key
    || state.capture.duplicateBranch !== "concurrent-permit"
    || captureSelectedFixtureV13().kind !== "duplicate"
    || state.shell.phase !== "ready"
    || state.shell.connection !== "connected") return;
  ledger.secondaryStatus = "pending";
  ledger.secondaryPermitGranted = true;
  ledger.freshnessUnknown = false;
  renderCaptureStageWithGuardedFocusV13('[data-action="capture-concurrent-permit-secondary"]');
  announceCaptureV13("A second explicit permit is pending.");
  const key = `concurrent-secondary:${primaryIdentity}`;
  const timer = window.setTimeout(() => {
    captureTimersV13.delete(key);
    settleConcurrentSecondaryPermitV13(primaryIdentity);
  }, 720);
  captureTimersV13.set(key, { timer, tokenId: ledger.secondaryIdentity });
}

function beginDuplicateCheckV13({ retry = false } = {}) {
  const fixture = captureSelectedFixtureV13();
  if (fixture.kind !== "duplicate"
    || state.capture.active
    || captureCommittedIdentitiesV13.has(state.capture.fixtureIdentity)
    || state.shell.connection !== "connected"
    || state.shell.phase !== "ready") return;
  const token = Object.freeze({
    id: ++captureOperationSequenceV13,
    identity: state.capture.fixtureIdentity,
    fixtureIdentity: state.capture.fixtureIdentity,
    generation: state.capture.generation,
    selection: { ...state.capture.selection },
    attempt: state.capture.attempt + 1,
    sessionGeneration: state.shell.ops.generation,
    intended: "duplicate-check",
  });
  const renderProgress = () => renderCaptureStageWithGuardedFocusV13();
  dispatchCaptureV13("START", { token });
  renderProgress();
  announceCaptureV13("Synthetic message received.");

  const stage = (name, announcement) => {
    if (!captureOperationIsCurrentV13(token)) return;
    dispatchCaptureV13("STAGE", { token, stage: name });
    renderProgress();
    if (announcement) announceCaptureV13(announcement);
  };
  scheduleCaptureV13(token, "authorize", 220, () => stage("authorizing", "Authorization check represented."));
  scheduleCaptureV13(token, "validate", 500, () => stage("validating", "Authorized private chat represented. Media validation in progress."));
  scheduleCaptureV13(token, "duplicate-check", 760, () => stage("duplicate-check", "Checking for identical bytes."));

  const branch = state.capture.duplicateBranch;
  if (branch === "navigate-before-commit") {
    scheduleCaptureV13(token, "navigate", 900, () => {
      cancelCaptureOperationsV13();
      setView("calendar");
    });
    return;
  }
  if (branch === "reset-before-commit") {
    scheduleCaptureV13(token, "reset", 900, () => selectCaptureFixtureV13(token.selection, { open: true, preserveAsyncFocus: true }));
    return;
  }
  if (branch === "connection-interruption" && !retry) {
    scheduleCaptureV13(token, "connection", 900, () => {
      cancelCaptureOperationsV13({
        stage: "interrupted",
        terminal: { type: "interrupted", stage: "interrupted", interruptedStep: "duplicate-check" },
        retryAvailable: true,
      });
      dispatchShell("CONNECTION_INTERRUPT");
      renderCaptureOutcomeWithGuardedFocusV13(['[data-action="capture-run"]']);
      announceCaptureV13("Duplicate check interrupted. Nothing was added.");
    });
    return;
  }
  if (branch === "session-interruption") {
    scheduleCaptureV13(token, "session", 900, () => expireShellSessionV10());
    return;
  }
  scheduleCaptureV13(token, "decision", 1120, () => completeDuplicateCheckV13(token, { retry }));
}

function completeDuplicatePermitV13(token, { retry = false } = {}) {
  if (!captureOperationIsCurrentV13(token)) return;
  const fixture = captureSelectedFixtureV13();
  const branch = state.capture.duplicateBranch;
  if (branch === "add-failure" && !retry) {
    captureTerminalV13(token, { type: "duplicate-add-failed", stage: "duplicate-add-failed", decisionPreserved: true }, { focusOutcome: true, preserveFocus: true, focusOutcomeWhenUnclaimed: true });
    announceCaptureV13("Duplicate photo was not added. Nothing changed.");
    return;
  }
  const wasCommitted = captureCommittedIdentitiesV13.has(token.identity);
  const committed = attachDuplicateCaptureResultV13(fixture, token.identity);
  if (!committed && !wasCommitted) {
    captureTerminalV13(token, { type: "duplicate-add-failed", stage: "duplicate-add-failed", decisionPreserved: true }, { focusOutcome: true, preserveFocus: true, focusOutcomeWhenUnclaimed: true });
    announceCaptureV13("Duplicate photo was not added. Nothing changed.");
    return;
  }
  captureTerminalV13(token, { type: "duplicate-added", stage: "duplicate-added" }, {
    focusOutcome: true,
    preserveFocus: true,
    focusOutcomeWhenUnclaimed: true,
    announcement: wasCommitted ? "The represented duplicate result is unchanged." : "Duplicate photo added.",
  });
  if (["rapid-permit", "replay-permit"].includes(branch)) {
    scheduleCaptureContinuationV13(token, "duplicate-repeat-proof", 180, () => {
      if (!captureCommittedIdentitiesV13.has(token.identity) || state.capture.terminal?.type !== "duplicate-added") return;
      dispatchCaptureV13("REPLAY_GUARDED", {
        fixtureIdentity: token.fixtureIdentity,
        proof: branch === "replay-permit" ? "Same message replay ignored · settled result unchanged" : "Repeated permit callback ignored · one Daily Photo reference represented",
      });
      const proof = root.querySelector("[data-capture-replay-proof-v14]");
      if (proof) proof.textContent = ` · ${state.capture.replayProof}`;
    });
  }
}

function beginDuplicatePermitV13({ retry = false } = {}) {
  const fixture = captureSelectedFixtureV13();
  const terminal = state.capture.terminal;
  const retryingPermit = ["duplicate-add-failed", "interrupted"].includes(terminal?.type)
    && (terminal?.type !== "interrupted" || terminal.interruptedStep === "duplicate-permit");
  const resumingDecision = terminal?.type === "interrupted" && terminal.decisionPreserved;
  if (fixture.kind !== "duplicate"
    || state.capture.active
    || captureCommittedIdentitiesV13.has(state.capture.fixtureIdentity)
    || (!retry && terminal?.type !== "duplicate-decision" && !resumingDecision)
    || (retry && !retryingPermit)
    || state.shell.connection !== "connected"
    || state.shell.phase !== "ready") return;
  const token = Object.freeze({
    id: ++captureOperationSequenceV13,
    identity: state.capture.fixtureIdentity,
    fixtureIdentity: state.capture.fixtureIdentity,
    generation: state.capture.generation,
    selection: { ...state.capture.selection },
    attempt: state.capture.attempt + 1,
    sessionGeneration: state.shell.ops.generation,
    intended: "duplicate-permit",
  });
  dispatchCaptureV13("START", { token, stage: "waiting", terminal: { type: "duplicate-decision", stage: "duplicate-decision" } });
  renderCaptureStageWithGuardedFocusV13('[data-action="capture-duplicate-permit"]');
  announceCaptureV13("Waiting for durable capture.");

  const branch = state.capture.duplicateBranch;
  if (branch === "rapid-permit") beginDuplicatePermitV13({ retry });
  if (branch === "cancel-before-commit") {
    scheduleCaptureV13(token, "cancel", 420, () => {
      cancelCaptureOperationsV13({
        stage: "duplicate-cancelled",
        terminal: { type: "duplicate-cancelled", stage: "duplicate-cancelled" },
      });
      renderCaptureOutcomeWithGuardedFocusV13(['[data-action="capture-duplicate-permit"]']);
      announceCaptureV13("Duplicate not added. Nothing changed.");
    });
    return;
  }
  if (branch === "navigate-before-commit") {
    scheduleCaptureV13(token, "navigate", 420, () => {
      cancelCaptureOperationsV13({ keepTerminal: true, stage: "duplicate-decision" });
      setView("calendar");
    });
    return;
  }
  if (branch === "reset-before-commit") {
    scheduleCaptureV13(token, "reset", 420, () => selectCaptureFixtureV13(token.selection, { open: true, preserveAsyncFocus: true }));
    return;
  }
  if (branch === "connection-interruption" && !retry && !resumingDecision) {
    scheduleCaptureV13(token, "connection", 420, () => {
      cancelCaptureOperationsV13({
        stage: "interrupted",
        terminal: { type: "interrupted", stage: "interrupted", interruptedStep: "duplicate-permit" },
        retryAvailable: true,
      });
      dispatchShell("CONNECTION_INTERRUPT");
      renderCaptureOutcomeWithGuardedFocusV13(['[data-action="capture-duplicate-permit"]']);
      announceCaptureV13("Duplicate capture interrupted. Nothing was added.");
    });
    return;
  }
  if (branch === "session-interruption") {
    scheduleCaptureV13(token, "session", 420, () => expireShellSessionV10());
    return;
  }
  scheduleCaptureV13(token, "permit", 820, () => completeDuplicatePermitV13(token, { retry }));
}

function beginCaptureOperationV13({ retry = false, replay = false } = {}) {
  const fixture = captureSelectedFixtureV13();
  if (fixture.kind === "duplicate") {
    const terminal = state.capture.terminal;
    if (retry && (terminal?.type === "duplicate-add-failed" || (terminal?.type === "interrupted" && terminal.interruptedStep === "duplicate-permit"))) {
      beginDuplicatePermitV13({ retry: true });
    } else beginDuplicateCheckV13({ retry });
    return;
  }
  if (fixture.kind === "guide"
    || state.capture.active
    || (state.capture.fixtureIdentity && captureCommittedIdentitiesV13.has(state.capture.fixtureIdentity))
    || state.shell.connection !== "connected"
    || state.shell.phase !== "ready") return;
  const token = Object.freeze({
    id: ++captureOperationSequenceV13,
    identity: state.capture.fixtureIdentity,
    fixtureIdentity: state.capture.fixtureIdentity,
    generation: state.capture.generation,
    selection: { ...state.capture.selection },
    attempt: state.capture.attempt + 1,
    sessionGeneration: state.shell.ops.generation,
    intended: retry ? "retry-success" : state.capture.branch,
  });
  const durableAlbumProgress = fixture.key === "t3" ? captureDurableMemberCountV13(token.identity) : 0;
  const durablePartialTerminal = durableAlbumProgress
    ? { type: "partial", stage: "partial", albumProgress: durableAlbumProgress, continuingAfterDurableProgress: true }
    : null;
  dispatchCaptureV13("START", {
    token,
    albumProgress: durableAlbumProgress,
    terminal: durablePartialTerminal,
    reviewResolved: captureResolvedReviewIdentitiesV13.has(token.identity) || state.capture.reviewResolved,
  });
  renderCaptureStageWithGuardedFocusV13();
  announceCaptureV13("Synthetic message received.");

  const stage = (name, announcement) => {
    if (!captureOperationIsCurrentV13(token)) return;
    dispatchCaptureV13("STAGE", { token, stage: name });
    renderCaptureStageWithGuardedFocusV13();
    if (announcement) announceCaptureV13(announcement);
  };
  scheduleCaptureV13(token, "authorize", 220, () => stage("authorizing", "Authorization check represented."));
  if (fixture.kind === "authorization") {
    scheduleCaptureV13(token, "terminal", 540, () => completeCaptureOperationV13(token, { retry, replay }));
    return;
  }
  scheduleCaptureV13(token, "validate", 500, () => stage("validating", "Authorized private chat represented. Media validation in progress."));
  if (["media", "caption"].includes(fixture.kind)) {
    scheduleCaptureV13(token, "terminal", 840, () => completeCaptureOperationV13(token, { retry, replay }));
    return;
  }
  const checksForDuplicate = fixture.representedMatch === false;
  if (checksForDuplicate) {
    scheduleCaptureV13(token, "duplicate-check", 760, () => stage("duplicate-check", "Checking for identical bytes."));
  }
  scheduleCaptureV13(token, "waiting", checksForDuplicate ? 980 : 760, () => stage("waiting", "Waiting for durable capture…"));

  const branch = state.capture.branch;
  if (fixture.key === "t3" && ["success", "replay", "rapid-repeat", "partial-media-group"].includes(branch)) {
    const targetMembers = branch === "partial-media-group" && !retry ? [1, 2] : [1, 2, 3];
    const missingMembers = targetMembers.filter((member) => !captureCommittedIdentitiesV13.has(`${token.identity}:member-${member}`));
    missingMembers.forEach((count, index) => scheduleCaptureV13(token, `member-${count}`, 930 + index * 210, () => {
      attachCaptureGroupProgressV13(fixture, token.identity, count);
      const representedCount = captureDurableMemberCountV13(token.identity);
      dispatchCaptureV13("ALBUM_PROGRESS", { token, count: representedCount });
      renderCaptureStageWithGuardedFocusV13();
      announceCaptureV13(`${representedCount} of 3 received photos represented.`);
    }));
  }

  if (branch === "rapid-repeat") beginCaptureOperationV13({ retry, replay });
  if (branch === "navigate-before-completion") {
    scheduleCaptureV13(token, "navigate", 940, () => {
      cancelCaptureOperationsV13();
      setView("calendar");
    });
    return;
  }
  if (branch === "reset-before-completion") {
    scheduleCaptureV13(token, "reset", 940, () => selectCaptureFixtureV13(token.selection, { open: true, preserveAsyncFocus: true }));
    return;
  }
  if (branch === "connection-interruption" && token.intended !== "retry-success") {
    scheduleCaptureV13(token, "connection", 940, () => {
      cancelCaptureOperationsV13({
        stage: "interrupted",
        terminal: { type: "interrupted", stage: "interrupted" },
        continuationAttemptAddedNothing: true,
        retryAvailable: true,
      });
      dispatchShell("CONNECTION_INTERRUPT");
      renderCaptureOutcomeWithGuardedFocusV13(['[data-action="capture-run"]']);
      announceCaptureV13("Capture result unavailable after connection interruption.");
    });
    return;
  }
  if (branch === "session-interruption") {
    scheduleCaptureV13(token, "session", 940, () => expireShellSessionV10());
    return;
  }
  if (branch === "partial-media-group" && fixture.key === "t3" && !retry) {
    scheduleCaptureV13(token, "partial", 1360, () => captureTerminalV13(token, { type: "partial", stage: "partial", albumProgress: 2 }, {
      focusOutcome: true,
      preserveFocus: true,
      focusOutcomeWhenUnclaimed: true,
      announcement: "2 of 3 received photos represented; no complete acknowledgement.",
    }));
    return;
  }
  scheduleCaptureV13(token, "complete", fixture.key === "t3" ? 1660 : checksForDuplicate ? 1600 : 1380, () => completeCaptureOperationV13(token, { retry, replay }));
}

function invalidateNavigationFocusV13() {
  navigationFocusEpochV13 += 1;
  pendingNavigationFocusV13 = null;
}

function reinforceNavigationFocusV13(selector, expectedView, expectedSurface = null) {
  const focusEpoch = ++navigationFocusEpochV13;
  const expectedEntryId = window.history.state?.entryId;
  pendingNavigationFocusV13 = { epoch: focusEpoch, selector };
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (navigationFocusEpochV13 !== focusEpoch) return;
    pendingNavigationFocusV13 = null;
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

function cancelCaptureForManualNavigationV13() {
  const restoreDuplicateDecision = state.capture.active?.intended === "duplicate-permit"
    && captureSelectedFixtureV13().kind === "duplicate";
  cancelCaptureOperationsV13({
    keepTerminal: !state.capture.active || restoreDuplicateDecision,
    stage: restoreDuplicateDecision
      ? "duplicate-decision"
      : state.capture.active ? "selected" : state.capture.stage,
    terminal: restoreDuplicateDecision
      ? { type: "duplicate-decision", stage: "duplicate-decision" }
      : null,
  });
}

function openCaptureCompanionV13(originControl = null) {
  if (state.view === "telegram-capture") {
    cancelCaptureForManualNavigationV13();
    dispatchCaptureV13("SURFACE", { surface: "companion" });
    // The guarded reinforcement below supplies the H1 only while focus remains
    // unclaimed, so an immediate user Tab is not undone by the render frame.
    state.focusAfterRender = null;
    render();
    withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
    const captureTitle = resolveLogicalSelector("#capture-title-v14");
    state.scrollByView["telegram-capture"] = window.scrollY;
    saveCurrentHistorySnapshot({
      scrollY: window.scrollY,
      focusSelector: "#capture-title-v14",
      focusTop: captureTitle?.getBoundingClientRect?.().top ?? null,
    });
    reinforceNavigationFocusV13("#capture-title-v14", "telegram-capture", "companion");
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
  dispatchCaptureV13("SURFACE", { surface: "companion" });
  state.focusAfterRender = "#capture-title-v14";
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV13("#capture-title-v14", "telegram-capture", "companion");
}

function captureBackV13() {
  cancelCaptureForManualNavigationV13();
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

function openCaptureChangeDateV13(control) {
  const fixture = captureSelectedFixtureV13();
  if (state.capture.terminal?.type !== "captured-valid" || !fixture.actions?.includes("change-date")) return;
  cancelCaptureOperationsV13({ keepTerminal: true, stage: state.capture.stage });
  const originSelector = '[data-action="capture-change-date"]';
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: originSelector, focusTop: control?.getBoundingClientRect?.().top ?? null });
  dispatchCaptureV13("SURFACE", { surface: "change-date" });
  state.focusAfterRender = "#capture-change-title-v14";
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV13("#capture-change-title-v14", "telegram-capture", "change-date");
}

function openCaptureDayTargetV13(control, { date, photoId = null, originSelector = null } = {}) {
  const destination = days[date];
  if (!destination || !isDateKey(date)) return;
  const photoIndex = photoId == null ? 0 : destination.photos.findIndex((photo) => photo.id === photoId);
  if (photoId != null && photoIndex < 0) return;
  if (state.view === "telegram-capture") cancelCaptureOperationsV13({ keepTerminal: true, stage: state.capture.stage });
  const resolvedOrigin = selectorForLogicalFocus(control) || originSelector;
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: resolvedOrigin, focusTop: control?.getBoundingClientRect?.().top ?? null });
  state.viewMemory[state.view] = captureViewMemory(state.view);
  state.view = "calendar";
  state.month = date.slice(0, 7);
  state.calendarMonth = state.month;
  state.selectedDate = date;
  state.focusDate = date;
  state.screen = "day";
  state.galleryIndex[date] = Math.max(0, photoIndex);
  state.focusAfterRender = "#journal-day-title-v14";
  syncUrl({ push: true, originAlreadySaved: true, fullDayOpenedInApp: true, captureDayDate: date, captureDayPhotoId: photoId, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV13("#journal-day-title-v14", "calendar");
}

function viewCaptureDayV13(control) {
  const fixture = captureSelectedFixtureV13();
  const terminalType = state.capture.terminal?.type;
  const inheritedResult = terminalType === "captured-valid" && fixture.actions?.includes("view-day");
  const duplicateResult = terminalType === "duplicate-added" && fixture.kind === "duplicate";
  if (!inheritedResult && !duplicateResult) return;
  const photoId = duplicateResult ? captureDuplicateReferenceByIdentityV13.get(state.capture.fixtureIdentity)?.photoId || null : null;
  openCaptureDayTargetV13(control, { date: fixture.journalDate, photoId, originSelector: '[data-action="capture-view-day"]' });
}

function viewConcurrentDuplicateDayV13(control) {
  const fixture = captureSelectedFixtureV13();
  const ledger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
  const reference = ledger ? captureDuplicateReferenceByIdentityV13.get(ledger.secondaryIdentity) : null;
  if (fixture.kind !== "duplicate" || ledger?.secondaryStatus !== "added" || !reference) return;
  openCaptureDayTargetV13(control, {
    date: reference.date,
    photoId: reference.photoId,
    originSelector: '[data-action="capture-view-concurrent-day"]',
  });
}

function viewConcurrentDuplicateExistingDayV13(control) {
  const fixture = captureSelectedFixtureV13();
  const ledger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
  if (fixture.kind !== "duplicate" || fixture.duplicateScope !== "cross-day" || ledger?.secondaryStatus !== "added") return;
  openCaptureDayTargetV13(control, {
    date: fixture.existingDate,
    photoId: "p-rain",
    originSelector: '[data-action="capture-view-concurrent-existing-day"]',
  });
}

function viewExistingDuplicateDayV13(control) {
  const fixture = captureSelectedFixtureV13();
  const terminal = state.capture.terminal;
  const decisionAvailable = terminal?.type === "duplicate-decision"
    || (terminal?.type === "interrupted" && terminal.decisionPreserved)
    || (terminal?.type === "duplicate-added" && fixture.duplicateScope === "cross-day");
  const readOnlySettledLink = terminal?.type === "duplicate-added" && fixture.duplicateScope === "cross-day";
  if (fixture.kind !== "duplicate" || !decisionAvailable || (!readOnlySettledLink && state.shell.connection !== "connected")) return;
  openCaptureDayTargetV13(control, { date: fixture.existingDate, photoId: "p-rain", originSelector: '[data-action="capture-view-existing-duplicate-day"]' });
}

function viewRelatedMediaDayV13(control) {
  const date = resolveUploadDayDomTokenV14(control?.dataset?.relatedDate);
  if (state.view !== "calendar" || state.screen !== "day" || !isDateKey(date) || !days[date]) return;
  const related = days[date].photos.find((photo) => photo.mediaAssetKey === "represented-rain-window-v14");
  if (!related) return;
  openCaptureDayTargetV13(control, { date, photoId: related.id, originSelector: `[data-action="view-related-media-day"][data-related-date="${CSS.escape(control.dataset.relatedDate)}"]` });
}

function openCaptureReviewDateV13(control) {
  const fixture = captureSelectedFixtureV13();
  const identity = state.capture.fixtureIdentity;
  if (state.capture.terminal?.type !== "captured-review"
    || state.capture.reviewResolved
    || captureResolvedReviewIdentitiesV13.has(identity)
    || !fixture.reviewKey) return;
  if (!state.dateReview.unresolved.includes(fixture.reviewKey)) {
    if (captureCommittedIdentitiesV13.has(identity)) {
      captureResolvedReviewIdentitiesV13.add(identity);
      dispatchCaptureV13("REVIEW_RESOLVED");
      render();
    }
    return;
  }
  cancelCaptureOperationsV13({ keepTerminal: true, stage: state.capture.stage });
  const originSelector = '[data-action="capture-review-date"]';
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: originSelector, focusTop: control?.getBoundingClientRect?.().top ?? null });
  state.viewMemory["telegram-capture"] = captureViewMemory("telegram-capture");
  dispatchCaptureV13("REVIEW_HANDOFF", { key: fixture.reviewKey });
  state.view = "date-review";
  state.screen = "month";
  state.selectedDate = null;
  dispatchDateReview("DETAIL_OPEN", { key: fixture.reviewKey });
  state.focusAfterRender = "#date-review-detail-title-v11";
  syncUrl({ push: true, originAlreadySaved: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  reinforceNavigationFocusV13("#date-review-detail-title-v11", "date-review");
}

function renderShellActionV10(action, label, { disabled = false, className = "secondary-button" } = {}) {
  const accessibleLabel = label.endsWith("…") ? label.slice(0, -1) : "";
  return `<button type="button" class="${className} shell-status-action-v10" data-action="${action}" ${accessibleLabel ? `aria-label="${html(accessibleLabel)}"` : ""} ${disabled ? 'aria-disabled="true"' : ""}>${label}</button>`;
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

function renderUploadFixtureConsoleV14() {
  const visibleFixtureLabel = (fixture) => {
    const description = fixture.label.split(" · ").slice(1).join(" · ") || "Fictional file";
    return `${description.charAt(0).toUpperCase()}${description.slice(1)}`;
  };
  const fixtureButtons = Object.entries(UPLOAD_FIXTURES_V14).map(([key, fixture]) => `
    <button type="button" class="text-button" data-action="set-upload-fixture" data-upload-fixture="${key}" aria-pressed="${state.upload.fixture === key}">${html(visibleFixtureLabel(fixture))}</button>`).join("");
  const branchButtons = Object.entries(UPLOAD_BRANCHES_V14).map(([key, label]) => `
    <button type="button" class="text-button" data-action="set-upload-branch" data-upload-branch="${key}" aria-pressed="${state.upload.branch === key}">${html(label)}</button>`).join("");
  const stageLabel = state.modal?.type === "upload" ? state.upload.stage : "closed";
  return `
    <section class="upload-fixture-group-v14" aria-labelledby="upload-fixture-title-v14">
      <h3 id="upload-fixture-title-v14">Durable manual upload · synthetic states</h3>
      <p>Fictional live-memory fixtures only. File text, dates, operation identity, and results never enter URL, browser history payload, storage, network, or logs.</p>
      <p class="prototype-data-label-v9">Current upload state · ${html(stageLabel)} · ${html(visibleFixtureLabel(UPLOAD_FIXTURES_V14[state.upload.fixture]))} · ${html(UPLOAD_BRANCHES_V14[state.upload.branch])}</p>
      <fieldset><legend>Selected file fixture</legend><div class="upload-fixture-controls-v14">${fixtureButtons}</div></fieldset>
      <fieldset><legend>Upload operation branch</legend><div class="upload-fixture-controls-v14">${branchButtons}</div></fieldset>
      <div class="inline-actions upload-fixture-controls-v14">
        <button type="button" class="secondary-button" data-action="open-upload-global-fixture">Open global blank date</button>
        <button type="button" class="secondary-button" data-action="open-upload-inline-fixture">Open inline 13 August</button>
        <button type="button" class="primary-button" data-action="run-upload-fixture">Load selected fictional file</button>
        <button type="button" class="text-button" data-action="reset-upload-fixture">Reset upload scenario</button>
      </div>
    </section>`;
}

function resetUploadScenarioV14({ focusConsole = true } = {}) {
  if (uploadDismissalLockedV14()) {
    announceUploadV14(uploadLockedExplanationV14("Upload in progress. Reset is available after the represented result settles."));
    return;
  }
  cancelShellOperations();
  clearShellBoundaryTransientsV10();
  dispatchShell("FIXTURE_SET", { fixture: "shell/ready" });
  resetShellViewV10({ populated: true });
  Object.keys(days).forEach((date) => delete days[date]);
  Object.assign(days, structuredClone(uploadArchiveBaselineV14));
  state.almanacEmptyArchive = false;
  state.focusAfterRender = focusConsole ? '[data-action="reset-upload-fixture"]' : "#prototype-main";
  syncUrl({ scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  announceUploadV14("Upload scenario reset. No pending upload remains.");
}

function correctionFixtureSourceV15(kind = "voice") {
  const fixture = kind === "long"
    ? { date: "2026-06-09", journalId: "u-june-09" }
    : kind === "uploaded"
      ? { date: "2026-08-08", journalId: "u-08" }
      : { date: "2026-08-02", journalId: "v-02" };
  const { date, journalId } = fixture;
  const journal = days[date]?.journals?.find((item) => item.id === journalId);
  return journal ? { day: days[date], journal } : null;
}

function prepareCorrectionFixtureV15(kind = "voice") {
  cancelShellOperations();
  clearCorrectionCallbackReplayV15();
  dispatchShell("CORRECTION_RESET");
  const selectedDate = kind === "long" ? "2026-06-09" : kind === "uploaded" ? "2026-08-08" : "2026-08-02";
  resetShellViewV10({ populated: true, selectedDate, screen: "day" });
  const source = correctionFixtureSourceV15(kind);
  if (!source) return null;
  const handle = registerCorrectionSourceV15(source.day, source.journal);
  state.focusAfterRender = `#correction-card-${handle}`;
  syncUrl({ push: false, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  return { ...source, handle };
}

function seedAuthorizedCorrectionFixtureV15() {
  const correction = state.shell.correction;
  const intentKey = nextCorrectionIntentV15("fixture", correction);
  const token = beginOp("correction", intentKey);
  if (!token) return false;
  const envelope = correctionOperationEnvelopeV15(token, correction, intentKey, "fixture-seed", CORRECTION_FIXTURE_SEED_AUTHORITY_V15);
  dispatchShell("CORRECTION_SAVE_START", envelope);
  if (state.shell.correction.operation?.operationId !== token.id) {
    finishOp(token);
    return false;
  }
  const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_READY", {
    ...envelope,
    record: correctionRecordForIntentV15(state.shell.correction, intentKey),
  });
  finishOp(token);
  return accepted;
}

function openCorrectionFixtureV15(kind = "voice", { existing = false } = {}) {
  const source = prepareCorrectionFixtureV15(kind);
  if (!source) return;
  if (existing) {
    const meta = correctionSourceMetaV15(source.day, source.journal);
    const editorIncarnation = nextCorrectionEditorIncarnationV15();
    dispatchShell("CORRECTION_OPEN", { date: source.day.date, journalId: source.journal.id, ...meta, returnFocusSelector: `#correction-card-${source.handle}`, editorIncarnation });
    const fixtureDraft = kind === "long" ? LONG_C1_TEXT_V15 : kind === "uploaded" ? UPLOAD_C1_TEXT_V15 : VOICE_C1_TEXT_V15;
    dispatchShell("CORRECTION_INPUT", { draft: fixtureDraft, editorIncarnation });
    if (!seedAuthorizedCorrectionFixtureV15()) return;
    dispatchShell("CORRECTION_CLOSE");
    render();
    openShellCorrectionV10(source.handle, `#correction-card-${source.handle}`);
    return;
  }
  openShellCorrectionV10(source.handle, `#correction-card-${source.handle}`);
}

function runMissingBaseCorrectionFixtureV15() {
  if (state.shell.correction.open || state.shell.correction.operation) return false;
  const day = { date: "2026-08-02", conflict: false };
  const journal = {
    id: "missing-base-v15",
    kind: "Voice Journal",
    title: "Missing base revision · synthetic fixture",
    timestamp: "13 August 2026 · 9:58 pm IST",
    status: "Selected base unavailable",
    text: "",
  };
  const handle = registerCorrectionSourceV15(day, journal);
  const before = state.shell;
  const opened = openShellCorrectionV10(handle, '[data-action="test-missing-base-correction"]');
  const safelyRejected = !opened
    && state.shell === before
    && !state.shell.correction.open
    && !state.shell.correction.operation;
  return safelyRejected;
}

function resetCorrectionFixtureV15({ announce = true, focusSelector = "#correction-fixture-title-v15" } = {}) {
  cancelShellOperations();
  clearCorrectionCallbackReplayV15();
  pendingLeaveNavigation = null;
  pendingPopGuard = null;
  suppressGuardedPopstate = false;
  pendingCorrectionPopstateReboundV15 = null;
  clearPendingCorrectionCloseTraversalV15();
  deferredCorrectionCallbacksV15.length = 0;
  dispatchShell("CORRECTION_RESET");
  state.modal = null;
  state.focusAfterRender = focusSelector;
  render();
  if (announce) announceCorrectionV15("Correction scenario reset. No represented Correction remains.");
}

function representedCorrectionRecordCountV15() {
  return Object.values(state.shell.representedCorrections)
    .reduce((total, lifecycle) => total + lifecycle.records.length, 0);
}

function runTouchCompatibilitySaveFixtureV15() {
  const representedBefore = representedCorrectionRecordCountV15();
  const operationSequenceBefore = shellOperationSequence;
  saveShellCorrectionV10();
  const firstOperationId = state.shell.correction.operation?.operationId ?? null;
  saveShellCorrectionV10();
  correctionCallbackProbeV15.touchCompatibility = {
    activations: 2,
    operationStarts: shellOperationSequence - operationSequenceBefore,
    samePendingOperation: firstOperationId != null
      && state.shell.correction.operation?.operationId === firstOperationId,
    representedBefore,
  };
  render();
}

function runCorrectionCallbackReplayFixtureV15(kind, variant, focusSelector) {
  const held = kind === "save" ? correctionCallbackReplayV15.saveReady : correctionCallbackReplayV15.removeReady;
  if (!held) return false;
  const readyType = kind === "save" ? "CORRECTION_SAVE_READY" : "CORRECTION_REMOVE_READY";
  const failureType = kind === "save" ? "CORRECTION_SAVE_FAIL" : "CORRECTION_REMOVE_FAIL";
  const callbackPayload = variant === "failure"
    ? {
      ...held,
      resolution: "known-zero",
      failure: {
        kind: "known-zero",
        message: kind === "save" ? CORRECTION_COPY_V15.saveFailure : CORRECTION_COPY_V15.removeFailure,
      },
    }
    : held;
  if (variant === "after-reset") {
    resetCorrectionFixtureV15({ announce: false, focusSelector: "#correction-fixture-title-v15" });
  }
  const before = state.shell;
  dispatchShell(variant === "failure" ? failureType : readyType, callbackPayload);
  const ignored = state.shell === before;
  state.focusAfterRender = variant === "after-reset" ? "#correction-fixture-title-v15" : focusSelector;
  render();
  announceCorrectionV15(ignored
    ? `${kind === "save" ? "Save" : "Removal"} callback fixture ignored. No represented Correction state changed.`
    : `${kind === "save" ? "Save" : "Removal"} callback fixture changed state unexpectedly.`, { assertive: !ignored });
  return ignored;
}

function runForeignSaveCallbackProbeV15(envelope, correction) {
  const foreignIntentKey = `${envelope.intentKey}:foreign`;
  const foreignBaseRevisionToken = `${envelope.sourceSnapshot.baseRevisionToken}:foreign`;
  const foreignSourceSnapshot = Object.freeze({
    ...envelope.sourceSnapshot,
    sourceKey: `${envelope.sourceSnapshot.sourceKey}:foreign`,
    journalId: `${envelope.sourceSnapshot.journalId}:foreign`,
    baseRevisionToken: foreignBaseRevisionToken,
  });
  const foreignRecord = Object.freeze({
    ...correctionRecordForIntentV15(correction, foreignIntentKey),
    intentKey: foreignIntentKey,
    baseRevisionToken: foreignBaseRevisionToken,
  });
  const before = state.shell;
  dispatchShell("CORRECTION_SAVE_READY", {
    ...envelope,
    intentKey: foreignIntentKey,
    operationKey: `correction:${foreignIntentKey}`,
    sourceSnapshot: foreignSourceSnapshot,
    record: foreignRecord,
  });
  const ignored = state.shell === before;
  correctionCallbackProbeV15.foreignSaveIgnored = ignored;
  return ignored;
}

function runPriorFlowSaveCallbackProbeV15(envelope) {
  const held = correctionCallbackReplayV15.saveReady;
  if (!held || held.intentKey === envelope.intentKey) {
    correctionCallbackProbeV15.priorFlowSaveIgnored = null;
    return true;
  }
  const before = state.shell;
  dispatchShell("CORRECTION_SAVE_READY", held);
  const ignored = state.shell === before;
  correctionCallbackProbeV15.priorFlowSaveIgnored = ignored;
  return ignored;
}

function runStaleEditorInputProbeV15() {
  const sourceA = prepareCorrectionFixtureV15("voice");
  if (!sourceA) return false;
  const metaA = correctionSourceMetaV15(sourceA.day, sourceA.journal);
  const staleEditorIncarnation = nextCorrectionEditorIncarnationV15();
  dispatchShell("CORRECTION_OPEN", {
    date: sourceA.day.date,
    journalId: sourceA.journal.id,
    ...metaA,
    returnFocusSelector: `#correction-card-${sourceA.handle}`,
    editorIncarnation: staleEditorIncarnation,
  });
  if (!state.shell.correction.open || state.shell.correction.editorIncarnation !== staleEditorIncarnation) return false;
  dispatchShell("CORRECTION_CLOSE");

  const sourceB = prepareCorrectionFixtureV15("uploaded");
  if (!sourceB) return false;
  openShellCorrectionV10(sourceB.handle, `#correction-card-${sourceB.handle}`);
  if (!state.shell.correction.open || state.shell.correction.journalId !== sourceB.journal.id) return false;
  const before = state.shell;
  dispatchShell("CORRECTION_INPUT", {
    draft: "Stale editor callback · synthetic",
    editorIncarnation: staleEditorIncarnation,
  });
  const ignored = state.shell === before;
  correctionCallbackProbeV15.staleEditorInputIgnored = ignored;
  render();
  announceCorrectionV15(ignored
    ? "Old editor input callback ignored. Current source unchanged."
    : "Old editor input callback changed state unexpectedly.", { assertive: !ignored });
  return ignored;
}

function renderCorrectionFixtureConsoleV15() {
  const branchButtons = Object.entries(CORRECTION_BRANCHES_V15).map(([key, label]) => `
    <button type="button" class="text-button" data-action="set-correction-branch" data-correction-branch="${key}" aria-pressed="${state.shell.correctionBranch === key}">${html(label)}</button>`).join("");
  const representedCount = representedCorrectionRecordCountV15();
  const touchProbe = correctionCallbackProbeV15.touchCompatibility;
  const touchProbeLabel = touchProbe == null
    ? "Not run"
    : touchProbe.activations === 2
      && touchProbe.operationStarts === 1
      && touchProbe.samePendingOperation
      && representedCount === touchProbe.representedBefore + 1
      ? "Pass · two activations · one represented effect"
      : touchProbe.activations === 2
        && touchProbe.operationStarts === 1
        && touchProbe.samePendingOperation
        && representedCount === touchProbe.representedBefore
        ? "Pending · two activations · one operation"
        : "Unexpected operation/effect count";
  return `
    <section class="correction-fixture-group-v15" aria-labelledby="correction-fixture-title-v15">
      <h3 id="correction-fixture-title-v15" tabindex="-1">Correction Editor · synthetic states</h3>
      <p>Fictional Source Items, base revisions, drafts, operation identities, and outcomes stay in this tab's memory. No Correction is persisted.</p>
      <p class="prototype-data-label-v9">Current Correction state · ${html(state.shell.correction.status)} · ${html(CORRECTION_BRANCHES_V15[state.shell.correctionBranch])} · ${representedCount} represented record${representedCount === 1 ? "" : "s"}</p>
      <p class="prototype-data-label-v9">Foreign save callback guard · ${correctionCallbackProbeV15.foreignSaveIgnored == null ? "Not run" : correctionCallbackProbeV15.foreignSaveIgnored ? "Ignored · active source unchanged" : "Unexpected state change"}</p>
      <p class="prototype-data-label-v9">Earlier-flow save callback guard · ${correctionCallbackProbeV15.priorFlowSaveIgnored == null ? "Not run" : correctionCallbackProbeV15.priorFlowSaveIgnored ? "Ignored · current flow unchanged" : "Unexpected state change"}</p>
      <p class="prototype-data-label-v9">Old editor input guard · ${correctionCallbackProbeV15.staleEditorInputIgnored == null ? "Not run" : correctionCallbackProbeV15.staleEditorInputIgnored ? "Ignored · current source unchanged" : "Unexpected state change"}</p>
      <p class="prototype-data-label-v9">Source-race save callback guard · ${correctionCallbackProbeV15.staleSaveReadyIgnored == null ? "Not run" : correctionCallbackProbeV15.staleSaveReadyIgnored ? "Ignored · review handoff retained" : "Unexpected state change"}</p>
      <p class="prototype-data-label-v9">Touch compatibility guard · ${touchProbeLabel}</p>
      <fieldset><legend>Correction operation branch</legend><div class="shell-fixture-controls-v10 correction-fixture-controls-v15">${branchButtons}</div></fieldset>
      <div class="inline-actions correction-fixture-controls-v15">
        <button type="button" class="secondary-button" data-action="open-correction-fixture" data-correction-kind="voice">Open Voice Journal</button>
        <button type="button" class="secondary-button" data-action="open-correction-fixture" data-correction-kind="uploaded">Open Uploaded Journal</button>
        <button type="button" class="secondary-button" data-action="open-correction-fixture" data-correction-kind="long">Open long-text fixture</button>
        <button type="button" class="secondary-button" data-action="open-existing-correction-fixture">Open displayed Correction</button>
        <button type="button" class="secondary-button" data-action="test-missing-base-correction">Test missing-base rejection</button>
        <button type="button" class="secondary-button" data-action="test-stale-editor-input">Test old editor input callback</button>
        <button type="button" class="text-button" data-action="reset-correction-fixture">Reset Correction scenario</button>
      </div>
      <fieldset><legend>Settled callback guards</legend><div class="shell-fixture-controls-v10 correction-fixture-controls-v15">
        <button type="button" class="text-button" data-action="replay-correction-callback" data-callback-kind="save" ${correctionCallbackReplayV15.saveReady ? "" : "disabled"}>Replay save success callback</button>
        <button type="button" class="text-button" data-action="fail-after-correction-success" data-callback-kind="save" ${correctionCallbackReplayV15.saveReady ? "" : "disabled"}>Deliver save failure after success</button>
        <button type="button" class="text-button" data-action="callback-after-correction-reset" data-callback-kind="save" ${correctionCallbackReplayV15.saveReady ? "" : "disabled"}>Deliver save success after reset</button>
        <button type="button" class="text-button" data-action="replay-correction-callback" data-callback-kind="remove" ${correctionCallbackReplayV15.removeReady ? "" : "disabled"}>Replay removal success callback</button>
        <button type="button" class="text-button" data-action="fail-after-correction-success" data-callback-kind="remove" ${correctionCallbackReplayV15.removeReady ? "" : "disabled"}>Deliver removal failure after success</button>
        <button type="button" class="text-button" data-action="callback-after-correction-reset" data-callback-kind="remove" ${correctionCallbackReplayV15.removeReady ? "" : "disabled"}>Deliver removal success after reset</button>
      </div></fieldset>
      <p class="correction-console-boundary-v15">Text Correction only. No diff, upstream conflict resolution, redating, complete History, persistence, or backend behavior is represented.</p>
    </section>`;
}

function sourceConflictValidationV16(draft) {
  const value = String(draft ?? "");
  if (!value.trim()) return { kind: "empty", message: SOURCE_CONFLICT_COPY_V16.empty, valid: false };
  if (value === SOURCE_CONFLICT_TEXT_V16.c1) return { kind: "equals-c1", message: SOURCE_CONFLICT_COPY_V16.equalsC1, valid: false };
  if (value === VOICE_R2_TEXT_V16) return { kind: "equals-r2", message: SOURCE_CONFLICT_COPY_V16.equalsR2, valid: false };
  return { kind: "valid", message: SOURCE_CONFLICT_COPY_V16.dirty, valid: true };
}

function sourceConflictWithoutCurrentCorrectionV16(model) {
  return {
    ...model,
    eligibility: "no-current-correction",
    stage: "source-card-ineligible",
    outcome: null,
    previewInvoker: null,
    draft: "",
    draftSelection: null,
    draftScrollTop: 0,
    editorIncarnation: null,
    validation: "empty",
    validationAttempted: false,
    dirty: false,
    expectedSnapshot: null,
    operation: null,
    operationPhase: "idle",
    intent: null,
    failureCopy: "",
    resultCopy: "",
    terminal: null,
    displayed: "r1",
    corrections: 0,
    correctionRecords: Object.freeze([]),
    events: 0,
    resolutionEvents: Object.freeze([]),
    c1Status: "Absent",
    c2Text: null,
    r2Reviewed: false,
    r3Queued: false,
    latestReviewed: false,
  };
}

function sourceConflictDisplayedLabelV16(model) {
  if (model.displayed === "c1") return "Correction 1";
  if (model.displayed === "r2") return "Voice R2";
  if (model.displayed === "c2") return "Correction 2";
  return "Voice R1";
}

function transitionSourceConflictV16(model, type, payload = {}) {
  switch (type) {
    case "RESET": {
      const next = initialSourceConflictV16(model.generation + 1);
      next.fixture = payload.fixture || model.fixture;
      next.branch = payload.branch || model.branch;
      return next.fixture === "no-current-correction" ? sourceConflictWithoutCurrentCorrectionV16(next) : next;
    }
    case "FIXTURE_SET": {
      const next = initialSourceConflictV16(model.generation + 1);
      next.fixture = payload.fixture;
      next.branch = model.branch;
      return payload.fixture === "no-current-correction" ? sourceConflictWithoutCurrentCorrectionV16(next) : next;
    }
    case "BRANCH_SET":
      return { ...model, branch: payload.branch };
    case "ACTIVATE": {
      const active = { ...model, active: true, stage: "source-card-conflict", eligibility: payload.eligibility || model.eligibility };
      return active.eligibility === "no-current-correction" ? sourceConflictWithoutCurrentCorrectionV16(active) : active;
    }
    case "LOAD_START":
      return { ...model, stage: "review-loading", compareMode: "complete", expandedUnchanged: false, compactDocument: "c1", failureCopy: "" };
    case "LOAD_READY":
      return { ...model, stage: "review-ready", compareMode: "complete", expandedUnchanged: false, compactDocument: "c1", failureCopy: "" };
    case "LOAD_FAIL":
      return { ...model, stage: "review-load-failed", failureCopy: SOURCE_CONFLICT_COPY_V16.loadFailure };
    case "COMPARE_MODE_SET":
      return { ...model, compareMode: payload.mode, expandedUnchanged: false };
    case "UNCHANGED_TOGGLE":
      return { ...model, expandedUnchanged: !model.expandedUnchanged };
    case "COMPACT_DOCUMENT_SET":
      return { ...model, compactDocument: payload.document };
    case "PREVIEW_OPEN":
      return { ...model, stage: `preview-${payload.outcome}`, outcome: payload.outcome, previewInvoker: payload.invoker };
    case "PREVIEW_CLOSE":
      return { ...model, stage: "review-ready", outcome: null, previewInvoker: null };
    case "WORKSPACE_OPEN":
      if (!payload.editorIncarnation || typeof payload.editorIncarnation !== "object") return model;
      return {
        ...model,
        stage: "workspace-clean",
        outcome: "based-on-both",
        draft: SOURCE_CONFLICT_TEXT_V16.c1,
        validation: "equals-c1",
        validationAttempted: false,
        dirty: false,
        draftSelection: { start: SOURCE_CONFLICT_TEXT_V16.c1.length, end: SOURCE_CONFLICT_TEXT_V16.c1.length, direction: "none" },
        draftScrollTop: 0,
        editorIncarnation: payload.editorIncarnation,
      };
    case "DRAFT_INPUT": {
      if (!model.editorIncarnation
        || payload.editorIncarnation !== model.editorIncarnation
        || !["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(model.stage)) return model;
      const validation = sourceConflictValidationV16(payload.draft);
      return {
        ...model,
        stage: validation.valid ? "workspace-dirty" : "workspace-invalid",
        draft: payload.draft,
        validation: validation.kind,
        validationAttempted: true,
        dirty: payload.draft !== SOURCE_CONFLICT_TEXT_V16.c1,
        draftSelection: payload.selection || model.draftSelection,
        draftScrollTop: Number.isFinite(payload.scrollTop) ? payload.scrollTop : model.draftScrollTop,
        failureCopy: "",
      };
    }
    case "SELECTION":
      if (!model.editorIncarnation
        || payload.editorIncarnation !== model.editorIncarnation
        || !["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(model.stage)) return model;
      return { ...model, draftSelection: payload.selection || model.draftSelection, draftScrollTop: Number.isFinite(payload.scrollTop) ? payload.scrollTop : model.draftScrollTop };
    case "WORKSPACE_CANCEL":
      return { ...model, stage: "review-ready", outcome: null, draft: "", draftSelection: null, draftScrollTop: 0, editorIncarnation: null, validation: "empty", validationAttempted: false, dirty: false, failureCopy: "" };
    case "RESOLUTION_START":
      return {
        ...model,
        stage: "resolution-pending",
        outcome: payload.outcome,
        expectedSnapshot: payload.snapshot,
        operation: payload.operation,
        operationPhase: "pre-acceptance",
        intent: payload.intent,
        failureCopy: "",
        resultCopy: "",
      };
    case "RESOLUTION_FAIL":
      return { ...model, stage: "resolution-failed-known-zero", operationPhase: "known-zero", failureCopy: payload.copy || SOURCE_CONFLICT_COPY_V16.knownZero };
    case "RESOLUTION_UNKNOWN":
      return { ...model, stage: "resolution-unknown", operationPhase: "post-acceptance-unknown", failureCopy: SOURCE_CONFLICT_COPY_V16.unknown };
    case "RECONCILE_START":
      return { ...model, stage: "reconciling", operationPhase: "reconciling", failureCopy: "" };
    case "R3_QUEUE":
      return { ...model, r3Queued: true };
    case "R3_STALE":
      return {
        ...model,
        stage: "stale-r3",
        outcome: null,
        previewInvoker: null,
        draft: "",
        draftSelection: null,
        draftScrollTop: 0,
        editorIncarnation: null,
        validation: "empty",
        validationAttempted: false,
        dirty: false,
        operation: null,
        operationPhase: "idle",
        expectedSnapshot: null,
        intent: null,
        r3Queued: false,
        newestRevision: "r3",
        revisions: 3,
        revisionRecords: sourceConflictRevisionRecordsWithR3V16(model),
        failureCopy: SOURCE_CONFLICT_COPY_V16.stale,
      };
    case "R3_REVIEW_READY":
      return { ...model, stage: "review-ready", newestRevision: "r3", compareMode: "complete", expandedUnchanged: false, compactDocument: "c1", outcome: null, failureCopy: "" };
    case "SESSION_EXPIRE":
      return { ...initialSourceConflictV16(model.generation + 1), fixture: model.fixture, branch: model.branch, stage: "session-ended", active: true };
    case "SETTLED":
      return {
        ...model,
        stage: payload.r3Queued ? "source-card-conflict" : "resolution-settled",
        terminal: payload.terminal,
        displayed: payload.displayed,
        corrections: payload.corrections,
        c2Text: payload.c2Text || model.c2Text,
        events: 1,
        correctionRecords: payload.correctionRecord ? Object.freeze([...model.correctionRecords, payload.correctionRecord]) : model.correctionRecords,
        resolutionEvents: Object.freeze([payload.resolutionEvent]),
        c1Status: payload.c1Status,
        r2Reviewed: true,
        operation: null,
        operationPhase: "settled",
        expectedSnapshot: null,
        intent: null,
        resultCopy: payload.terminal.copy,
        newestRevision: payload.r3Queued ? "r3" : model.newestRevision,
        revisions: payload.r3Queued ? 3 : model.revisions,
        revisionRecords: payload.r3Queued ? sourceConflictRevisionRecordsWithR3V16(model) : model.revisionRecords,
        r3Queued: false,
        outcome: null,
        previewInvoker: null,
        draft: "",
        draftSelection: null,
        draftScrollTop: 0,
        editorIncarnation: null,
        validation: "empty",
        validationAttempted: false,
        dirty: false,
      };
    default:
      return model;
  }
}

function sourceConflictRevisionRecordsWithR3V16(model) {
  if (model.revisionRecords.some((record) => record.id === "Voice R3")) return model.revisionRecords;
  return Object.freeze([...model.revisionRecords, Object.freeze({ id: "Voice R3", text: VOICE_R3_TEXT_V16, author: "Archive owner · simulated", represented: SOURCE_CONFLICT_TIMES_V16.r3Represented })]);
}

function dispatchSourceConflictV16(type, payload = {}) {
  if (["RESET", "FIXTURE_SET", "SESSION_EXPIRE", "WORKSPACE_CANCEL", "R3_STALE", "SETTLED"].includes(type)) clearSourceConflictEditorPrivateStateV16();
  if (["RESET", "FIXTURE_SET", "SESSION_EXPIRE", "R3_STALE", "SETTLED"].includes(type)) pendingSourceConflictNavigationV16 = null;
  if (["RESET", "FIXTURE_SET", "SESSION_EXPIRE"].includes(type)) clearSourceConflictReplayLedgerV16();
  state.sourceConflict = transitionSourceConflictV16(state.sourceConflict, type, payload);
  return state.sourceConflict;
}

function clearSourceConflictEditorPrivateStateV16() {
  const editor = root.querySelector("#source-conflict-draft-v16");
  if (!editor) return;
  sourceConflictEditorIncarnationsV16.delete(editor);
  editor.value = "";
  editor.textContent = "";
  editor.scrollTop = 0;
  editor.remove();
}

function clearSourceConflictTimersV16() {
  for (const timer of sourceConflictTimersV16) window.clearTimeout(timer);
  sourceConflictTimersV16.clear();
}

function clearSourceConflictReplayLedgerV16() {
  sourceConflictReplayEnvelopeV16 = null;
}

function deferSourceConflictReboundActionV16(kind, callback) {
  const rebound = pendingSourceConflictPopReboundV16;
  if (!rebound || rebound.flushing || typeof callback !== "function") return false;
  rebound.deferredActions.push(Object.freeze({
    sequence: ++sourceConflictReboundActionSequenceV16,
    kind,
    callback,
  }));
  return true;
}

function flushSourceConflictReboundActionsV16(rebound) {
  if (!rebound || pendingSourceConflictPopReboundV16 || rebound.flushing) return 0;
  const actions = rebound.deferredActions.splice(0).sort((left, right) => left.sequence - right.sequence);
  let flushed = 0;
  rebound.flushing = true;
  try {
    for (const action of actions) {
      if (state.sourceConflict.stage === "session-ended") break;
      action.callback();
      flushed += 1;
    }
  } finally {
    rebound.flushing = false;
  }
  return flushed;
}

function scheduleSourceConflictV16(callback, delay = 560) {
  const generation = state.sourceConflict.generation;
  const run = () => {
    if (state.sourceConflict.generation !== generation) return;
    callback();
  };
  const timer = window.setTimeout(() => {
    sourceConflictTimersV16.delete(timer);
    if (state.sourceConflict.generation !== generation) return;
    if (deferSourceConflictReboundActionV16("timer", run)) return;
    run();
  }, delay);
  sourceConflictTimersV16.add(timer);
  return timer;
}

function announceSourceConflictV16(message, { assertive = false } = {}) {
  if (!sourceConflictStatusLiveV16) return;
  const epoch = ++sourceConflictAnnouncementEpochV16;
  sourceConflictStatusLiveV16.setAttribute("aria-live", assertive ? "assertive" : "polite");
  sourceConflictStatusLiveV16.textContent = "";
  requestAnimationFrame(() => {
    if (epoch === sourceConflictAnnouncementEpochV16) sourceConflictStatusLiveV16.textContent = message;
  });
}

function clearSourceConflictAnnouncementV16() {
  sourceConflictAnnouncementEpochV16 += 1;
  if (!sourceConflictStatusLiveV16) return;
  sourceConflictStatusLiveV16.setAttribute("aria-live", "polite");
  sourceConflictStatusLiveV16.textContent = "";
}

function sourceConflictTextsV16(model = state.sourceConflict) {
  if (model.fixture === "long-hostile") return { correction: LONG_CONFLICT_C1_V16, revision: LONG_CONFLICT_R2_V16 };
  const displayedText = model.displayed === "r2" ? VOICE_R2_TEXT_V16 : model.displayed === "c2" ? model.c2Text || VOICE_C2_TEXT_V16 : SOURCE_CONFLICT_TEXT_V16.c1;
  return {
    correction: displayedText,
    revision: model.newestRevision === "r3" ? VOICE_R3_TEXT_V16 : VOICE_R2_TEXT_V16,
  };
}

function sourceConflictHasExactOwnKeysV16(value, expectedKeys) {
  if (!value || typeof value !== "object") return false;
  const ownKeys = Reflect.ownKeys(value);
  return ownKeys.length === expectedKeys.length && expectedKeys.every((key) => Object.hasOwn(value, key));
}

function sourceConflictSnapshotIsCompleteV16(snapshot) {
  return sourceConflictHasExactOwnKeysV16(snapshot, SOURCE_CONFLICT_SNAPSHOT_KEYS_V16)
    && snapshot.completeness === SOURCE_CONFLICT_COMPLETENESS_V16.snapshot
    && Number.isInteger(snapshot.conflictGeneration)
    && Number.isInteger(snapshot.displayEpoch)
    && typeof snapshot.displayedRecordId === "string"
    && typeof snapshot.newestRecordId === "string"
    && (snapshot.draft === null || typeof snapshot.draft === "string");
}

function sourceConflictResultIsCompleteV16(result) {
  return sourceConflictHasExactOwnKeysV16(result, SOURCE_CONFLICT_RESULT_KEYS_V16)
    && result.completeness === SOURCE_CONFLICT_COMPLETENESS_V16.result
    && Number.isInteger(result.conflictGeneration)
    && Number.isInteger(result.displayEpoch)
    && typeof result.displayedRecordId === "string"
    && typeof result.newestRecordId === "string"
    && typeof result.intent === "string"
    && (result.draft === null || typeof result.draft === "string");
}

function sourceConflictCallbackEnvelopeIsCompleteV16(envelope) {
  return sourceConflictHasExactOwnKeysV16(envelope, SOURCE_CONFLICT_CALLBACK_KEYS_V16)
    && envelope.completeness === SOURCE_CONFLICT_COMPLETENESS_V16.callback
    && ["success", "failure"].includes(envelope.kind)
    && ["effect", "reconciliation"].includes(envelope.origin)
    && Number.isInteger(envelope.generation)
    && Number.isInteger(envelope.operationSequence)
    && Number.isInteger(envelope.operationIncarnation)
    && typeof envelope.copy === "string"
    && (envelope.kind === "success" || envelope.result === null);
}

function sourceConflictSnapshotV16(model = state.sourceConflict) {
  return Object.freeze({
    completeness: SOURCE_CONFLICT_COMPLETENESS_V16.snapshot,
    conflictGeneration: model.generation,
    displayed: model.displayed,
    displayEpoch: model.displayEpoch,
    displayedRecordId: model.displayed === "c1" ? "C-VOICE-1" : model.displayed === "r2" ? "Voice R2" : "C-VOICE-2",
    newestRecordId: model.newestRevision === "r2" ? "Voice R2" : "Voice R3",
    newestRevision: model.newestRevision,
    outcome: model.outcome,
    draft: model.outcome === "based-on-both" ? model.draft : null,
  });
}

function sourceConflictSnapshotMatchesV16(model, operation, result) {
  const snapshot = operation?.snapshot;
  const expectedDraft = operation?.outcome === "based-on-both" ? operation?.draft : null;
  return sourceConflictSnapshotIsCompleteV16(snapshot)
    && sourceConflictResultIsCompleteV16(result)
    && operation.generation === model.generation
    && snapshot.conflictGeneration === model.generation
    && snapshot.displayed === model.displayed
    && snapshot.displayEpoch === model.displayEpoch
    && snapshot.displayedRecordId === "C-VOICE-1"
    && snapshot.newestRecordId === "Voice R2"
    && snapshot.displayed === "c1"
    && snapshot.newestRevision === "r2"
    && snapshot.outcome === operation.outcome
    && result?.outcome === operation.outcome
    && result?.conflictGeneration === snapshot.conflictGeneration
    && result?.displayed === snapshot.displayed
    && result?.displayEpoch === snapshot.displayEpoch
    && result?.displayedRecordId === snapshot.displayedRecordId
    && result?.newestRevision === snapshot.newestRevision
    && result?.newestRecordId === snapshot.newestRecordId
    && result?.intent === operation.intent
    && operation.draft === expectedDraft
    && snapshot.draft === expectedDraft
    && result.draft === expectedDraft
    && !model.terminal;
}

function sourceConflictResultV16(operation) {
  return Object.freeze({
    completeness: SOURCE_CONFLICT_COMPLETENESS_V16.result,
    conflictGeneration: operation.snapshot.conflictGeneration,
    outcome: operation.outcome,
    displayed: operation.snapshot.displayed,
    displayEpoch: operation.snapshot.displayEpoch,
    displayedRecordId: operation.snapshot.displayedRecordId,
    newestRevision: operation.snapshot.newestRevision,
    newestRecordId: operation.snapshot.newestRecordId,
    intent: operation.intent,
    draft: operation.outcome === "based-on-both" ? operation.draft : null,
  });
}

function sourceConflictTerminalV16(outcome) {
  if (outcome === "keep") return Object.freeze({ outcome, label: "Keep the Correction", time: SOURCE_CONFLICT_TIMES_V16.keep, copy: SOURCE_CONFLICT_COPY_V16.keepSuccess });
  if (outcome === "display-newest") return Object.freeze({ outcome, label: "Display newest upstream revision", time: SOURCE_CONFLICT_TIMES_V16.displayNewest, copy: SOURCE_CONFLICT_COPY_V16.displaySuccess });
  return Object.freeze({ outcome: "based-on-both", label: "Create a new Correction based on both", time: SOURCE_CONFLICT_TIMES_V16.basedOnBoth, copy: SOURCE_CONFLICT_COPY_V16.manualSuccess });
}

function sourceConflictCallbackEnvelopeV16(kind, operation, { result = null, copy = "", origin = "effect" } = {}) {
  return Object.freeze({
    completeness: SOURCE_CONFLICT_COMPLETENESS_V16.callback,
    kind,
    origin,
    generation: operation?.generation,
    operation,
    operationSequence: operation?.sequence,
    operationIncarnation: operation?.incarnation,
    result,
    copy,
  });
}

function incompleteSourceConflictResultV16(operation) {
  const complete = sourceConflictResultV16(operation);
  return Object.freeze({
    conflictGeneration: complete.conflictGeneration,
    outcome: complete.outcome,
    displayed: complete.displayed,
    newestRevision: complete.newestRevision,
    intent: complete.intent,
    draft: complete.draft,
  });
}

function incompleteSourceConflictCallbackEnvelopeV16(operation) {
  const complete = sourceConflictCallbackEnvelopeV16("success", operation, { result: sourceConflictResultV16(operation), origin: "effect" });
  const { completeness, ...incomplete } = complete;
  return Object.freeze(incomplete);
}

function mismatchedSourceConflictReconciliationResultV16(operation, branch) {
  const complete = sourceConflictResultV16(operation);
  if (branch === "reconciliation-mismatch-outcome") return Object.freeze({ ...complete, outcome: operation.outcome === "keep" ? "display-newest" : "keep" });
  if (branch === "reconciliation-mismatch-intent") return Object.freeze({ ...complete, intent: "mismatched-intent" });
  if (branch === "reconciliation-mismatch-r2") return Object.freeze({ ...complete, newestRecordId: "Voice R3" });
  return Object.freeze({ ...complete, displayedRecordId: "C-VOICE-2" });
}

function sourceConflictCallbackOriginIsCurrentV16(model, envelope) {
  const operation = envelope?.operation;
  if (!operation
    || !["success", "failure"].includes(envelope?.kind)
    || envelope.generation !== operation.generation
    || envelope.operationSequence !== operation.sequence
    || envelope.operationIncarnation !== operation.incarnation
    || envelope.generation !== model.generation
    || model.terminal) return false;
  if (envelope.origin === "effect") {
    return model.operation === operation
      && model.stage === "resolution-pending"
      && model.operationPhase === "pre-acceptance";
  }
  return envelope.origin === "reconciliation"
    && envelope.kind === "success"
    && model.operation === operation
    && model.stage === "reconciling"
    && model.operationPhase === "reconciling";
}

function authorizedSourceConflictCallbackV16(model, envelope) {
  const operation = envelope?.operation;
  const currentOrigin = sourceConflictCallbackOriginIsCurrentV16(model, envelope);
  if (!sourceConflictCallbackEnvelopeIsCompleteV16(envelope)) return { ok: false, reason: currentOrigin ? "incomplete-current" : "incomplete" };
  if (!operation || envelope.generation !== operation.generation || envelope.operationSequence !== operation.sequence || envelope.operationIncarnation !== operation.incarnation) return { ok: false, reason: "incarnation" };
  if (envelope.generation !== model.generation) return { ok: false, reason: "generation" };
  if (model.terminal) return { ok: false, reason: "terminal" };
  if (envelope.kind === "success" && !sourceConflictResultIsCompleteV16(envelope.result)) return { ok: false, reason: currentOrigin ? "incomplete-current" : "incomplete" };
  if (envelope.origin === "effect") {
    return model.operation === operation
      && model.stage === "resolution-pending"
      && model.operationPhase === "pre-acceptance"
      ? { ok: true }
      : { ok: false, reason: "origin" };
  }
  const reconciliationAuthorized = envelope.kind === "success"
    && model.stage === "reconciling"
    && model.operationPhase === "reconciling"
    && sourceConflictAcceptedResultsV16.get(operation) === envelope.result
    && sourceConflictWinnerByGenerationV16.get(model.generation) === operation;
  if (reconciliationAuthorized) return { ok: true };
  return { ok: false, reason: currentOrigin ? "reconciliation-mismatch-current" : "reconciliation" };
}

function rejectSourceConflictCallbackV16(reason, kind) {
  const copy = reason === "terminal"
    ? `${kind === "failure" ? "Late failure" : "Duplicate success"} ignored · first accepted result retained`
    : reason === "generation" ? "Callback after reset ignored · stale generation"
      : reason === "incomplete" ? "Incomplete callback rejected · zero effect"
      : "Foreign or stale callback ignored · active operation unchanged";
  state.sourceConflict.lastProbe = copy;
  render();
  return false;
}

function failClosedCurrentUntrustedSourceConflictCallbackV16(reason) {
  dispatchSourceConflictV16("RESOLUTION_UNKNOWN", { accepted: false });
  state.sourceConflict.lastProbe = reason === "incomplete-current"
    ? "Incomplete current callback rejected · result remains unknown · zero effect"
    : "Mismatched current reconciliation rejected · result remains unknown · zero effect";
  state.focusAfterRender = "#source-conflict-unknown-title-v16";
  render();
  announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.unknown, { assertive: true });
  return false;
}

function acceptSourceConflictUnknownResultV16(envelope) {
  const model = state.sourceConflict;
  const authorization = authorizedSourceConflictCallbackV16(model, envelope);
  if (!authorization.ok) return ["incomplete-current", "reconciliation-mismatch-current"].includes(authorization.reason)
    ? failClosedCurrentUntrustedSourceConflictCallbackV16(authorization.reason)
    : rejectSourceConflictCallbackV16(authorization.reason, envelope?.kind);
  if (!sourceConflictSnapshotMatchesV16(model, envelope.operation, envelope.result)) {
    dispatchSourceConflictV16("RESOLUTION_UNKNOWN", { accepted: false });
    state.sourceConflict.lastProbe = "Mismatched result rejected · no effect";
    state.focusAfterRender = "#source-conflict-unknown-title-v16";
    render();
    announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.unknown, { assertive: true });
    return false;
  }
  const winner = sourceConflictWinnerByGenerationV16.get(model.generation);
  if (winner && winner !== envelope.operation) return rejectSourceConflictCallbackV16("inactive", envelope.kind);
  sourceConflictAcceptedResultsV16.set(envelope.operation, envelope.result);
  sourceConflictWinnerByGenerationV16.set(model.generation, envelope.operation);
  return true;
}

function settleSourceConflictV16(envelope, { adopted = false } = {}) {
  const model = state.sourceConflict;
  const authorization = authorizedSourceConflictCallbackV16(model, envelope);
  if (!authorization.ok) return ["incomplete-current", "reconciliation-mismatch-current"].includes(authorization.reason)
    ? failClosedCurrentUntrustedSourceConflictCallbackV16(authorization.reason)
    : rejectSourceConflictCallbackV16(authorization.reason, envelope?.kind);
  if (adopted !== (envelope.origin === "reconciliation")) return rejectSourceConflictCallbackV16("origin", envelope.kind);
  const { operation, result } = envelope;
  if (!sourceConflictSnapshotMatchesV16(model, operation, result)) {
    dispatchSourceConflictV16("RESOLUTION_UNKNOWN", { accepted: false });
    state.sourceConflict.lastProbe = "Mismatched result rejected · no effect";
    state.focusAfterRender = "#source-conflict-unknown-title-v16";
    render();
    announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.unknown, { assertive: true });
    return false;
  }
  const winner = sourceConflictWinnerByGenerationV16.get(model.generation);
  if (winner && winner !== operation) {
    state.sourceConflict.lastProbe = "Competing result ignored · first accepted outcome retained";
    render();
    return false;
  }
  sourceConflictWinnerByGenerationV16.set(model.generation, operation);
  sourceConflictAcceptedResultsV16.set(operation, result);
  sourceConflictReplayEnvelopeV16 = sourceConflictCallbackEnvelopeV16("success", operation, { result, origin: "effect" });
  const terminal = sourceConflictTerminalV16(operation.outcome);
  const displayed = operation.outcome === "keep" ? "c1" : operation.outcome === "display-newest" ? "r2" : "c2";
  dispatchSourceConflictV16("SETTLED", {
    terminal,
    displayed,
    corrections: operation.outcome === "based-on-both" ? 2 : 1,
    c2Text: operation.outcome === "based-on-both" ? operation.draft : null,
    correctionRecord: operation.outcome === "based-on-both" ? Object.freeze({ id: "C-VOICE-2", ordinal: 2, text: operation.draft, author: "Archive owner · simulated", created: terminal.time, base: "Voice R2", lineage: "C-VOICE-1" }) : null,
    resolutionEvent: Object.freeze({ outcome: operation.outcome, represented: terminal.time, reviewedRevision: "Voice R2", displayed }),
    c1Status: operation.outcome === "keep" ? "Current" : "Historical",
    r3Queued: model.r3Queued,
  });
  state.sourceConflict.lastProbe = adopted ? "Matching completed result adopted · no second event" : "Matching result accepted · one event";
  returnSourceConflictToCardV16({ terminal: true });
  announceSourceConflictV16(adopted ? `${SOURCE_CONFLICT_COPY_V16.reconciledOne} ${terminal.copy}` : terminal.copy);
  return true;
}

function failSourceConflictCallbackV16(envelope) {
  const authorization = authorizedSourceConflictCallbackV16(state.sourceConflict, envelope);
  if (!authorization.ok) return ["incomplete-current", "reconciliation-mismatch-current"].includes(authorization.reason)
    ? failClosedCurrentUntrustedSourceConflictCallbackV16(authorization.reason)
    : rejectSourceConflictCallbackV16(authorization.reason, envelope?.kind);
  dispatchSourceConflictV16("RESOLUTION_FAIL", { copy: envelope.copy || SOURCE_CONFLICT_COPY_V16.knownZero });
  state.focusAfterRender = "#source-conflict-failure-title-v16";
  render();
  announceSourceConflictV16(state.sourceConflict.failureCopy, { assertive: true });
  return true;
}

function dispatchSourceConflictCallbackV16(envelope, options = {}) {
  if (deferSourceConflictReboundActionV16("callback", () => dispatchSourceConflictCallbackV16(envelope, options))) return false;
  if (envelope?.kind === "success") return settleSourceConflictV16(envelope, options);
  if (envelope?.kind === "failure") return failSourceConflictCallbackV16(envelope);
  return rejectSourceConflictCallbackV16("foreign", envelope?.kind);
}

const sourceConflictWinnerByGenerationV16 = new Map();

function runSourceConflictOperationAttemptV16(operation) {
  if (state.sourceConflict.operation !== operation || state.sourceConflict.terminal) return;
  const branch = operation.branch;
  const twoTabCase = SOURCE_CONFLICT_TWO_TAB_BRANCHES_V16[branch];
  if (branch === "two-tab-competing" || twoTabCase) {
    const competingOutcome = twoTabCase?.winner
      || (operation.outcome === "keep" ? "display-newest" : "keep");
    deliverCompetingSourceConflictOutcomeV16(competingOutcome, { scheduledOperation: operation });
    return;
  }
  if (operation.attempts > 1 && ["known-zero-failure-once", "unknown-zero"].includes(branch)) {
    dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: sourceConflictResultV16(operation), origin: "effect" }));
    return;
  }
  if (branch === "current-display-changed") {
    state.sourceConflict = { ...state.sourceConflict, displayEpoch: state.sourceConflict.displayEpoch + 1 };
    dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: sourceConflictResultV16(operation), origin: "effect" }));
    state.sourceConflict.lastProbe = "Displayed snapshot guard rejected · zero effect";
    render();
    return;
  }
  if (branch === "r3-before-accept") {
    dispatchSourceConflictV16("R3_STALE");
    state.sourceConflict.lastProbe = "R3 snapshot guard rejected · zero effect";
    state.focusAfterRender = "#source-conflict-stale-title-v16";
    render();
    announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.stale, { assertive: true });
    return;
  }
  if (branch === "session-interruption") {
    expireSourceConflictSessionV16();
    return;
  }
  if (["unknown-zero", "unknown-completed", "reconciliation-unknown", "incomplete-reconciliation", ...SOURCE_CONFLICT_RECONCILIATION_MISMATCH_BRANCHES_V16, "r3-post-accept-unknown", "navigate-before-completion"].includes(branch)) {
    const accepted = ["unknown-completed", "r3-post-accept-unknown"].includes(branch);
    if (accepted) {
      const acceptedResult = sourceConflictResultV16(operation);
      const acceptedEnvelope = sourceConflictCallbackEnvelopeV16("success", operation, { result: acceptedResult, origin: "effect" });
      if (!acceptSourceConflictUnknownResultV16(acceptedEnvelope)) return;
    }
    dispatchSourceConflictV16("RESOLUTION_UNKNOWN", { accepted });
    if (branch === "r3-post-accept-unknown") dispatchSourceConflictV16("R3_QUEUE");
    state.focusAfterRender = "#source-conflict-unknown-title-v16";
    render();
    announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.unknown, { assertive: true });
    return;
  }
  if (branch === "mismatched-result") {
    const invalid = { ...sourceConflictResultV16(operation), newestRevision: "mismatch" };
    dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: invalid, origin: "effect" }));
    return;
  }
  if (branch === "incomplete-result") {
    dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: incompleteSourceConflictResultV16(operation), origin: "effect" }));
    return;
  }
  if (branch === "incomplete-envelope") {
    dispatchSourceConflictCallbackV16(incompleteSourceConflictCallbackEnvelopeV16(operation));
    return;
  }
  if (branch === "foreign-callback") {
    const foreignOperation = Object.freeze({ ...operation, incarnation: operation.incarnation + 1 });
    dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", foreignOperation, { result: sourceConflictResultV16(foreignOperation), origin: "effect" }));
    return;
  }
  if (branch === "known-zero-failure-once" || branch === "connection-before-effect") {
    const copy = branch === "connection-before-effect" ? SOURCE_CONFLICT_COPY_V16.connection : SOURCE_CONFLICT_COPY_V16.knownZero;
    dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("failure", operation, { copy, origin: "effect" }));
    return;
  }
  const settled = dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: sourceConflictResultV16(operation), origin: "effect" }));
  const terminalSessionOutcome = SOURCE_CONFLICT_TERMINAL_SESSION_BRANCHES_V16[branch];
  if (settled && terminalSessionOutcome === operation.outcome) {
    scheduleSourceConflictV16(() => {
      if (state.sourceConflict.terminal?.outcome !== terminalSessionOutcome || state.sourceConflict.events !== 1) return;
      expireSourceConflictSessionV16();
    }, 180);
  }
  if (["duplicate-success", "rapid-repeat", "late-failure"].includes(branch)) {
    scheduleSourceConflictV16(() => replaySourceConflictCallbackV16(branch === "late-failure" ? "failure" : "success"), 160);
  }
}

function beginSourceConflictResolutionV16(outcome) {
  const model = state.sourceConflict;
  if (model.eligibility !== "conflict" || model.operation || model.terminal || model.newestRevision !== "r2") return false;
  if (outcome === "based-on-both" && !sourceConflictValidationV16(model.draft).valid) {
    state.focusAfterRender = "#source-conflict-draft-v16";
    render();
    announceSourceConflictV16(sourceConflictValidationV16(model.draft).message, { assertive: true });
    return false;
  }
  const snapshot = Object.freeze({ ...sourceConflictSnapshotV16({ ...model, outcome }) });
  const operation = Object.freeze({
    sequence: ++sourceConflictOperationSequenceV16,
    incarnation: 1,
    generation: model.generation,
    outcome,
    snapshot,
    draft: outcome === "based-on-both" ? model.draft : null,
    intent: SOURCE_CONFLICT_INTENTS_V16[outcome],
    branch: model.branch,
    attempts: 1,
  });
  dispatchSourceConflictV16("RESOLUTION_START", { outcome, snapshot, operation, intent: operation.intent });
  state.modal = null;
  state.focusAfterRender = "#source-conflict-pending-title-v16";
  render();
  announceSourceConflictV16("Resolving source update");
  scheduleSourceConflictV16(() => runSourceConflictOperationAttemptV16(operation), 720);
  return true;
}

function retrySourceConflictResolutionV16() {
  const held = state.sourceConflict.operation;
  if (!held || state.sourceConflict.stage !== "resolution-failed-known-zero") return;
  const operation = Object.freeze({ ...held, attempts: held.attempts + 1, incarnation: held.incarnation + 1 });
  state.sourceConflict = { ...state.sourceConflict, operation, stage: "resolution-pending", operationPhase: "pre-acceptance", failureCopy: "" };
  state.focusAfterRender = "#source-conflict-pending-title-v16";
  render();
  announceSourceConflictV16("Resolving source update");
  scheduleSourceConflictV16(() => runSourceConflictOperationAttemptV16(operation), 620);
}

function checkSourceConflictStatusV16() {
  const operation = state.sourceConflict.operation;
  if (!operation || state.sourceConflict.stage !== "resolution-unknown") return;
  dispatchSourceConflictV16("RECONCILE_START");
  state.focusAfterRender = "#source-conflict-reconciling-title-v16";
  render();
  announceSourceConflictV16("Checking resolution status");
  scheduleSourceConflictV16(() => {
    if (state.sourceConflict.operation !== operation || state.sourceConflict.stage !== "reconciling") return;
    if (operation.branch === "incomplete-reconciliation") {
      dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: incompleteSourceConflictResultV16(operation), origin: "reconciliation" }), { adopted: true });
      return;
    }
    if (SOURCE_CONFLICT_RECONCILIATION_MISMATCH_BRANCHES_V16.includes(operation.branch)) {
      const mismatched = mismatchedSourceConflictReconciliationResultV16(operation, operation.branch);
      dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: mismatched, origin: "reconciliation" }), { adopted: true });
      return;
    }
    const accepted = sourceConflictAcceptedResultsV16.get(operation);
    if (accepted) {
      dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result: accepted, origin: "reconciliation" }), { adopted: true });
      return;
    }
    if (operation.branch === "unknown-zero") {
      if (state.sourceConflict.r3Queued) {
        dispatchSourceConflictV16("R3_STALE");
        state.focusAfterRender = "#source-conflict-stale-title-v16";
        render();
        announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.stale, { assertive: true });
        return;
      }
      dispatchSourceConflictV16("RESOLUTION_FAIL", { copy: SOURCE_CONFLICT_COPY_V16.reconciledZero });
      state.focusAfterRender = "#source-conflict-failure-title-v16";
      render();
      announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.reconciledZero, { assertive: true });
      return;
    }
    dispatchSourceConflictV16("RESOLUTION_UNKNOWN", { accepted: false });
    state.focusAfterRender = "#source-conflict-unknown-title-v16";
    render();
    announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.unknown, { assertive: true });
  }, 640);
}

function sourceConflictParagraphsV16(text, fixture = state.sourceConflict.fixture) {
  return fixture === "long-hostile" ? String(text).split("\n\n") : String(text).split("\n");
}

function renderSourceConflictArticleV16(kind, text, { newestRevision = state.sourceConflict.newestRevision } = {}) {
  const correction = kind === "correction";
  const displayed = state.sourceConflict.displayed;
  const heading = correction
    ? displayed === "r2" ? "Displayed Source Revision" : "Displayed correction"
    : "Newest VoiceNotes revision";
  const status = correction ? "Currently displayed" : "Not displayed";
  const label = correction
    ? displayed === "r2" ? "Voice R2" : displayed === "c2" ? "Correction 2" : "Correction 1"
    : newestRevision === "r3" ? "Voice R3" : "Voice R2";
  const paragraphs = sourceConflictParagraphsV16(text).map((paragraph) => `<p>${html(paragraph)}</p>`).join("");
  return `
    <article class="source-conflict-document-v16 is-${kind}" aria-labelledby="source-conflict-${kind}-title-v16">
      <header><div><p class="eyebrow">${html(label)} · complete text</p><h3 id="source-conflict-${kind}-title-v16">${heading}</h3></div><span class="source-conflict-document-status-v16">${status}</span></header>
      <div class="source-conflict-document-text-v16">${paragraphs}</div>
    </article>`;
}

function renderSourceConflictCompactTabsV16() {
  if (!sourceConflictCompactQueryV16.matches) return "";
  const selected = state.sourceConflict.compactDocument;
  const displayedLabel = state.sourceConflict.displayed === "r2" ? "Displayed Source Revision" : "Displayed correction";
  return `
    <div class="source-conflict-document-tabs-v16" role="tablist" aria-label="Complete conflict documents">
      <button type="button" role="tab" id="source-conflict-correction-tab-v16" aria-selected="${selected === "c1"}" aria-controls="source-conflict-compact-panel-v16" tabindex="${selected === "c1" ? "0" : "-1"}" data-action="select-source-conflict-document" data-conflict-document="correction">${displayedLabel}</button>
      <button type="button" role="tab" id="source-conflict-revision-tab-v16" aria-selected="${selected === "r2"}" aria-controls="source-conflict-compact-panel-v16" tabindex="${selected === "r2" ? "0" : "-1"}" data-action="select-source-conflict-document" data-conflict-document="revision">Newest VoiceNotes revision</button>
    </div>`;
}

function sourceConflictCurrentViewControlSelectorV16(model = state.sourceConflict) {
  const view = model.compareMode === "changes" ? "changes" : "complete";
  return `[data-action="set-source-conflict-view"][data-conflict-view="${view}"]`;
}

function sourceConflictCurrentCompactTabSelectorV16(model = state.sourceConflict) {
  const document = model.compactDocument === "r2" ? "revision" : "correction";
  return `[data-action="select-source-conflict-document"][data-conflict-document="${document}"]`;
}

function sourceConflictFallbackFocusSelectorsV16(model = state.sourceConflict) {
  if (["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(model.stage)) {
    return ["#source-conflict-draft-v16", "#source-conflict-workspace-title-v16"];
  }
  if (["review-ready", "preview-keep", "preview-display-newest", "preview-based-on-both"].includes(model.stage)) {
    return [sourceConflictCurrentViewControlSelectorV16(model), "#source-conflict-compare-title-v16", "#source-conflict-title-v16"];
  }
  const operationalHeadings = {
    "review-loading": "#source-conflict-loading-title-v16",
    "review-load-failed": "#source-conflict-load-failure-title-v16",
    "resolution-pending": "#source-conflict-pending-title-v16",
    "resolution-failed-known-zero": "#source-conflict-failure-title-v16",
    "resolution-unknown": "#source-conflict-unknown-title-v16",
    reconciling: "#source-conflict-reconciling-title-v16",
    "stale-r3": "#source-conflict-stale-title-v16",
    "session-ended": "#source-conflict-session-title-v16",
  };
  return [operationalHeadings[model.stage], "#prototype-main"].filter(Boolean);
}

function sourceConflictResponsiveFocusSelectorV16(activeElement, nextCompact) {
  const model = state.sourceConflict;
  const selector = selectorForLogicalFocus(activeElement);
  const action = activeElement?.closest?.("[data-action]")?.dataset.action;
  if (["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(model.stage)) {
    return selector || "#source-conflict-draft-v16";
  }
  if (["review-ready", "preview-keep", "preview-display-newest", "preview-based-on-both"].includes(model.stage)) {
    if (!nextCompact && action === "select-source-conflict-document") {
      return sourceConflictCurrentViewControlSelectorV16(model);
    }
    if (nextCompact && ["#source-conflict-correction-title-v16", "#source-conflict-revision-title-v16"].includes(selector)) {
      return sourceConflictCurrentCompactTabSelectorV16(model);
    }
    return selector || sourceConflictCurrentViewControlSelectorV16(model);
  }
  return selector || sourceConflictFallbackFocusSelectorsV16(model)[0];
}

function resolveSourceConflictFocusTargetV16(selector) {
  const candidates = [selector, ...sourceConflictFallbackFocusSelectorsV16()];
  for (const candidate of new Set(candidates.filter(Boolean))) {
    const target = resolveLogicalSelector(candidate);
    if (target) return target;
  }
  return null;
}

function renderSourceConflictCompleteV16() {
  const model = state.sourceConflict;
  const texts = sourceConflictTextsV16(model);
  const compact = sourceConflictCompactQueryV16.matches;
  const articles = compact
    ? `<div id="source-conflict-compact-panel-v16" role="tabpanel" aria-labelledby="source-conflict-${model.compactDocument === "c1" ? "correction" : "revision"}-tab-v16">${model.compactDocument === "c1" ? renderSourceConflictArticleV16("correction", texts.correction) : renderSourceConflictArticleV16("revision", texts.revision)}</div>`
    : `${renderSourceConflictArticleV16("correction", texts.correction)}${renderSourceConflictArticleV16("revision", texts.revision)}`;
  return `${renderSourceConflictCompactTabsV16()}<div class="source-conflict-complete-v16${compact ? " is-compact" : ""}">${articles}</div>`;
}

function sourceConflictDiffV16(model = state.sourceConflict) {
  const texts = sourceConflictTextsV16(model);
  const correction = sourceConflictParagraphsV16(texts.correction, model.fixture);
  const revision = sourceConflictParagraphsV16(texts.revision, model.fixture);
  const unchanged = [];
  const correctionOnly = [];
  const revisionOnly = [];
  const length = Math.max(correction.length, revision.length);
  for (let index = 0; index < length; index += 1) {
    const correctionParagraph = correction[index];
    const revisionParagraph = revision[index];
    if (correctionParagraph != null && correctionParagraph === revisionParagraph) {
      unchanged.push(correctionParagraph);
      continue;
    }
    if (correctionParagraph != null) correctionOnly.push(correctionParagraph);
    if (revisionParagraph != null) revisionOnly.push(revisionParagraph);
  }
  return Object.freeze({
    unchanged: Object.freeze(unchanged),
    correction: Object.freeze(correctionOnly),
    revision: Object.freeze(revisionOnly),
  });
}

function sourceConflictDiffRowsV16(kind, diff, displayedKind = "Correction", semanticKind = kind) {
  const correction = kind === "correction";
  return diff[kind].map((paragraph) => `<div class="source-conflict-difference-v16 is-${semanticKind}"><strong>${correction ? `Only in displayed ${displayedKind}` : "Only in newest VoiceNotes revision"}</strong><p>${html(paragraph)}</p></div>`).join("");
}

function sourceConflictUnchangedLabelsV16(count, expanded) {
  if (count === 1) return expanded
    ? { status: "1 unchanged paragraph shown", action: "Hide 1 unchanged paragraph" }
    : { status: "1 unchanged paragraph hidden", action: "Show 1 unchanged paragraph" };
  if (count === 3) return expanded
    ? { status: "3 unchanged paragraphs shown", action: "Hide 3 unchanged paragraphs" }
    : { status: "3 unchanged paragraphs hidden", action: "Show 3 unchanged paragraphs" };
  return {
    status: `${count} unchanged paragraphs ${expanded ? "shown" : "hidden"}`,
    action: `${expanded ? "Hide" : "Show"} ${count} unchanged paragraphs`,
  };
}

function renderSourceConflictChangesV16() {
  const model = state.sourceConflict;
  const diff = sourceConflictDiffV16(model);
  const count = diff.unchanged.length;
  const labels = sourceConflictUnchangedLabelsV16(count, model.expandedUnchanged);
  const compact = sourceConflictCompactQueryV16.matches;
  const unchangedText = diff.unchanged.map((paragraph) => `<p>${html(paragraph)}</p>`).join("");
  const displayedKind = model.displayed === "r2" ? "Source Revision" : "Correction";
  const displayedSemanticKind = model.displayed === "r2" ? "revision" : "correction";
  const displayedDiff = `<article class="source-conflict-changes-column-v16 is-${displayedSemanticKind}" aria-label="Changes in displayed ${displayedKind}">${sourceConflictDiffRowsV16("correction", diff, displayedKind, displayedSemanticKind)}</article>`;
  const revisionDiff = `<article class="source-conflict-changes-column-v16 is-revision" aria-label="Changes in newest VoiceNotes revision">${sourceConflictDiffRowsV16("revision", diff)}</article>`;
  const activeDiff = compact ? (model.compactDocument === "c1" ? displayedDiff : revisionDiff) : `${displayedDiff}${revisionDiff}`;
  const diffPanel = compact
    ? `<div id="source-conflict-compact-panel-v16" role="tabpanel" aria-labelledby="source-conflict-${model.compactDocument === "c1" ? "correction" : "revision"}-tab-v16">${activeDiff}</div>`
    : activeDiff;
  return `
    ${renderSourceConflictCompactTabsV16()}
    <div class="source-conflict-changes-v16${compact ? " is-compact" : ""}">${diffPanel}</div>
    <section class="source-conflict-unchanged-v16" aria-labelledby="source-conflict-unchanged-title-v16">
      <h3 id="source-conflict-unchanged-title-v16">${labels.status}</h3>
      <button type="button" class="text-button" data-action="toggle-source-conflict-unchanged" aria-expanded="${model.expandedUnchanged}">${labels.action}</button>
      ${model.expandedUnchanged ? `<div class="source-conflict-unchanged-text-v16">${unchangedText}</div>` : ""}
    </section>`;
}

function renderSourceConflictFactsV16() {
  const revision = state.sourceConflict.newestRevision === "r3" ? "Voice R3" : "Voice R2";
  const represented = state.sourceConflict.newestRevision === "r3" ? SOURCE_CONFLICT_TIMES_V16.r3Represented : SOURCE_CONFLICT_TIMES_V16.r2Represented;
  return `
    <dl class="source-conflict-facts-v16">
      <div><dt>Source type</dt><dd>${html(SOURCE_CONFLICT_ITEM_V16.sourceType)}</dd></div>
      <div><dt>Source title</dt><dd>${html(SOURCE_CONFLICT_ITEM_V16.title)}</dd></div>
      <div><dt>Original Timestamp</dt><dd>${html(SOURCE_CONFLICT_ITEM_V16.originalTimestamp)}</dd></div>
      <div><dt>Current Journal Date</dt><dd>${html(SOURCE_CONFLICT_ITEM_V16.journalDate)}</dd></div>
      <div><dt>Correction 1 created</dt><dd>${html(SOURCE_CONFLICT_TIMES_V16.c1Created)}</dd></div>
      <div><dt>${revision} represented</dt><dd>${html(represented)}</dd></div>
    </dl>`;
}

function renderSourceConflictOutcomeCardsV16() {
  return `
    <section class="source-conflict-outcomes-v16" aria-labelledby="source-conflict-outcomes-title-v16">
      <h2 id="source-conflict-outcomes-title-v16">Choose what Life in Days displays</h2>
      <div class="source-conflict-outcome-grid-v16">
        ${Object.entries(SOURCE_CONFLICT_OUTCOMES_V16).map(([outcome, item]) => `
          <article class="source-conflict-outcome-card-v16">
            <h3>${html(item.label)}</h3><p>${html(item.preview)}</p>
            <button type="button" class="secondary-button" data-action="preview-source-conflict-outcome" data-conflict-outcome="${outcome}">${html(item.label)}</button>
          </article>`).join("")}
      </div>
    </section>`;
}

function renderSourceConflictBoundaryV16() {
  return `<aside class="source-conflict-boundary-v16"><p>${html(SOURCE_CONFLICT_COPY_V16.prototype)}</p><p>${html(SOURCE_CONFLICT_COPY_V16.derived)}</p></aside>`;
}

function renderSourceConflictReadyV16() {
  const model = state.sourceConflict;
  const entryCopy = model.displayed === "r2"
    ? "VoiceNotes changed again. Nothing was merged. The currently displayed Source Revision remains unchanged while you review this new conflict."
    : SOURCE_CONFLICT_COPY_V16.entry;
  const displayedSnapshot = model.displayed === "r2" ? "R2" : model.displayed === "c2" ? "C2" : "C1";
  return `
    <main id="prototype-main" class="source-conflict-workbench-v16" aria-labelledby="source-conflict-title-v16">
      <header class="source-conflict-page-header-v16">
        <div><p class="eyebrow">Source Item conflict</p><h1 id="source-conflict-title-v16" tabindex="-1">Review source update</h1><p>${html(entryCopy)}</p><p>${html(SOURCE_CONFLICT_COPY_V16.retained)}</p></div>
        <div class="source-conflict-cancel-v16"><button type="button" class="secondary-button" data-action="cancel-source-conflict">Cancel</button><p>${html(SOURCE_CONFLICT_COPY_V16.cancel)}</p></div>
      </header>
      ${renderSourceConflictFactsV16()}
      <section class="source-conflict-compare-v16" aria-labelledby="source-conflict-compare-title-v16">
        <div class="source-conflict-compare-heading-v16"><h2 id="source-conflict-compare-title-v16" tabindex="-1">Compare complete text</h2><div class="source-conflict-view-controls-v16" role="group" aria-label="Comparison view"><button type="button" data-action="set-source-conflict-view" data-conflict-view="complete" aria-pressed="${model.compareMode === "complete"}">Complete text</button><button type="button" data-action="set-source-conflict-view" data-conflict-view="changes" aria-pressed="${model.compareMode === "changes"}">Changes only</button></div></div>
        ${model.compareMode === "complete" ? renderSourceConflictCompleteV16() : renderSourceConflictChangesV16()}
      </section>
      ${model.newestRevision === "r2" ? renderSourceConflictOutcomeCardsV16() : `<aside class="source-conflict-new-generation-v16"><strong>Latest source update represented</strong><p>This complete ${displayedSnapshot}/R3 snapshot is a new conflict generation. The earlier Voice R2 action cannot fire.</p></aside>`}
      ${renderSourceConflictBoundaryV16()}
    </main>`;
}

function renderSourceConflictWorkspaceV16() {
  const model = state.sourceConflict;
  const validation = sourceConflictValidationV16(model.draft);
  const contentValid = validation.valid;
  const connectionInterrupted = model.branch === "workspace-connection";
  const saveAvailable = contentValid && model.newestRevision === "r2" && !model.operation && !connectionInterrupted;
  const describedBy = `source-conflict-editor-help-v16 source-conflict-validation-v16${connectionInterrupted ? " source-conflict-connection-status-v16" : ""}`;
  return `
    <main id="prototype-main" class="source-conflict-workbench-v16 source-conflict-workspace-v16" aria-labelledby="source-conflict-workspace-title-v16">
      <header><p class="eyebrow">Manual outcome · no automatic merge</p><h1 id="source-conflict-workspace-title-v16" tabindex="-1">Create a new Correction based on both</h1><p>${html(SOURCE_CONFLICT_COPY_V16.manualIntro)}</p></header>
      ${renderSourceConflictFactsV16()}
      <section aria-labelledby="source-conflict-reference-title-v16"><h2 id="source-conflict-reference-title-v16">Complete read-only references</h2><div class="source-conflict-complete-v16">${renderSourceConflictArticleV16("correction", SOURCE_CONFLICT_TEXT_V16.c1)}${renderSourceConflictArticleV16("revision", VOICE_R2_TEXT_V16)}</div></section>
      <section class="source-conflict-editor-v16" aria-labelledby="source-conflict-editor-title-v16">
        <h2 id="source-conflict-editor-title-v16">New displayed Correction</h2>
        <label for="source-conflict-draft-v16">New displayed Correction</label>
        <textarea id="source-conflict-draft-v16" rows="10" data-action="source-conflict-draft" aria-describedby="${describedBy}" aria-invalid="${!contentValid}">${html(model.draft)}</textarea>
        <p id="source-conflict-editor-help-v16">${html(SOURCE_CONFLICT_COPY_V16.manualHelper)}</p>
        <p id="source-conflict-validation-v16" class="source-conflict-validation-v16" data-kind="${html(validation.kind)}">${html(validation.message)}</p>
        ${connectionInterrupted ? `<p id="source-conflict-connection-status-v16" class="source-conflict-operation-card-v16 is-error">${html(SOURCE_CONFLICT_COPY_V16.workspaceConnection)}</p>` : ""}
        <div class="source-conflict-workspace-actions-v16"><button type="button" class="secondary-button" data-action="cancel-source-conflict-workspace">Cancel new Correction</button><button type="button" class="primary-button" data-action="save-source-conflict-correction" ${saveAvailable ? "" : "disabled"}>Save new Correction</button></div>
      </section>
      ${renderSourceConflictBoundaryV16()}
    </main>`;
}

function renderSourceConflictOperationalV16() {
  const model = state.sourceConflict;
  const states = {
    "review-loading": ["Loading source update", SOURCE_CONFLICT_COPY_V16.loading, "source-conflict-loading-title-v16"],
    "review-load-failed": ["Source update could not be loaded", SOURCE_CONFLICT_COPY_V16.loadFailure, "source-conflict-load-failure-title-v16"],
    "resolution-pending": ["Resolving source update", "One guarded intent is pending. All outcomes and navigation remain locked.", "source-conflict-pending-title-v16"],
    "resolution-failed-known-zero": ["Conflict not resolved", model.failureCopy || SOURCE_CONFLICT_COPY_V16.knownZero, "source-conflict-failure-title-v16"],
    "resolution-unknown": ["Resolution result unknown", SOURCE_CONFLICT_COPY_V16.unknown, "source-conflict-unknown-title-v16"],
    reconciling: ["Checking resolution status", "The original intent is being checked read-only. No second intent was created.", "source-conflict-reconciling-title-v16"],
    "stale-r3": ["Source update review is stale", SOURCE_CONFLICT_COPY_V16.stale, "source-conflict-stale-title-v16"],
  };
  const [title, copy, id] = states[model.stage] || states["review-loading"];
  const action = model.stage === "review-load-failed" ? `<button type="button" class="primary-button" data-action="retry-source-conflict-load">Retry loading</button>`
    : model.stage === "resolution-failed-known-zero" ? `<button type="button" class="primary-button" data-action="retry-source-conflict-resolution">Retry resolution</button>`
      : model.stage === "resolution-unknown" ? `<button type="button" class="primary-button" data-action="check-source-conflict-status">Check resolution status</button>`
        : model.stage === "stale-r3" ? `<button type="button" class="primary-button" data-action="review-latest-source-conflict">Review latest source update</button>`
          : "";
  return `
    <main id="prototype-main" class="source-conflict-state-page-v16" aria-labelledby="${id}" ${["review-loading", "resolution-pending", "reconciling"].includes(model.stage) ? 'aria-busy="true"' : ""}>
      <section class="source-conflict-operation-card-v16 ${["review-load-failed", "resolution-failed-known-zero", "stale-r3"].includes(model.stage) ? "is-error" : ""}">
        <p class="eyebrow">Source Item conflict</p><h1 id="${id}" tabindex="-1">${html(title)}</h1><p>${html(copy)}</p>${action}
        <dl><div><dt>Source Revisions</dt><dd>${model.revisions}</dd></div><div><dt>Corrections</dt><dd>${model.corrections}</dd></div><div><dt>Resolution events</dt><dd>${model.events}</dd></div><div><dt>Displayed</dt><dd>${sourceConflictDisplayedLabelV16(model)}</dd></div></dl>
        <p>${html(SOURCE_CONFLICT_COPY_V16.retained)}</p>
      </section>
      ${renderSourceConflictBoundaryV16()}
    </main>`;
}

function renderSourceConflictSessionGateV16() {
  return `
    <main id="prototype-main" class="session-gate-v10 source-conflict-session-gate-v16" tabindex="-1">
      <section class="session-gate-panel-v10" role="dialog" aria-modal="true" aria-labelledby="source-conflict-session-title-v16" aria-describedby="source-conflict-session-copy-v16" tabindex="-1" data-session-gate-v10 data-source-conflict-session-gate-v16>
        <h1 id="source-conflict-session-title-v16" tabindex="-1">Session ended</h1>
        <p id="source-conflict-session-copy-v16">${html(SOURCE_CONFLICT_COPY_V16.session)}</p>
        <button type="button" class="primary-button" data-action="resume-source-conflict-session">Sign in again</button>
      </section>
    </main>`;
}

function renderSourceConflictViewV16() {
  const stage = state.sourceConflict.stage;
  if (stage === "session-ended") return renderSourceConflictSessionGateV16();
  if (["review-ready", "preview-keep", "preview-display-newest", "preview-based-on-both"].includes(stage)) return renderSourceConflictReadyV16();
  if (["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(stage)) return renderSourceConflictWorkspaceV16();
  return renderSourceConflictOperationalV16();
}

function renderSourceConflictPreviewV16() {
  const outcome = state.sourceConflict.outcome;
  const item = SOURCE_CONFLICT_OUTCOMES_V16[outcome];
  if (!item) return "";
  const after = outcome === "keep" ? "Correction 1 remains displayed; Voice R2 is reviewed."
    : outcome === "display-newest" ? "Voice R2 becomes displayed; Correction 1 becomes Historical."
      : "A manual workspace opens; the conflict remains unresolved until C2 is saved.";
  return `
    <div class="modal-backdrop source-conflict-preview-backdrop-v16" data-action="source-conflict-preview-backdrop">
      <section class="modal-card source-conflict-preview-v16" role="dialog" aria-modal="true" aria-labelledby="source-conflict-preview-title-v16" aria-describedby="source-conflict-preview-copy-v16" tabindex="-1" data-modal-card>
        <h2 id="source-conflict-preview-title-v16" tabindex="-1">${html(item.label)}</h2>
        <dl class="source-conflict-preview-affected-v16"><div><dt>Affected Source Item</dt><dd>${html(SOURCE_CONFLICT_ITEM_V16.title)}</dd></div><div><dt>Journal Date</dt><dd>${html(SOURCE_CONFLICT_ITEM_V16.journalDate)}</dd></div></dl>
        <p id="source-conflict-preview-copy-v16">${html(item.preview)}</p>
        <dl><div><dt>Currently displayed</dt><dd>Correction 1</dd></div><div><dt>After this choice</dt><dd>${html(after)}</dd></div><div><dt>Retained facts</dt><dd>Voice R1, Voice R2, and Correction 1 remain retained.</dd></div></dl>
        <footer class="modal-actions source-conflict-preview-actions-v16"><button type="button" class="secondary-button" data-action="close-source-conflict-preview">Back to choices</button><button type="button" class="primary-button" data-action="confirm-source-conflict-outcome">${html(item.label)}</button></footer>
      </section>
    </div>`;
}

function renderSourceConflictLeaveV16() {
  return `
    <div class="modal-backdrop source-conflict-leave-backdrop-v16">
      <section class="modal-card source-conflict-leave-v16" role="alertdialog" aria-modal="true" aria-labelledby="source-conflict-leave-title-v16" aria-describedby="source-conflict-leave-copy-v16" tabindex="-1" data-modal-card>
        <h2 id="source-conflict-leave-title-v16" tabindex="-1">Leave with an unsaved Correction?</h2><p id="source-conflict-leave-copy-v16">This Correction is kept only in this open page. Leaving or reloading will discard it.</p>
        <footer class="modal-actions"><button type="button" class="primary-button" data-action="keep-source-conflict-editing">Keep editing</button><button type="button" class="secondary-button" data-action="discard-source-conflict-and-leave">Discard Correction and leave</button></footer>
      </section>
    </div>`;
}

function sourceConflictReadyReviewV16(generation = 0) {
  return {
    ...initialSourceConflictV16(generation),
    active: true,
    stage: "review-ready",
    returnContext: Object.freeze({
      view: "calendar",
      selectedDate: SOURCE_CONFLICT_ITEM_V16.date,
      screen: "day",
      month: "2026-08",
      focusSelector: '[data-action="review-source-conflict"]',
      scrollY: 0,
    }),
  };
}

function sourceConflictHistoryCardStateV16(model) {
  return {
    ...model,
    stage: model.eligibility === "no-current-correction" ? "source-card-ineligible" : "source-card-conflict",
    compareMode: "complete",
    expandedUnchanged: false,
    compactDocument: "c1",
    outcome: null,
    previewInvoker: null,
    draft: "",
    draftSelection: null,
    draftScrollTop: 0,
    editorIncarnation: null,
    validation: "empty",
    validationAttempted: false,
    dirty: false,
    expectedSnapshot: null,
    operation: null,
    operationPhase: model.terminal ? "settled" : "idle",
    intent: null,
    failureCopy: "",
  };
}

function sourceConflictReviewModelIsCompleteV16(model) {
  if (!model?.active
    || model.eligibility !== "conflict"
    || !["r2", "r3"].includes(model.newestRevision)
    || !["c1", "r2", "c2"].includes(model.displayed)
    || !Array.isArray(model.revisionRecords)
    || model.revisionRecords.length !== model.revisions
    || model.revisionRecords[0]?.id !== "Voice R1"
    || model.revisionRecords[1]?.id !== "Voice R2"
    || (model.newestRevision === "r3" && model.revisionRecords[2]?.id !== "Voice R3")
    || !Array.isArray(model.correctionRecords)
    || model.correctionRecords.length !== model.corrections
    || model.correctionRecords[0]?.id !== "C-VOICE-1"
    || !Array.isArray(model.resolutionEvents)
    || model.resolutionEvents.length !== model.events) return false;
  if (!model.terminal) return model.events === 0 && model.corrections === 1 && model.displayed === "c1";
  return model.newestRevision === "r3"
    && model.events === 1
    && model.resolutionEvents[0]?.outcome === model.terminal.outcome
    && model.corrections === (model.terminal.outcome === "based-on-both" ? 2 : 1)
    && (model.terminal.outcome !== "based-on-both" || model.correctionRecords[1]?.id === "C-VOICE-2");
}

function sourceConflictHistoryReviewStateV16(model) {
  if (!sourceConflictReviewModelIsCompleteV16(model)) return sourceConflictHistoryCardStateV16(model);
  return {
    ...sourceConflictHistoryCardStateV16(model),
    stage: "review-ready",
    operationPhase: "idle",
  };
}

function initializeSourceConflictColdRouteV16() {
  if (initialView !== "source-conflict") return false;
  dispatchShell("FIXTURE_SET", { fixture: "shell/ready" });
  if (state.sourceConflict.active && !sourceConflictReviewModelIsCompleteV16(state.sourceConflict)) {
    state.sourceConflict = sourceConflictHistoryCardStateV16(state.sourceConflict);
    resetShellViewV10({ populated: true });
    state.view = "calendar";
    state.selectedDate = null;
    state.screen = "month";
    state.modal = null;
    state.focusAfterRender = "#prototype-main";
    return false;
  }
  resetShellViewV10({ populated: true, selectedDate: SOURCE_CONFLICT_ITEM_V16.date, screen: "day" });
  const ready = sourceConflictReadyReviewV16(state.sourceConflict.generation + 1);
  if (!sourceConflictReviewModelIsCompleteV16(ready)) return false;
  state.sourceConflict = ready;
  state.view = "source-conflict";
  state.selectedDate = null;
  state.screen = "month";
  state.modal = null;
  state.focusAfterRender = "#source-conflict-title-v16";
  return true;
}

function prepareSourceConflictFixtureV16({ focus = true, allowSessionResume = false } = {}) {
  if (deferSourceConflictReboundActionV16("fixture-prepare", () => prepareSourceConflictFixtureV16({ focus, allowSessionResume }))) return state.sourceConflict;
  if (state.sourceConflict.stage === "session-ended" && !allowSessionResume) return state.sourceConflict;
  clearSourceConflictTimersV16();
  clearSourceConflictReplayLedgerV16();
  clearSourceConflictAnnouncementV16();
  sourceConflictSessionResumeV16 = null;
  cancelShellOperations();
  clearShellBoundaryTransientsV10();
  dispatchShell("FIXTURE_SET", { fixture: "shell/ready" });
  const fixture = state.sourceConflict.fixture;
  const branch = state.sourceConflict.branch;
  resetShellViewV10({ populated: true, selectedDate: SOURCE_CONFLICT_ITEM_V16.date, screen: "day" });
  state.sourceConflict = initialSourceConflictV16(state.sourceConflict.generation + 1);
  state.sourceConflict.fixture = fixture;
  state.sourceConflict.branch = branch;
  if (fixture === "no-current-correction") state.sourceConflict = sourceConflictWithoutCurrentCorrectionV16(state.sourceConflict);
  state.sourceConflict.active = true;
  state.sourceConflict.stage = fixture === "no-current-correction" ? "source-card-ineligible" : "source-card-conflict";
  pendingSourceConflictNavigationV16 = null;
  state.focusAfterRender = focus ? (fixture === "no-current-correction" ? "#source-conflict-no-correction-v16" : '[data-action="review-source-conflict"]') : null;
  syncUrl({
    push: false,
    sourceConflictReturnTarget: { view: state.view, date: state.selectedDate, screen: state.screen },
    scrollY: 0,
    focusSelector: state.focusAfterRender,
    focusTop: null,
  });
  render();
  return state.sourceConflict;
}

function resetSourceConflictFixtureV16() {
  if (deferSourceConflictReboundActionV16("fixture-reset", resetSourceConflictFixtureV16)) return;
  if (state.sourceConflict.stage === "session-ended") return;
  clearSourceConflictTimersV16();
  clearSourceConflictReplayLedgerV16();
  sourceConflictSessionResumeV16 = null;
  sourceConflictWinnerByGenerationV16.clear();
  const fixture = state.sourceConflict.fixture;
  const branch = state.sourceConflict.branch;
  state.sourceConflict = initialSourceConflictV16(state.sourceConflict.generation + 1);
  state.sourceConflict.fixture = fixture;
  state.sourceConflict.branch = branch;
  if (fixture === "no-current-correction") state.sourceConflict = sourceConflictWithoutCurrentCorrectionV16(state.sourceConflict);
  state.modal = null;
  pendingSourceConflictNavigationV16 = null;
  if (state.view === "source-conflict") state.view = "calendar";
  state.focusAfterRender = "#source-conflict-fixture-title-v16";
  syncUrl({
    push: false,
    sourceConflictReturnTarget: state.selectedDate
      ? { view: state.view, date: state.selectedDate, screen: state.screen }
      : null,
    scrollY: 0,
    focusSelector: state.focusAfterRender,
    focusTop: null,
  });
  render();
  announceSourceConflictV16("Source conflict fixture reset. No resolution event remains.");
}

function completeSourceConflictLoadV16() {
  if (deferSourceConflictReboundActionV16("load-completion", completeSourceConflictLoadV16)) return;
  if (state.sourceConflict.stage !== "review-loading") return;
  dispatchSourceConflictV16("LOAD_READY");
  state.focusAfterRender = "#source-conflict-title-v16";
  render();
}

function openSourceConflictV16(control) {
  const model = state.sourceConflict;
  if (!model.active || model.eligibility !== "conflict" || (model.terminal && model.newestRevision !== "r3")) return false;
  const returnFocusSelector = selectorForLogicalFocus(control) || '[data-action="review-source-conflict"]';
  state.sourceConflict.returnContext = {
    view: state.view,
    selectedDate: state.selectedDate,
    screen: state.screen,
    month: state.month,
    focusSelector: returnFocusSelector,
    scrollY: window.scrollY,
  };
  saveCurrentHistorySnapshot({ scrollY: window.scrollY, focusSelector: returnFocusSelector, focusTop: control?.getBoundingClientRect?.().top ?? null });
  dispatchSourceConflictV16("LOAD_START");
  state.view = "source-conflict";
  state.screen = "month";
  state.selectedDate = null;
  state.modal = null;
  state.focusAfterRender = "#source-conflict-loading-title-v16";
  syncUrl({ push: true, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
  announceSourceConflictV16(`Loading source update. ${SOURCE_CONFLICT_COPY_V16.loading}`);
  if (model.branch === "load-pending") return true;
  scheduleSourceConflictV16(() => {
    if (state.sourceConflict.stage !== "review-loading") return;
    if (state.sourceConflict.branch === "load-failure-once") {
      dispatchSourceConflictV16("LOAD_FAIL");
      state.focusAfterRender = "#source-conflict-load-failure-title-v16";
      render();
      announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.loadFailure, { assertive: true });
    } else completeSourceConflictLoadV16();
  }, 360);
  return true;
}

function retrySourceConflictLoadV16() {
  if (state.sourceConflict.stage !== "review-load-failed") return;
  state.sourceConflict = { ...state.sourceConflict, branch: "success" };
  dispatchSourceConflictV16("LOAD_START");
  state.focusAfterRender = "#source-conflict-loading-title-v16";
  render();
  announceSourceConflictV16(`Loading source update. ${SOURCE_CONFLICT_COPY_V16.loading}`);
  scheduleSourceConflictV16(completeSourceConflictLoadV16, 420);
}

function returnSourceConflictToCardV16({ terminal = false } = {}) {
  const context = state.sourceConflict.returnContext || {};
  state.view = context.view === "almanac" ? "almanac" : "calendar";
  state.month = context.month || "2026-08";
  state.calendarMonth = "2026-08";
  state.selectedDate = context.selectedDate || SOURCE_CONFLICT_ITEM_V16.date;
  state.focusDate = state.selectedDate;
  state.screen = context.screen || "day";
  state.modal = null;
  const focusSelector = terminal ? "#source-conflict-source-card-title-v16" : context.focusSelector || '[data-action="review-source-conflict"]';
  const scrollY = Number(context.scrollY) || 0;
  state.focusAfterRender = focusSelector;
  syncUrl({
    push: false,
    sourceConflictReturnTarget: { view: state.view, date: state.selectedDate, screen: state.screen },
    scrollY,
    focusSelector,
    focusTop: null,
  });
  render();
  const focusEpoch = sourceConflictFocusEpochV16;
  requestAnimationFrame(() => {
    if (focusEpoch !== sourceConflictFocusEpochV16) return;
    const target = resolveLogicalSelector(focusSelector) || root.querySelector("#journal-day-title-v14");
    target?.focus({ preventScroll: true });
    withInstantScroll(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
  });
}

function cancelSourceConflictV16() {
  if (!['review-ready', 'review-load-failed'].includes(state.sourceConflict.stage)) return;
  dispatchSourceConflictV16("WORKSPACE_CANCEL");
  state.sourceConflict.stage = "source-card-conflict";
  state.sourceConflict.compareMode = "complete";
  state.sourceConflict.expandedUnchanged = false;
  returnSourceConflictToCardV16();
}

function openSourceConflictPreviewV16(outcome, control) {
  if (state.sourceConflict.stage !== "review-ready" || !Object.hasOwn(SOURCE_CONFLICT_OUTCOMES_V16, outcome) || state.sourceConflict.newestRevision !== "r2") return;
  const invoker = `[data-action="preview-source-conflict-outcome"][data-conflict-outcome="${CSS.escape(outcome)}"]`;
  dispatchSourceConflictV16("PREVIEW_OPEN", { outcome, invoker });
  state.modal = { type: "source-conflict-preview-v16", focusSelector: "#source-conflict-preview-title-v16", returnFocusSelector: invoker };
  render();
}

function closeSourceConflictPreviewV16() {
  if (state.modal?.type !== "source-conflict-preview-v16") return;
  const returnFocusSelector = state.modal.returnFocusSelector || state.sourceConflict.previewInvoker;
  dispatchSourceConflictV16("PREVIEW_CLOSE");
  state.modal = null;
  state.focusAfterRender = returnFocusSelector;
  render();
}

function openSourceConflictWorkspaceV16() {
  if (state.sourceConflict.outcome !== "based-on-both") return;
  dispatchSourceConflictV16("WORKSPACE_OPEN", { editorIncarnation: nextSourceConflictEditorIncarnationV16() });
  state.modal = null;
  state.focusAfterRender = "#source-conflict-workspace-title-v16";
  render();
}

function requestSourceConflictWorkspaceLeaveV16(destination = { kind: "review" }) {
  const model = state.sourceConflict;
  if (!model.dirty) {
    dispatchSourceConflictV16("WORKSPACE_CANCEL");
    state.focusAfterRender = '[data-action="preview-source-conflict-outcome"][data-conflict-outcome="based-on-both"]';
    render();
    return;
  }
  pendingSourceConflictNavigationV16 = destination;
  state.modal = { type: "leave-source-conflict-v16", focusSelector: "#source-conflict-leave-title-v16" };
  render();
}

function keepSourceConflictEditingV16() {
  if (state.modal?.type !== "leave-source-conflict-v16") return;
  pendingSourceConflictNavigationV16 = null;
  state.modal = null;
  state.focusAfterRender = "#source-conflict-draft-v16";
  render();
}

function discardSourceConflictAndLeaveV16() {
  if (state.modal?.type !== "leave-source-conflict-v16") return;
  const destination = pendingSourceConflictNavigationV16 || { kind: "review" };
  pendingSourceConflictNavigationV16 = null;
  state.modal = null;
  dispatchSourceConflictV16("WORKSPACE_CANCEL");
  if (destination.kind === "view" && allowedViews.has(destination.view) && destination.view !== "source-conflict") {
    setView(destination.view);
    return;
  }
  if (destination.kind === "settings") {
    openSettings(destination.section || "overview");
    return;
  }
  if (destination.kind === "more") {
    state.modal = {
      type: "more",
      returnFocusSelector: destination.returnFocusSelector || '[data-action="open-more"]',
      focusSelector: destination.focusSelector || "[data-modal-card]",
    };
    render();
    return;
  }
  if (destination.kind === "date-review") {
    openDateReviewV11();
    return;
  }
  if (destination.kind === "upload") {
    openUpload(destination.date || null, destination.returnFocusSelector || '[data-action="open-upload"]');
    return;
  }
  if (destination.kind === "history" && Number.isFinite(destination.delta) && destination.delta !== 0) {
    window.history.go(destination.delta);
    return;
  }
  if (destination.kind === "card") {
    state.sourceConflict.stage = "source-card-conflict";
    returnSourceConflictToCardV16();
    return;
  }
  state.focusAfterRender = '[data-action="preview-source-conflict-outcome"][data-conflict-outcome="based-on-both"]';
  render();
}

function injectSourceConflictR3V16() {
  if (deferSourceConflictReboundActionV16("r3", injectSourceConflictR3V16)) return;
  const model = state.sourceConflict;
  if (!model.active || model.eligibility !== "conflict" || model.stage === "session-ended") return;
  if (model.terminal) {
    state.sourceConflict = { ...model, newestRevision: "r3", revisions: 3, revisionRecords: sourceConflictRevisionRecordsWithR3V16(model), stage: "source-card-conflict", r3Queued: false };
    returnSourceConflictToCardV16({ terminal: true });
    return;
  }
  if (["resolution-unknown", "reconciling"].includes(model.stage)) {
    dispatchSourceConflictV16("R3_QUEUE");
    state.sourceConflict.lastProbe = "R3 queued behind original unknown result";
    render();
    announceSourceConflictV16("A newer revision is waiting. Resolve the original result first.");
    return;
  }
  clearSourceConflictTimersV16();
  dispatchSourceConflictV16("R3_STALE");
  state.modal = null;
  state.focusAfterRender = "#source-conflict-stale-title-v16";
  render();
  announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.stale, { assertive: true });
}

function reviewLatestSourceConflictV16() {
  if (state.sourceConflict.stage !== "stale-r3") return;
  dispatchSourceConflictV16("R3_REVIEW_READY");
  state.focusAfterRender = "#source-conflict-title-v16";
  render();
}

function sourceConflictCallbackEffectSnapshotV16() {
  const model = state.sourceConflict;
  return {
    generation: model.generation,
    stage: model.stage,
    operation: model.operation,
    revisions: model.revisions,
    revisionRecords: model.revisionRecords,
    corrections: model.corrections,
    correctionRecords: model.correctionRecords,
    events: model.events,
    resolutionEvents: model.resolutionEvents,
    displayed: model.displayed,
    terminal: model.terminal,
    announcementEpoch: sourceConflictAnnouncementEpochV16,
    announcementText: sourceConflictStatusLiveV16?.textContent || "",
    announcementMode: sourceConflictStatusLiveV16?.getAttribute("aria-live") || "",
  };
}

function assertSourceConflictCallbackNoEffectV16(before, label) {
  const after = sourceConflictCallbackEffectSnapshotV16();
  const unchanged = Object.keys(before).every((key) => before[key] === after[key]);
  state.sourceConflict.lastProbe = unchanged ? label : "Unexpected callback effect";
  render();
  return unchanged;
}

function neutralSourceConflictReplayEnvelopeV16(envelope) {
  if (!envelope) return null;
  const operation = Object.freeze({
    generation: envelope.generation,
    sequence: envelope.operationSequence,
    incarnation: envelope.operationIncarnation,
  });
  return Object.freeze({
    completeness: SOURCE_CONFLICT_COMPLETENESS_V16.callback,
    kind: "success",
    origin: "effect",
    generation: envelope.generation,
    operation,
    operationSequence: envelope.operationSequence,
    operationIncarnation: envelope.operationIncarnation,
    result: null,
    copy: "",
  });
}

function replaySourceConflictCallbackV16(variant = "success") {
  const acceptedEnvelope = sourceConflictReplayEnvelopeV16;
  if (!state.sourceConflict.terminal || !acceptedEnvelope) {
    state.sourceConflict.lastProbe = "No settled callback available";
    render();
    return false;
  }
  const before = sourceConflictCallbackEffectSnapshotV16();
  const envelope = variant === "failure"
    ? sourceConflictCallbackEnvelopeV16("failure", acceptedEnvelope.operation, { copy: SOURCE_CONFLICT_COPY_V16.knownZero, origin: "effect" })
    : acceptedEnvelope;
  dispatchSourceConflictCallbackV16(envelope);
  return assertSourceConflictCallbackNoEffectV16(before, `${variant === "failure" ? "Late failure" : "Duplicate success"} ignored · terminal unchanged`);
}

function adoptCompetingSourceConflictWinnerV16(model, operation, result) {
  state.sourceConflict = {
    ...model,
    stage: "reconciling",
    outcome: operation.outcome,
    operation,
    expectedSnapshot: operation.snapshot,
    operationPhase: "reconciling",
    intent: operation.intent,
    failureCopy: "",
  };
  return dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", operation, { result, origin: "reconciliation" }), { adopted: true });
}

function sourceConflictCompetingDeliveryIsAuthorizedV16(model, scheduledOperation = null) {
  if (scheduledOperation) {
    const scheduledBranch = scheduledOperation.branch;
    return model.stage === "resolution-pending"
      && model.operationPhase === "pre-acceptance"
      && model.operation === scheduledOperation
      && scheduledOperation.generation === model.generation
      && (scheduledBranch === "two-tab-competing" || Object.hasOwn(SOURCE_CONFLICT_TWO_TAB_BRANCHES_V16, scheduledBranch));
  }
  return model.stage === "review-ready"
    && model.operationPhase === "idle"
    && model.operation === null;
}

function deliverCompetingSourceConflictOutcomeV16(requestedOutcome = "keep", { scheduledOperation = null } = {}) {
  const model = state.sourceConflict;
  if (model.eligibility !== "conflict" || model.terminal || !model.active || model.newestRevision !== "r2") return false;
  if (!sourceConflictCompetingDeliveryIsAuthorizedV16(model, scheduledOperation)) return false;
  clearSourceConflictTimersV16();
  const acceptedWinner = sourceConflictWinnerByGenerationV16.get(model.generation);
  if (acceptedWinner) {
    const acceptedResult = sourceConflictAcceptedResultsV16.get(acceptedWinner);
    if (!acceptedResult) return false;
    return adoptCompetingSourceConflictWinnerV16(model, acceptedWinner, acceptedResult);
  }
  const outcome = Object.hasOwn(SOURCE_CONFLICT_OUTCOMES_V16, requestedOutcome) ? requestedOutcome : "keep";
  const draft = outcome === "based-on-both" ? VOICE_C2_TEXT_V16 : null;
  const snapshot = Object.freeze({ ...sourceConflictSnapshotV16({ ...model, outcome, draft }) });
  const operation = Object.freeze({ sequence: ++sourceConflictOperationSequenceV16, incarnation: 1, generation: model.generation, outcome, snapshot, draft, intent: SOURCE_CONFLICT_INTENTS_V16[outcome], branch: "success", attempts: 1 });
  const result = sourceConflictResultV16(operation);
  sourceConflictAcceptedResultsV16.set(operation, result);
  sourceConflictWinnerByGenerationV16.set(model.generation, operation);
  return adoptCompetingSourceConflictWinnerV16(model, operation, result);
}

function sourceConflictTerminalResumeSnapshotV16(model) {
  const outcome = model?.terminal?.outcome;
  if (!Object.hasOwn(SOURCE_CONFLICT_OUTCOMES_V16, outcome)) return null;
  const terminal = sourceConflictTerminalV16(outcome);
  const displayed = outcome === "keep" ? "c1" : outcome === "display-newest" ? "r2" : "c2";
  const corrections = outcome === "based-on-both" ? 2 : 1;
  const revisions = model.newestRevision === "r3" ? 3 : 2;
  const correctionRecords = model.correctionRecords;
  const revisionRecords = model.revisionRecords;
  const resolutionEvents = model.resolutionEvents;
  const representedC2Text = outcome === "based-on-both" ? model.c2Text : null;
  const c2Record = correctionRecords?.[1] || null;
  const event = resolutionEvents?.[0] || null;
  const terminalIsCanonical = model.terminal.label === terminal.label
    && model.terminal.time === terminal.time
    && model.terminal.copy === terminal.copy;
  const recordsAreComplete = Array.isArray(revisionRecords)
    && revisionRecords.length === revisions
    && revisionRecords[0]?.id === "Voice R1"
    && revisionRecords[1]?.id === "Voice R2"
    && (revisions === 2 || revisionRecords[2]?.id === "Voice R3")
    && Array.isArray(correctionRecords)
    && correctionRecords.length === corrections
    && correctionRecords[0]?.id === "C-VOICE-1"
    && (outcome !== "based-on-both"
      || (typeof representedC2Text === "string"
        && c2Record?.id === "C-VOICE-2"
        && c2Record.text === representedC2Text
        && c2Record.base === "Voice R2"
        && c2Record.lineage === "C-VOICE-1"));
  const eventIsComplete = Array.isArray(resolutionEvents)
    && resolutionEvents.length === 1
    && event?.outcome === outcome
    && event?.represented === terminal.time
    && event?.reviewedRevision === "Voice R2"
    && event?.displayed === displayed;
  if (!model.active
    || model.eligibility !== "conflict"
    || model.events !== 1
    || model.revisions !== revisions
    || model.corrections !== corrections
    || model.displayed !== displayed
    || model.c1Status !== (outcome === "keep" ? "Current" : "Historical")
    || model.r2Reviewed !== true
    || model.operation !== null
    || model.expectedSnapshot !== null
    || model.intent !== null
    || !Number.isInteger(model.displayEpoch)
    || !terminalIsCanonical
    || !recordsAreComplete
    || !eventIsComplete) return null;
  const returnContext = model.returnContext || {};
  return Object.freeze({
    fixture: Object.hasOwn(SOURCE_CONFLICT_FIXTURES_V16, model.fixture) ? model.fixture : "primary",
    branch: Object.hasOwn(SOURCE_CONFLICT_BRANCHES_V16, model.branch) ? model.branch : "success",
    outcome,
    displayed,
    displayEpoch: model.displayEpoch,
    newestRevision: model.newestRevision,
    revisions,
    corrections,
    representedC2Text,
    terminal,
    revisionRecords: Object.freeze([...revisionRecords]),
    correctionRecords: Object.freeze([...correctionRecords]),
    resolutionEvents: Object.freeze([...resolutionEvents]),
    c1Status: model.c1Status,
    r2Reviewed: true,
    latestReviewed: Boolean(model.latestReviewed),
    returnContext: Object.freeze({
      view: returnContext.view === "almanac" ? "almanac" : "calendar",
      selectedDate: SOURCE_CONFLICT_ITEM_V16.date,
      screen: returnContext.screen === "month" ? "month" : "day",
      month: "2026-08",
      focusSelector: '[data-action="review-source-conflict"]',
      scrollY: Number.isFinite(returnContext.scrollY) ? Math.max(0, returnContext.scrollY) : 0,
    }),
  });
}

function restoreSourceConflictTerminalAfterSessionV16(snapshot, generation) {
  if (!snapshot || !Object.hasOwn(SOURCE_CONFLICT_OUTCOMES_V16, snapshot.outcome)) return null;
  const next = initialSourceConflictV16(generation);
  return {
    ...next,
    active: true,
    fixture: snapshot.fixture,
    branch: snapshot.branch,
    eligibility: "conflict",
    stage: snapshot.newestRevision === "r3" ? "source-card-conflict" : "resolution-settled",
    compareMode: "complete",
    expandedUnchanged: false,
    compactDocument: "c1",
    newestRevision: snapshot.newestRevision,
    outcome: null,
    previewInvoker: null,
    draft: "",
    draftSelection: null,
    draftScrollTop: 0,
    editorIncarnation: null,
    validation: "empty",
    validationAttempted: false,
    dirty: false,
    expectedSnapshot: null,
    operation: null,
    operationPhase: "settled",
    intent: null,
    failureCopy: "",
    resultCopy: snapshot.terminal.copy,
    terminal: snapshot.terminal,
    displayed: snapshot.displayed,
    displayEpoch: snapshot.displayEpoch,
    revisions: snapshot.revisions,
    corrections: snapshot.corrections,
    c2Text: snapshot.representedC2Text,
    events: 1,
    revisionRecords: snapshot.revisionRecords,
    correctionRecords: snapshot.correctionRecords,
    resolutionEvents: snapshot.resolutionEvents,
    c1Status: snapshot.c1Status,
    r2Reviewed: snapshot.r2Reviewed,
    r3Queued: false,
    latestReviewed: snapshot.latestReviewed,
    returnContext: snapshot.returnContext,
    lastProbe: "Accepted terminal restored after session · no second event",
  };
}

function sourceConflictHasCompleteNonterminalR3V16(model) {
  return model?.active === true
    && model.eligibility === "conflict"
    && model.terminal === null
    && model.newestRevision === "r3"
    && model.revisions === 3
    && model.corrections === 1
    && model.events === 0
    && model.displayed === "c1"
    && model.operation === null
    && model.expectedSnapshot === null
    && model.intent === null
    && Array.isArray(model.revisionRecords)
    && model.revisionRecords.length === 3
    && model.revisionRecords[0]?.id === "Voice R1"
    && model.revisionRecords[1]?.id === "Voice R2"
    && model.revisionRecords[2]?.id === "Voice R3"
    && Array.isArray(model.correctionRecords)
    && model.correctionRecords.length === 1
    && model.correctionRecords[0]?.id === "C-VOICE-1"
    && Array.isArray(model.resolutionEvents)
    && model.resolutionEvents.length === 0;
}

function expireSourceConflictSessionV16() {
  if (deferSourceConflictReboundActionV16("session", expireSourceConflictSessionV16)) return;
  const model = state.sourceConflict;
  if (!model.active || model.eligibility !== "conflict" || model.stage === "session-ended") return;
  sourceConflictFocusEpochV16 += 1;
  const accepted = model.operation ? sourceConflictAcceptedResultsV16.get(model.operation) : null;
  const terminalSnapshot = sourceConflictTerminalResumeSnapshotV16(model);
  const reconcileOnResume = Boolean(model.operation)
    && ["post-acceptance-unknown", "reconciling"].includes(model.operationPhase);
  sourceConflictSessionResumeV16 = terminalSnapshot
    ? { mode: "terminal", terminal: terminalSnapshot }
    : reconcileOnResume
      ? {
        mode: "reconcile",
        fixture: model.fixture,
        branch: model.branch,
        operation: model.operation,
        accepted: accepted || null,
        resultKind: accepted ? "one" : model.branch === "unknown-zero" ? "zero" : "unknown",
        r3Queued: model.r3Queued,
        revisions: model.revisions,
      }
      : { mode: "u0", fixture: model.fixture, branch: model.branch, newestRevision: sourceConflictHasCompleteNonterminalR3V16(model) ? "r3" : "r2" };
  clearSourceConflictTimersV16();
  clearShellBoundaryTransientsV10();
  dispatchSourceConflictV16("SESSION_EXPIRE");
  state.modal = null;
  state.view = "source-conflict";
  state.focusAfterRender = "#source-conflict-session-title-v16";
  render();
  announceSourceConflictV16("Session ended. Unsaved Correction text was not retained.", { assertive: true });
}

function resumeSourceConflictSessionV16() {
  const resume = sourceConflictSessionResumeV16 || { mode: "u0", fixture: state.sourceConflict.fixture, branch: state.sourceConflict.branch };
  sourceConflictSessionResumeV16 = null;
  if (resume.mode === "terminal") {
    const restored = restoreSourceConflictTerminalAfterSessionV16(resume.terminal, state.sourceConflict.generation + 1);
    if (restored) {
      state.sourceConflict = restored;
      state.modal = null;
      returnSourceConflictToCardV16({ terminal: true });
      announceSourceConflictV16("Returned to Life in Days. The accepted source update remains represented.");
      return;
    }
  }
  if (resume.mode !== "reconcile") {
    state.sourceConflict = initialSourceConflictV16(state.sourceConflict.generation + 1);
    state.sourceConflict.fixture = resume.fixture;
    state.sourceConflict.branch = resume.branch;
    state.view = "calendar";
    prepareSourceConflictFixtureV16({ focus: false, allowSessionResume: true });
    if (resume.newestRevision === "r3") {
      const model = state.sourceConflict;
      state.sourceConflict = {
        ...model,
        newestRevision: "r3",
        revisions: 3,
        revisionRecords: sourceConflictRevisionRecordsWithR3V16(model),
        stage: "source-card-conflict",
      };
    }
    state.focusAfterRender = '[data-action="review-source-conflict"]';
    render();
    announceSourceConflictV16("Returned to Life in Days. The source update remains unresolved.");
    return;
  }
  const next = initialSourceConflictV16(resume.operation.generation);
  next.fixture = resume.fixture;
  next.branch = resume.branch;
  next.active = true;
  next.stage = "reconciling";
  next.outcome = resume.operation.outcome;
  next.operation = resume.operation;
  next.expectedSnapshot = resume.operation.snapshot;
  next.operationPhase = "reconciling";
  next.intent = resume.operation.intent;
  next.r3Queued = resume.r3Queued;
  next.revisions = resume.revisions;
  if (resume.revisions === 3) next.revisionRecords = sourceConflictRevisionRecordsWithR3V16(next);
  state.sourceConflict = next;
  if (resume.accepted) sourceConflictAcceptedResultsV16.set(resume.operation, resume.accepted);
  state.view = "source-conflict";
  state.modal = null;
  state.focusAfterRender = "#source-conflict-reconciling-title-v16";
  syncUrl({ push: false, scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  render();
  announceSourceConflictV16("Checking resolution status");
  scheduleSourceConflictV16(() => {
    if (state.sourceConflict.operation !== resume.operation || state.sourceConflict.stage !== "reconciling") return;
    if (resume.resultKind === "one" && resume.accepted) {
      dispatchSourceConflictCallbackV16(sourceConflictCallbackEnvelopeV16("success", resume.operation, { result: resume.accepted, origin: "reconciliation" }), { adopted: true });
      return;
    }
    if (resume.resultKind === "unknown") {
      dispatchSourceConflictV16("RESOLUTION_UNKNOWN");
      state.focusAfterRender = "#source-conflict-unknown-title-v16";
      render();
      announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.unknown, { assertive: true });
      return;
    }
    const fixture = resume.fixture;
    const branch = resume.branch;
    state.sourceConflict = initialSourceConflictV16(state.sourceConflict.generation + 1);
    state.sourceConflict.fixture = fixture;
    state.sourceConflict.branch = branch;
    prepareSourceConflictFixtureV16({ focus: false });
    if (resume.r3Queued) {
      const model = state.sourceConflict;
      state.sourceConflict = {
        ...model,
        newestRevision: "r3",
        revisions: 3,
        revisionRecords: sourceConflictRevisionRecordsWithR3V16(model),
        stage: "source-card-conflict",
      };
    }
    state.focusAfterRender = '[data-action="review-source-conflict"]';
    render();
    announceSourceConflictV16("No resolution was found. The source update remains unresolved.");
  }, 620);
}

function renderSourceConflictFixtureConsoleV16() {
  const model = state.sourceConflict;
  if (model.stage === "session-ended") {
    return `
      <section class="source-conflict-fixture-group-v16" aria-labelledby="source-conflict-fixture-title-v16">
        <h3 id="source-conflict-fixture-title-v16" tabindex="-1">Source/Correction conflict · synthetic states</h3>
        <p>Session ended. Conflict fixtures, branches, outcomes, represented records, and operation status are unavailable on this generic route.</p>
        <p class="prototype-data-label-v9">Current source-update state · session-ended</p>
        <p class="source-conflict-console-boundary-v16">No authentication, persistence, provider request, or production session behavior is represented.</p>
      </section>`;
  }
  const conflictEligible = model.eligibility === "conflict";
  const fixtureButtons = Object.entries(SOURCE_CONFLICT_FIXTURES_V16).map(([fixture, label]) => `<button type="button" class="text-button" data-action="set-source-conflict-fixture" data-conflict-fixture="${fixture}" aria-pressed="${model.fixture === fixture}">${html(label)}</button>`).join("");
  const branchButtons = Object.entries(SOURCE_CONFLICT_BRANCHES_V16).map(([branch, label]) => `<button type="button" class="text-button" data-action="set-source-conflict-branch" data-conflict-branch="${branch}" aria-pressed="${model.branch === branch}">${html(label)}</button>`).join("");
  const competingDeliveryAvailable = model.active
    && conflictEligible
    && !model.terminal
    && sourceConflictCompetingDeliveryIsAuthorizedV16(model);
  const competingDeliveryDisabled = competingDeliveryAvailable ? "" : 'disabled aria-disabled="true"';
  return `
    <section class="source-conflict-fixture-group-v16" aria-labelledby="source-conflict-fixture-title-v16">
      <h3 id="source-conflict-fixture-title-v16" tabindex="-1">Source/Correction conflict · synthetic states</h3>
      <p>Deterministic in-tab fixtures only. Source text, drafts, choices, conflict identity, and operation identity never enter URL, history payload, storage, logs, or live announcements.</p>
      <p class="prototype-data-label-v9">Current source-update state · ${html(model.stage)} · ${html(SOURCE_CONFLICT_FIXTURES_V16[model.fixture])} · ${html(SOURCE_CONFLICT_BRANCHES_V16[model.branch])}</p>
      <p class="prototype-data-label-v9">Cardinality · ${model.revisions} revisions · ${model.corrections} Correction${model.corrections === 1 ? "" : "s"} · ${model.events} event${model.events === 1 ? "" : "s"} · displayed ${sourceConflictDisplayedLabelV16(model)}</p>
      <p class="prototype-data-label-v9">Guard probe · ${html(model.lastProbe)}</p>
      <fieldset><legend>Fixture</legend><div class="source-conflict-fixture-controls-v16">${fixtureButtons}</div></fieldset>
      <fieldset><legend>Operation branch</legend><div class="source-conflict-fixture-controls-v16">${branchButtons}</div></fieldset>
      <div class="source-conflict-fixture-controls-v16">
        <button type="button" class="secondary-button" data-action="open-source-conflict-fixture">${conflictEligible ? "Prepare conflict on 2 August" : "Prepare no-Correction handoff on 2 August"}</button>
        <button type="button" class="secondary-button" data-action="settle-source-conflict-load" ${model.stage === "review-loading" ? "" : "disabled"}>Settle pending load</button>
        <button type="button" class="secondary-button" data-action="inject-source-conflict-r3" ${model.active && conflictEligible ? "" : "disabled"}>Inject Voice R3</button>
        <button type="button" class="secondary-button" data-action="deliver-competing-source-conflict-outcome" data-conflict-outcome="keep" ${competingDeliveryDisabled}>Simulate other tab · Keep wins</button>
        <button type="button" class="secondary-button" data-action="deliver-competing-source-conflict-outcome" data-conflict-outcome="display-newest" ${competingDeliveryDisabled}>Simulate other tab · Display newest wins</button>
        <button type="button" class="secondary-button" data-action="deliver-competing-source-conflict-outcome" data-conflict-outcome="based-on-both" ${competingDeliveryDisabled}>Simulate other tab · Based on both wins</button>
        <button type="button" class="text-button" data-action="replay-source-conflict-callback" ${model.terminal ? "" : "disabled"}>Replay success callback</button>
        <button type="button" class="text-button" data-action="fail-after-source-conflict-success" ${model.terminal ? "" : "disabled"}>Deliver failure after success</button>
        <button type="button" class="text-button" data-action="callback-after-source-conflict-reset">Probe callback after reset</button>
        <button type="button" class="text-button" data-action="expire-source-conflict-session" ${model.active && conflictEligible ? "" : "disabled"}>End conflict session</button>
        <button type="button" class="text-button" data-action="reset-source-conflict-fixture">Reset conflict fixture</button>
      </div>
      <p class="source-conflict-console-boundary-v16">${conflictEligible ? "Three deliberate outcomes only. No automatic merge or fourth choice." : "No conflict outcomes are available without a current Correction."} No persistence, provider request, full History, or production behavior is represented.</p>
    </section>`;
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
        ${renderCaptureFixtureConsoleV13()}
        ${renderUploadFixtureConsoleV14()}
        ${renderCorrectionFixtureConsoleV15()}
        ${renderSourceConflictFixtureConsoleV16()}
      </div>
    </details>`;
}

function renderSessionGateV10() {
  const reauth = state.shell.phase === "reauth";
  const title = reauth ? "Reauthentication represented" : "Session ended";
  const delayedCallbackFixture = !reauth || expiredSessionCallbackProbeV15 == null
    ? ""
    : `<p id="expired-session-callback-probe-v15" class="prototype-data-label-v9" tabindex="-1">${expiredSessionCallbackProbeV15 === "ignored" ? "Fixture complete · session state unchanged" : "Unexpected state change"}</p>`;
  return `
    <main id="prototype-main" class="session-gate-v10" tabindex="-1">
      <section class="session-gate-panel-v10" role="dialog" aria-modal="true" aria-labelledby="session-gate-title-v10" aria-describedby="session-gate-copy-v10" tabindex="-1" data-session-gate-v10>
        <p class="eyebrow">Private archive</p>
        <h1 id="session-gate-title-v10" tabindex="-1">${title}</h1>
        ${reauth
          ? '<p id="session-gate-copy-v10">The production service would return through Cloudflare Access. This prototype has not verified an account, MFA, assertion, or session.</p>'
          : '<p id="session-gate-copy-v10">Sign in again to return to Life in Days. Unsaved Correction text was not retained.</p>'}
        <p class="reauth-boundary-v10">Prototype state · No authentication occurs here.</p>
        ${delayedCallbackFixture}
        <button type="button" class="primary-button" data-action="${reauth ? "return-from-shell-reauth" : "start-shell-reauth"}">${reauth ? "Return to Life in Days" : "Reauthenticate"}</button>
      </section>
    </main>`;
}

function renderUnifiedApp() {
  if (["session-expired", "reauth"].includes(state.shell.phase)) {
    return `<div class="prototype-app unified-v9 unified-v10 unified-v11 unified-v15 is-session-gated">${prototypeBanner()}${renderSessionGateV10()}</div>`;
  }
  if (state.sourceConflict.stage === "session-ended") {
    return `<div class="prototype-app unified-v9 unified-v10 unified-v11 unified-v14 unified-v15 unified-v16 is-session-gated source-conflict-session-only-v16">${renderSourceConflictSessionGateV16()}</div>`;
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
            ? renderCaptureCompanionV13()
            : state.view === "source-conflict"
              ? renderSourceConflictViewV16()
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
    <div class="prototype-app unified-v9 unified-v10 unified-v11 unified-v14 unified-v15 unified-v16 view-${state.view}">
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
  const domDate = uploadDayDomTokenV14(day.date);
  const currentIndex = Math.min(state.galleryIndex[day.date] || 0, Math.max(day.photos.length - 1, 0));
  const currentPhoto = day.photos[currentIndex];
  const currentPhotoUnavailable = mediaUnavailable(currentPhoto);
  const currentPhotoPending = mediaStateForPhoto(currentPhoto)?.status === "pending";
  const canRetryCurrentPhoto = state.shell.connection === "connected";
  const artwork = activeArtwork(day);

  return `
    <section class="day-section gallery-section" aria-labelledby="gallery-title-${domDate}">
      <div class="section-heading">
        <div><p class="eyebrow">Authentic media</p><h2 id="gallery-title-${domDate}" tabindex="-1">Daily Photos</h2></div>
        <p class="source-boundary">Real photos never go to AI · <button type="button" data-action="open-settings" data-section="ai" aria-label="Review what Life in Days sends to AI providers">AI & privacy</button></p>
      </div>
      ${currentPhoto && !currentPhotoUnavailable ? `
        <div class="gallery-stage">
          <button type="button" class="gallery-image-button" data-action="open-photo" data-date="${domDate}" data-photo-id="${currentPhoto.id}" aria-label="View original: ${html(currentPhoto.alt)}">
            <img src="${html(currentPhoto.src)}" alt="${html(currentPhoto.alt)}" />
            ${currentPhoto.isCover ? '<span class="badge badge-cover">Calendar cover</span>' : ""}
            <span class="view-original">View original ↗</span>
          </button>
          <div class="gallery-caption">
            <span class="badge badge-source">${html(currentPhoto.sourceLabel || "Telegram photo")}</span>
            <strong>${html(currentPhoto.caption)}</strong>
            <span>Original Timestamp · ${html(currentPhoto.timestamp)}</span>
            ${currentPhoto.sameMediaDate ? `<div class="same-media-provenance-v14"><strong>Same media as another day</strong><div class="telegram-action-pair"><button type="button" class="text-button" data-action="view-related-media-day" data-related-date="${html(uploadDayDomTokenV14(currentPhoto.sameMediaDate))}">View ${html(captureLongDateV13(currentPhoto.sameMediaDate))}</button><span class="telegram-private-link">Private link · authentication required</span></div></div>` : currentPhoto.sharedMedia ? `<div class="same-media-provenance-v14"><strong>Same media as another photo on this day</strong></div>` : ""}
          </div>
        </div>
        <div class="gallery-thumbnails" aria-label="Daily Photos">
          ${day.photos.map((photo, index) => `
            <button type="button" class="gallery-thumbnail ${index === currentIndex ? "is-active" : ""}" data-action="select-photo" data-date="${domDate}" data-index="${index}" aria-label="Show Daily Photo ${index + 1} of ${day.photos.length}" ${index === currentIndex ? 'aria-current="true"' : ""}>
              <img src="${html(photo.src)}" alt="" />
              <span>${index + 1}</span>
            </button>`).join("")}
        </div>
        <div class="media-actions" data-prevent-variant-keys>
          <button type="button" class="text-button" data-action="move-photo" data-date="${domDate}" data-photo-id="${currentPhoto.id}" data-direction="-1">Move earlier</button>
          <button type="button" class="text-button" data-action="move-photo" data-date="${domDate}" data-photo-id="${currentPhoto.id}" data-direction="1">Move later</button>
          ${currentPhoto.isCover ? '<span class="quiet-label">Selected cover</span>' : `<button type="button" class="text-button" data-action="make-cover" data-date="${domDate}" data-photo-id="${currentPhoto.id}">Make calendar cover</button>`}
          <button type="button" class="text-button" data-action="change-date" data-date="${domDate}">Change Journal Date</button>
          <button type="button" class="text-button" data-action="download-placeholder">Download original</button>
          <button type="button" class="text-button is-danger" data-action="trash-placeholder">Move to Trash</button>
        </div>
        <details class="provenance-details">
          <summary>Photo provenance</summary>
          <dl><div><dt>Source</dt><dd>${html(currentPhoto.sourceLabel || "Telegram photo")}</dd></div><div><dt>Original Timestamp</dt><dd>${html(currentPhoto.timestamp)}</dd></div><div><dt>Journal Date</dt><dd>${shortDate(day.date)} · Asia/Kolkata</dd></div>${currentPhoto.sameMediaDate ? `<div><dt>Duplicate provenance</dt><dd>Same media as another day · ${html(captureLongDateV13(currentPhoto.sameMediaDate))}</dd></div>` : currentPhoto.sharedMedia ? `<div><dt>Duplicate provenance</dt><dd>Same media as another photo on this day</dd></div>` : ""}<div><dt>AI boundary</dt><dd>Photo bytes, metadata, identifiers, and derived descriptions never leave for AI.</dd></div></dl>
        </details>` : currentPhotoUnavailable ? `
          <div class="gallery-empty gallery-failed media-state-v10">
            <span aria-hidden="true">${dateParts(day.date).day}</span>
            <h3>Image unavailable</h3>
            <p>This image could not be loaded. The photo record and authentic journals remain available; this prototype does not verify the Original.</p>
            <p class="quiet-label">Photo ${currentIndex + 1} of ${day.photos.length} · identity and order unchanged</p>
            ${canRetryCurrentPhoto ? `<button type="button" class="secondary-button" data-action="retry-shell-image" data-date="${domDate}" data-photo-id="${html(currentPhoto.id)}" ${currentPhotoPending ? 'aria-label="Retrying image" aria-disabled="true"' : ""}>${currentPhotoPending ? "Retrying image…" : "Retry image"}</button>` : '<small>Restore the connection before retrying this image.</small>'}
          </div>` : day.imageFailed ? `
          <div class="gallery-empty gallery-failed"><span aria-hidden="true">↻</span><h3>Image unavailable</h3><p>The Journal Day remains readable. This simulated media failure does not hide its date or journals.</p><button type="button" class="secondary-button" data-action="retry-image">Retry</button></div>` : `
          <div class="gallery-empty"><span aria-hidden="true">◇</span><h3>No Daily Photos</h3><p>Send a photo through the private Telegram bot to add it. Web photo upload is not part of MVP.</p></div>`}

      <div class="derived-artwork-block">
        <div class="section-heading compact-heading">
          <div><p class="eyebrow">Derived media</p><h3 id="artwork-title-${domDate}" tabindex="-1">Generated artwork</h3></div>
          ${artwork ? '<span class="badge badge-ai">AI artwork</span>' : '<span class="quiet-label">No artwork yet</span>'}
        </div>
        ${artwork ? `
          <div class="artwork-row">
            <img src="${html(artwork.src)}" alt="${html(artwork.alt)}" />
            <div>
              <div class="status-row"><span class="status-chip">Active version</span>${artwork.stale ? '<span class="status-chip status-attention">Based on an earlier journal version</span>' : ""}</div>
              <p>${html(artwork.brief)}</p>
              <small>Synthetic prototype · provider not selected · ${html(artwork.trigger)}</small>
              <div class="inline-actions">${day.uploadDerivedStateV14 ? '<span class="quiet-label">Artwork refresh waits for the pending source refresh.</span>' : `<button type="button" class="text-button" data-action="trigger-art" data-date="${domDate}">Regenerate artwork</button>`}<button type="button" class="text-button" data-action="view-art-history">View versions</button><button type="button" class="text-button is-danger" data-action="trash-placeholder">Move to Trash</button></div>
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
  const domDate = uploadDayDomTokenV14(day.date);

  if (day.uploadDerivedStateV14) {
    return `<div class="artwork-empty-state"><p>${day.uploadDerivedStateV14 === "pending" ? "Artwork generation waits for the represented source quiet period." : "Artwork regeneration waits while the source refresh is pending."}</p></div>`;
  }

  if (generationStatus) {
    const label = generationStatus === "waiting" ? "Waiting" : generationStatus === "in-progress" ? "In progress" : "Complete";
    return `
      <div class="generation-state" id="generation-status-${domDate}" role="status" tabindex="-1">
        <span class="generation-orbit" aria-hidden="true"></span>
        <div><strong>${label}</strong><p>${generationStatus === "complete" ? "Synthetic artwork added to this in-memory Journal Day." : "You can keep reading authentic sources while this local simulation runs."}</p></div>
      </div>`;
  }

  return `
    <div class="artwork-empty-state">
      <p>A symbolic, non-photorealistic image can be created from a minimized Visual Brief. The Artwork Provider receives neither raw photos nor photo-derived data.</p>
      <button type="button" class="secondary-button" data-action="trigger-art" data-date="${domDate}" ${count < 5 ? "disabled" : ""}>Generate artwork now</button>
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
  const domDate = uploadDayDomTokenV14(day.date);
  const titleId = `reflection-title-${mode}-${domDate}`;
  const counts = dayCounts(day);
  return `
    <section class="reflection-companion reflection-companion--${mode}" aria-labelledby="${titleId}">
      <div class="reflection-origin">
        <strong>${html(reflection.label)}</strong>
        ${reflection.isStale ? `<span>Summary update available</span><small>Your current version is unchanged</small><button type="button" class="reflection-review" data-action="review-suggestion" data-date="${domDate}" data-field="summary">Review update</button>` : `<span>${html(reflection.detail)}</span>`}
      </div>
      <div class="reflection-prose">
        ${includeDate || mode === "mosaic" ? `<p class="reflection-dateline">${longDate(day.date)} · ${counts.label}</p>` : ""}
        <${headingTag} id="${titleId}">${html(day.title)}</${headingTag}>
        <p class="reflection-summary">${html(day.summary)}</p>
      </div>
      <div class="reflection-meta">
        <p class="reflection-topics-label">Topics</p>
        <ul class="reflection-topics">${day.tags.slice(0, 3).map((tag) => `<li>${html(tag)}</li>`).join("")}</ul>
        <button type="button" class="reflection-manage" data-action="open-manage-reflection" data-date="${domDate}">Manage reflection</button>
      </div>
    </section>`;
}

function sourceConflict(day) {
  if (!day.conflict) return "";
  const domDate = uploadDayDomTokenV14(day.date);
  return `
    <aside class="conflict-panel correction-source-update-v15" aria-labelledby="conflict-title-${domDate}">
      <div>
        <p class="eyebrow">Source update</p>
        <h3 id="conflict-title-${domDate}">Review source update</h3>
        <p>A newer upstream revision is represented. V15 does not compare, select, or merge source text.</p>
        <button type="button" class="secondary-button" data-action="review-correction-source-update">Review source update</button>
      </div>
    </aside>`;
}

function sourceConflictOverlayV16(day, journal) {
  const model = state.sourceConflict;
  if (!model.active || day.date !== SOURCE_CONFLICT_ITEM_V16.date || journal.id !== SOURCE_CONFLICT_ITEM_V16.journalId) return null;
  const displayedText = model.eligibility === "no-current-correction"
    ? SOURCE_CONFLICT_TEXT_V16.r1
    : model.displayed === "r2"
      ? VOICE_R2_TEXT_V16
      : model.displayed === "c2"
        ? model.c2Text || VOICE_C2_TEXT_V16
        : SOURCE_CONFLICT_TEXT_V16.c1;
  return { model, displayedText };
}

function renderSourceConflictSourceCardV16(overlay) {
  const model = overlay.model;
  if (model.eligibility === "no-current-correction") {
    return `<aside id="source-conflict-no-correction-v16" class="source-conflict-entry-v16 is-ineligible" tabindex="-1"><strong>Source update</strong><p>${html(SOURCE_CONFLICT_COPY_V16.noCorrection)}</p></aside>`;
  }
  const unresolved = !model.terminal || model.stage === "source-card-conflict" && model.newestRevision === "r3";
  const entryCopy = model.displayed === "r2"
    ? "VoiceNotes changed again. Nothing was merged. The currently displayed Source Revision remains unchanged while you review this new conflict."
    : SOURCE_CONFLICT_COPY_V16.entry;
  const entry = unresolved ? `
    <aside class="source-conflict-entry-v16" aria-labelledby="source-conflict-entry-title-v16">
      <p class="eyebrow">Source Item conflict</p><h4 id="source-conflict-entry-title-v16">Review source update</h4><p>${html(entryCopy)}</p><p>${html(SOURCE_CONFLICT_COPY_V16.retained)}</p>
      <button type="button" class="secondary-button" data-action="review-source-conflict">Review source update</button>
    </aside>` : "";
  if (!model.terminal) {
    const retainedRevisions = model.newestRevision === "r3" ? "Voice R1, Voice R2, and Voice R3" : "Voice R1 and Voice R2";
    return `<aside class="source-conflict-current-correction-v16" aria-label="Displayed Correction metadata"><strong>Correction 1 · Current · displayed</strong><span>Archive owner · simulated · ${html(SOURCE_CONFLICT_TIMES_V16.c1Created)}</span><span>Based on Voice R1</span><p>${retainedRevisions} remain immutable and retained.</p></aside>${entry}`;
  }
  const terminal = model.terminal;
  const displayed = sourceConflictDisplayedLabelV16(model);
  const terminalFacts = terminal.outcome === "keep"
    ? `<div><dt>Voice R2</dt><dd>Reviewed</dd></div><div><dt>Correction 1</dt><dd>Current · displayed</dd></div><div><dt>Correction author</dt><dd>Archive owner · simulated</dd></div><div><dt>Correction created</dt><dd>${html(SOURCE_CONFLICT_TIMES_V16.c1Created)}</dd></div><div><dt>Based on</dt><dd>Voice R1</dd></div>`
    : terminal.outcome === "display-newest"
      ? `<div><dt>Voice R2</dt><dd>Displayed · Archive owner · simulated</dd></div><div><dt>Correction 1</dt><dd>Historical · retained · not deleted</dd></div><div><dt>Correction created</dt><dd>${html(SOURCE_CONFLICT_TIMES_V16.c1Created)}</dd></div><div><dt>Correction base</dt><dd>Voice R1</dd></div>`
      : `<div><dt>Correction 2</dt><dd>Archive owner · simulated · ${html(terminal.time)}</dd></div><div><dt>Based on</dt><dd>Voice R2</dd></div><div><dt>Lineage</dt><dd>Correction 1 · Historical · retained</dd></div>`;
  const retainedRevisions = model.newestRevision === "r3" ? "Voice R1, Voice R2, and Voice R3 retained unchanged" : "Voice R1 and Voice R2 retained unchanged";
  return `
    <section class="source-conflict-terminal-v16" aria-labelledby="source-conflict-terminal-title-v16">
      <p class="eyebrow">Source update resolved · represented in this tab</p><h4 id="source-conflict-terminal-title-v16" tabindex="-1">${html(terminal.label)}</h4><p>${html(terminal.copy)}</p>
      <dl><div><dt>Resolved</dt><dd>${html(terminal.time)}</dd></div><div><dt>Displayed</dt><dd>${displayed}</dd></div>${terminalFacts}<div><dt>Source Revisions</dt><dd>${retainedRevisions}</dd></div><div><dt>Resolution events</dt><dd>1</dd></div></dl>
      <p>${html(SOURCE_CONFLICT_COPY_V16.prototype)}</p>
    </section>${entry}`;
}

function sourceJournals(day) {
  const domDate = uploadDayDomTokenV14(day.date);
  return `
    <section class="day-section sources-section" aria-labelledby="sources-title-${domDate}">
      <div class="section-heading">
        <div><p class="eyebrow">Authentic record</p><h2 id="sources-title-${domDate}">Source journals</h2></div>
        <button type="button" class="secondary-button" data-action="open-upload" data-date="${domDate}">Upload journal</button>
      </div>
      ${sourceConflict(day)}
      <div class="journal-list">
        ${day.journals.map((journal) => {
          const correctionHandle = registerCorrectionSourceV15(day, journal);
          if (correctionHiddenSourceHandlesV15.has(correctionHandle)) return "";
          const correctionMeta = correctionSourceMetaV15(day, journal);
          const lifecycle = correctionLifecycleV15(day.date, journal.id);
          const representedCorrection = lifecycle.records.find((record) => record.id === lifecycle.activeRecordId) || null;
          const historicalCorrections = lifecycle.records.filter((record) => record.state === "Historical");
          const sourceConflictOverlay = sourceConflictOverlayV16(day, journal);
          const displayedText = sourceConflictOverlay?.displayedText ?? representedCorrection?.text ?? journal.text;
          const sourceLabel = correctionMeta.sourceType;
          const sourceCardTitleId = sourceConflictOverlay ? "source-conflict-source-card-title-v16" : `correction-card-title-${html(correctionHandle)}`;
          const sourceCardId = sourceConflictOverlay ? "source-conflict-source-card-v16" : `correction-card-${html(correctionHandle)}`;
          return `
          <article class="journal-card correction-source-card-v15${sourceConflictOverlay ? " source-conflict-source-card-v16" : ""}${journal.uploadV14 ? " uploaded-journal-card-v14" : ""}" id="${sourceCardId}" aria-labelledby="${sourceCardTitleId}" tabindex="-1">
            <header>
              <div><span class="badge badge-source">${html(sourceLabel)}</span>${sourceConflictOverlay?.model.eligibility === "conflict" && sourceConflictOverlay.model.displayed !== "r2" ? '<span class="badge badge-correction">Correction displayed · prototype only</span>' : sourceConflictOverlay?.model.displayed === "r2" ? '<span class="badge badge-prototype-v15">Voice R2 displayed</span>' : representedCorrection ? '<span class="badge badge-correction">Correction displayed · prototype only</span>' : lifecycle.removal ? '<span class="badge badge-prototype-v15">Source Revision displayed</span>' : journal.correction ? '<span class="badge badge-correction">Correction displayed</span>' : ""}<h3 id="${sourceCardTitleId}" tabindex="-1">${html(journal.title)}</h3></div>
              <button type="button" class="icon-button" data-action="journal-menu" aria-label="Manage ${html(journal.title)}">•••</button>
            </header>
            <p class="journal-text">${html(displayedText)}</p>
            <footer><span>Original Timestamp · ${html(journal.timestamp)}</span><span>${html(sourceConflictOverlay?.model.eligibility === "conflict" ? sourceConflictOverlay.model.terminal ? "Source update resolution represented" : "Correction differs from newest upstream revision" : representedCorrection ? "Correction displayed · source unchanged" : journal.status)}</span></footer>
            ${sourceConflictOverlay ? renderSourceConflictSourceCardV16(sourceConflictOverlay) : ""}
            ${representedCorrection && !sourceConflictOverlay ? `<aside class="correction-record-v15" aria-label="Displayed Correction metadata">
              <strong>Correction ${representedCorrection.ordinal} · Displayed</strong>
              <dl>
                <div><dt>Author</dt><dd>${html(representedCorrection.author)}</dd></div>
                <div><dt>Created</dt><dd>${html(representedCorrection.timestamp)}</dd></div>
                <div><dt>Based on</dt><dd>${html(representedCorrection.baseRevisionLabel)}</dd></div>
              </dl>
              <p>The Source Item and Source Revisions are unchanged. ${html(CORRECTION_PROTOTYPE_DISCLOSURE_V15)}</p>
            </aside>` : ""}
            ${!sourceConflictOverlay && !lifecycle.removal && historicalCorrections.length ? `<aside class="correction-retained-v15" aria-label="Retained historical Corrections">
              <strong>Earlier Correction retained · prototype only</strong>
              <ul>${historicalCorrections.map((record) => `<li><strong>Correction ${record.ordinal} · Historical</strong><span>${html(record.author)} · ${html(record.timestamp)}</span><span>Based on ${html(record.baseRevisionLabel)}</span></li>`).join("")}</ul>
              <p>Bounded in-memory retained-history truth only. Complete History remains outside v15.</p>
            </aside>` : ""}
            ${lifecycle.removal ? `<aside class="correction-retained-v15" aria-label="Retained Correction result" tabindex="-1">
              <strong>Source Revision 1 displayed again</strong>
              <p>${html(lifecycle.removal.resultCopy || CORRECTION_COPY_V15.removeSuccess)}</p>
              <p>Removal represented ${html(lifecycle.removal.timestamp)} by ${html(lifecycle.removal.author)}. Earlier Corrections remain retained; the source is unchanged.</p>
              <ul>${historicalCorrections.map((record) => `<li><strong>Correction ${record.ordinal} · Historical</strong><span>${html(record.author)} · ${html(record.timestamp)}</span><span>Based on ${html(record.baseRevisionLabel)}</span></li>`).join("")}</ul>
              <p>${html(CORRECTION_PROTOTYPE_DISCLOSURE_V15)} Complete History remains outside v15.</p>
            </aside>` : ""}
            ${journal.uploadV14 ? `<aside class="upload-source-provenance-v14" aria-label="Uploaded Journal provenance">
              <strong>Original-file provenance</strong>
              <dl>
                <div><dt>Source type</dt><dd>${html(journal.uploadV14.sourceType)}</dd></div>
                <div><dt>Exact original size</dt><dd>${html(formatUploadBytesV14(journal.uploadV14.byteLength))}</dd></div>
                <div><dt>Journal Date</dt><dd>${html(longDate(day.date))} · Asia/Kolkata</dd></div>
                <div><dt>Original-file identity</dt><dd>Exact-file identity represented · value hidden</dd></div>
                <div><dt>Archive relationship</dt><dd>Separate Source Item on this Journal Day</dd></div>
                ${journal.uploadV14.duplicateProvenance ? `<div><dt>Duplicate provenance</dt><dd>${html(journal.uploadV14.duplicateProvenance)}</dd></div>` : ""}
                <div><dt>Export & restore</dt><dd>${html(journal.uploadV14.exportRestoreStatus)}</dd></div>
              </dl>
              <p>${html(UPLOAD_PROTOTYPE_DISCLOSURE_V14)}</p>
            </aside>` : ""}
            <div class="journal-actions">${sourceConflictOverlay
              ? ""
              : correctionMeta.eligible
              ? representedCorrection
                ? `<button type="button" class="text-button" data-action="correct-text" data-correction-handle="${html(correctionHandle)}">Update displayed Correction</button><button type="button" class="text-button correction-remove-trigger-v15" data-action="remove-correction" data-correction-handle="${html(correctionHandle)}">Remove displayed Correction</button>`
                : `<button type="button" class="text-button" data-action="correct-text" data-correction-handle="${html(correctionHandle)}">Correct displayed text</button>`
              : correctionMeta.sourceChanged
                ? `<span class="correction-conflict-boundary-v15">Correction editing waits for source-update review in v16.</span><button type="button" class="text-button" data-action="review-correction-source-update">Review source update</button>`
                : `<span class="correction-conflict-boundary-v15">${correctionMeta.baseComplete ? "Correction editing waits for source-update review in v16." : "Correction editing requires a complete selected base revision."}</span>`}<button type="button" class="text-button" data-action="change-date" data-date="${domDate}">Change Journal Date</button><button type="button" class="text-button" data-action="view-provenance">Revisions & provenance</button></div>
          </article>`;
        }).join("")}
      </div>
    </section>`;
}

function uploadDerivedStateMarkupV14(day) {
  const domDate = uploadDayDomTokenV14(day.date);
  if (day.uploadDerivedStateV14 === "pending") {
    return `<aside class="upload-derived-state-v14 is-pending" aria-labelledby="upload-derived-title-${domDate}"><p class="eyebrow">Derived Artifact state</p><h2 id="upload-derived-title-${domDate}">Waiting for source quiet period</h2><p>No title, summary, tags, or artwork were fabricated. This represented state does not verify an AI job or durable queue.</p></aside>`;
  }
  if (day.uploadDerivedStateV14 === "stale") {
    return `<aside class="upload-derived-state-v14 is-stale" aria-labelledby="upload-derived-title-${domDate}"><p class="eyebrow">Derived Artifact state</p><h2 id="upload-derived-title-${domDate}">Source changed · refresh pending</h2><p>Existing generated and protected values remain visible and unchanged. Artwork was not regenerated.</p></aside>`;
  }
  return "";
}

function dayDetail(day, mode) {
  const domDate = uploadDayDomTokenV14(day.date);
  const previous = adjacentPopulatedDate(day.date, -1);
  const next = adjacentPopulatedDate(day.date, 1);
  const counts = dayCounts(day);
  const isCaptureDayHandoffV13 = mode === "mosaic"
    && captureDayHistoryTargetsV13.get(window.history.state?.entryId) === day.date;
  const exposesCorrectionFallbackHeadingV15 = mode === "mosaic"
    && [...correctionHiddenSourceHandlesV15]
      .some((handle) => resolveCorrectionSourceV15(handle)?.day.date === day.date);
  const operationalAttention = day.attention && (day.conflict || day.summaryStatus !== "Stale") ? day.attention : null;
  const hasAlmanacOrigin = mode === "almanac" && Boolean(currentHistorySnapshot()?.fullDayOpenedInApp);
  const backLabel = mode === "almanac" && hasAlmanacOrigin ? "Back to Almanac" : mode === "almanac" ? "Back to Calendar" : `Back to ${monthLabel(state.month)}`;
  return `
    <div class="day-detail day-detail--${mode}">
      <header class="day-detail-header">
        <button type="button" class="back-button" data-action="close-day"><span aria-hidden="true">←</span> ${backLabel}</button>
        <div class="day-date-row ${mode === "mosaic" ? "day-date-row--compact" : ""}">
          <div${isCaptureDayHandoffV13 || exposesCorrectionFallbackHeadingV15 ? ' style="display: block"' : ""}><p class="eyebrow">Journal Day · Asia/Kolkata</p><h1 id="journal-day-title-v14" tabindex="-1">${longDate(day.date)}</h1><p>${counts.label}</p></div>
          <div class="adjacent-days" aria-label="Adjacent populated Journal Days">
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${previous ? uploadDayDomTokenV14(previous) : ""}" aria-label="Previous populated Journal Day" ${previous ? "" : "disabled"}>←</button>
            <button type="button" class="icon-button" data-action="adjacent-day" data-date="${next ? uploadDayDomTokenV14(next) : ""}" aria-label="Next populated Journal Day" ${next ? "" : "disabled"}>→</button>
          </div>
        </div>
        ${operationalAttention ? `<a class="attention-banner" href="#sources-title-${domDate}"><span aria-hidden="true">!</span><span><strong>${html(operationalAttention)}</strong><small>Authentic sources are unchanged.</small></span><span aria-hidden="true">→</span></a>` : ""}
      </header>
      <div class="day-detail-body">
        ${gallery(day)}
        ${uploadDerivedStateMarkupV14(day)}
        ${day.captureOnlyV13 || day.uploadOnlyV14 ? "" : generatedReflection(day, mode)}
        ${sourceJournals(day)}
        <section class="day-actions-section" aria-labelledby="day-actions-title-${domDate}">
          <div><p class="eyebrow">Manage this day</p><h2 id="day-actions-title-${domDate}">History and actions</h2></div>
          <div><button type="button" class="secondary-button" data-action="view-provenance">View day history</button><button type="button" class="secondary-button" data-action="open-upload" data-date="${domDate}">Upload journal</button><button type="button" class="secondary-button" data-action="export-placeholder">Export archive</button></div>
          <p>To add a Daily Photo, send it through your private Telegram bot. There is no web photo upload in MVP.</p>
        </section>
      </div>
    </div>`;
}

function formatUploadBytesV14(value) {
  const bytes = Math.max(0, Number(value) || 0);
  return bytes === UPLOAD_MAX_BYTES_V14
    ? "1,048,576 bytes · 1 MiB"
    : `${bytes.toLocaleString("en-US")} ${bytes === 1 ? "byte" : "bytes"}`;
}

function uploadReviewFactsV14(upload, { includeResult = false, includeIdentity = true } = {}) {
  const candidate = upload.candidate || upload.result?.candidate;
  const date = upload.result?.date || upload.date;
  if (!candidate) return "";
  return `
    <dl class="upload-facts-v14">
      <div><dt>Filename · source title</dt><dd>${html(candidate.fileName)}</dd></div>
      <div><dt>Detected source type</dt><dd>${html(candidate.sourceType)}</dd></div>
      <div><dt>Exact original size</dt><dd>${html(formatUploadBytesV14(candidate.fileSize))}</dd></div>
      <div><dt>Journal Date</dt><dd>${html(longDate(date))} · Asia/Kolkata</dd></div>
      <div><dt>Original Timestamp</dt><dd>${html(candidate.originalTimestamp || upload.result?.originalTimestamp || "Receipt time unavailable")}</dd></div>
      <div><dt>Source</dt><dd>Uploaded Journal</dd></div>
      ${includeIdentity ? "<div><dt>Original-file identity</dt><dd>Exact-file identity represented · value hidden</dd></div>" : ""}
      ${includeResult ? `<div><dt>Archive relationship</dt><dd>Separate Source Item on this Journal Day</dd></div>` : ""}
    </dl>`;
}

function uploadStageListV14(stage) {
  const order = stage === "reconciling" ? [
    ["reconciling", "Checking previous upload result"],
  ] : [
    ["checking", "Checking for an identical file"],
    ["uploading", "Uploading original file"],
    ["saving", "Saving Uploaded Journal"],
  ];
  const stageIndex = order.findIndex(([key]) => key === stage);
  return `<ol class="upload-stage-list-v14" aria-label="Upload path">${order.map(([key, label], index) => {
    const status = index < stageIndex ? "complete" : index === stageIndex ? "current" : "upcoming";
    return `<li data-status="${status}"><span aria-hidden="true">${index + 1}</span><strong>${html(label)}</strong><small>${status === "complete" ? "Complete" : status === "current" ? "In progress" : "Not started"}</small></li>`;
  }).join("")}</ol>`;
}

function uploadPrototypeDisclosureV14() {
  return `<aside class="upload-disclosure-v14"><strong>Prototype boundary</strong><p id="upload-disclosure-copy-v14">${html(UPLOAD_PROTOTYPE_DISCLOSURE_V14)}</p></aside>`;
}

function uploadChooseMarkupV14(upload) {
  const dateReady = upload.dateValidation.kind === "valid";
  const dateHasError = Boolean(upload.error) && upload.error === upload.dateValidation.message;
  const fileHasError = Boolean(upload.error) && !dateHasError;
  return `
    <div class="upload-fields upload-fields-v14">
      <label for="upload-date">Journal Date<input id="upload-date" type="date" value="${html(upload.date)}" max="${today}" data-action="upload-date" required aria-required="true" aria-invalid="${dateHasError}" aria-describedby="upload-date-help-v14${dateHasError ? " upload-error-v14" : ""}" ${dateHasError ? 'aria-errormessage="upload-error-v14"' : ""} /></label>
      <p id="upload-date-help-v14" class="field-help">Journal Dates use Asia/Kolkata. Historical dates are allowed; future dates are not.${upload.origin === "inline" ? " This date was preselected from the Journal Day and can be changed." : ""}</p>
      <label class="file-drop ${dateReady ? "" : "is-disabled"}" for="journal-file" aria-disabled="${!dateReady}"><strong>Choose one .txt or .md file</strong><small>UTF-8 · up to 1 MiB · no Word, PDF, photo, or OCR files</small><input id="journal-file" type="file" accept=".txt,.md,text/plain,text/markdown" data-action="journal-file" ${fileHasError ? 'aria-invalid="true" aria-errormessage="upload-error-v14"' : ""} ${dateReady ? "" : "disabled"} /></label>
      ${upload.error ? `<p id="upload-error-v14" class="form-error" role="alert" tabindex="-1">${html(upload.error)}</p>` : ""}
      ${!dateReady && !upload.error ? '<p class="upload-inline-guidance-v14">Choose a Journal Date before selecting a file.</p>' : ""}
      <aside class="local-only-note"><p>The selected file remains only in this open page while you review it. Nothing is sent to AI or over the network.</p></aside>
    </div>`;
}

function uploadReviewMarkupV14(upload) {
  const preview = upload.candidate?.text || "";
  const uploadUnavailable = state.shell.connection !== "connected";
  return `
    <div class="upload-review upload-review-v14">
      <h3 id="upload-review-title-v14" tabindex="-1">Review journal</h3>
      <p class="upload-source-label-v14"><span class="badge badge-source">Uploaded Journal</span><span>One separate authentic Source Item</span></p>
      ${uploadReviewFactsV14(upload, { includeIdentity: false })}
      <label class="upload-review-date-v14" for="upload-date">Journal Date<input id="upload-date" type="date" value="${html(upload.date)}" max="${today}" data-action="upload-date" required aria-required="true" aria-describedby="upload-date-help-v14" /></label>
      <p id="upload-date-help-v14" class="field-help">Journal Dates use Asia/Kolkata. Historical dates are allowed; future dates are not.</p>
      <label class="upload-replace-v14" for="journal-file">Choose a different file<input id="journal-file" type="file" accept=".txt,.md,text/plain,text/markdown" data-action="journal-file" /></label>
      <div class="text-preview upload-preview-v14"><strong>Plain-text preview</strong><pre id="upload-preview-v14" tabindex="0">${html(preview)}</pre></div>
      <p class="upload-original-identity-v14"><strong>Original-file identity</strong><span>Exact-file identity represented · value hidden</span></p>
      <p class="upload-privacy-note-v14">${html(UPLOAD_PRIVACY_NOTE_V14)}</p>
      ${uploadPrototypeDisclosureV14()}
      <div class="modal-actions upload-actions-v14"><button type="button" class="secondary-button" data-action="upload-cancel">Cancel</button><button type="button" class="primary-button" data-action="confirm-upload" ${uploadUnavailable ? 'aria-disabled="true"' : ""}>Upload journal</button></div>
    </div>`;
}

function uploadDuplicateMarkupV14(upload) {
  const uploadUnavailable = state.shell.connection !== "connected";
  return `
    <div class="upload-decision-v14">
      <p class="eyebrow">Exact-file decision</p>
      <h3 id="upload-duplicate-title-v14" tabindex="-1">This exact file is already in your archive.</h3>
      <p>Cancel to leave the archive unchanged, or add this as a separate Uploaded Journal.</p>
      ${upload.raceProof ? `<aside class="upload-race-proof-v14"><strong>Concurrent fresh-flow guard</strong><span>${html(upload.raceProof)}</span></aside>` : ""}
      ${uploadReviewFactsV14(upload)}
      <div class="upload-decision-edit-v14">
        <label for="upload-date">Journal Date<input id="upload-date" type="date" value="${html(upload.date)}" max="${today}" data-action="upload-date" required aria-required="true" aria-describedby="upload-date-help-v14" /></label>
        <p id="upload-date-help-v14" class="field-help">Journal Dates use Asia/Kolkata. Historical dates are allowed; future dates are not.</p>
        <label class="upload-replace-v14" for="journal-file">Choose a different file<input id="journal-file" type="file" accept=".txt,.md,text/plain,text/markdown" data-action="journal-file" /></label>
      </div>
      ${uploadPrototypeDisclosureV14()}
      <div class="modal-actions upload-actions-v14"><button type="button" class="secondary-button" data-action="upload-cancel">Cancel</button><button type="button" class="primary-button" data-action="upload-add-anyway" ${uploadUnavailable ? 'aria-disabled="true"' : ""}>Add anyway</button></div>
    </div>`;
}

function uploadProgressMarkupV14(upload) {
  const reconciling = upload.stage === "reconciling";
  const title = reconciling ? "Checking previous upload result" : upload.stage === "checking" ? "Checking for an identical file" : upload.stage === "uploading" ? "Uploading original file" : "Saving Uploaded Journal";
  return `
    <div class="saving-state upload-progress-v14" aria-busy="true">
      <h3 id="upload-progress-title-v14" tabindex="-1">${html(title)}</h3>
      <p>${reconciling ? "Reconciling this operation before any retry can create a result." : "Nothing is added until the complete represented commit finishes."}</p>
      ${uploadStageListV14(upload.stage)}
    </div>`;
}

function uploadFailureMarkupV14(upload) {
  const interrupted = upload.stage === "interrupted";
  const resultUnknown = upload.resultStatus === "unknown";
  const connectionUnavailable = state.shell.connection !== "connected";
  const reboundPending = Boolean(pendingUploadPopstateReboundV14);
  const reboundDisabled = reboundPending ? ' aria-disabled="true"' : "";
  return `
    <div class="upload-failure-v14">
      <p class="eyebrow">${resultUnknown ? "Reconciliation required" : "No archive change"}</p>
      <h3 id="upload-failure-title-v14" tabindex="-1">${resultUnknown || upload.retryTarget === "reconcile" ? "Previous upload result is unknown" : interrupted ? "Upload interrupted" : upload.retryTarget === "check" ? "Duplicate check could not finish" : "Journal was not added"}</h3>
      <p>${html(upload.error || "Nothing was added. Your file and Journal Date remain selected in this tab. Retry.")}</p>
      ${uploadPrototypeDisclosureV14()}
      <div class="modal-actions upload-actions-v14">${resultUnknown ? "" : `<button type="button" class="secondary-button" data-action="upload-cancel"${reboundDisabled}>Cancel</button>`}${connectionUnavailable ? `<button type="button" class="secondary-button" data-action="upload-restore-connection"${reboundDisabled}>Restore connection</button>` : ""}<button type="button" class="primary-button" data-action="upload-retry" ${connectionUnavailable || reboundPending ? 'aria-disabled="true"' : ""}>Retry</button></div>
    </div>`;
}

function uploadSuccessMarkupV14(upload) {
  const result = upload.result;
  const alreadyCompleted = upload.stage === "already-completed";
  return `
    <div class="upload-result-v14">
      <p class="eyebrow">Represented commit complete</p>
      <h3 id="upload-result-title-v14" tabindex="-1">${alreadyCompleted ? "Upload already completed" : `Journal added to ${html(longDate(result.date).replace(/^\w+, /, ""))}.`}</h3>
      <p>${alreadyCompleted ? "This upload was already completed. No second Uploaded Journal was created." : "One separate Uploaded Journal is now represented on the Journal Day."}</p>
      ${uploadReviewFactsV14(upload, { includeResult: true })}
      ${result.addedAnyway ? '<p class="upload-duplicate-provenance-v14"><strong>Duplicate provenance</strong><span>Added after exact-file duplicate warning</span></p>' : ""}
      <p class="upload-derived-result-v14"><strong>${result.newDay ? "Waiting for source quiet period" : "Source changed · refresh pending"}</strong><span>${result.newDay ? "No title, summary, tags, or artwork were fabricated." : "Existing generated and protected values remain visible and unchanged; artwork was not regenerated."}</span></p>
      ${uploadPrototypeDisclosureV14()}
      <div class="modal-actions upload-actions-v14"><button type="button" class="primary-button" data-action="view-upload-day">View day</button></div>
    </div>`;
}

function renderUploadModal() {
  const upload = state.upload;
  const dismissalLocked = uploadDismissalLockedV14();
  const closeAllowed = !dismissalLocked;
  const body = upload.stage === "choose" ? uploadChooseMarkupV14(upload)
    : upload.stage === "validating" ? '<div class="saving-state upload-progress-v14" aria-busy="true"><h3 id="upload-validating-title-v14" tabindex="-1">Validating file</h3><p>Checking the selected file locally. Nothing has been added.</p></div>'
      : upload.stage === "review" ? uploadReviewMarkupV14(upload)
        : upload.stage === "duplicate-decision" ? uploadDuplicateMarkupV14(upload)
          : ["checking", "reconciling", "uploading", "saving"].includes(upload.stage) ? uploadProgressMarkupV14(upload)
            : ["failure", "interrupted"].includes(upload.stage) ? uploadFailureMarkupV14(upload)
              : ["success", "already-completed"].includes(upload.stage) ? uploadSuccessMarkupV14(upload)
                : uploadChooseMarkupV14(upload);
  return `
    <div class="modal-backdrop upload-backdrop-v14" data-action="modal-backdrop">
      <section id="upload-modal-card-v14" class="modal-card upload-modal upload-modal-v14" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" aria-describedby="upload-modal-description-v14 upload-disclosure-copy-v14" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Durable manual upload · prototype</p><h2 id="upload-modal-title" tabindex="-1">Upload a journal</h2></div>${closeAllowed ? '<button type="button" class="secondary-button upload-dialog-close-v14" data-action="close-modal">Close</button>' : '<span class="settings-state is-neutral">In progress</span>'}</header>
        <p id="upload-modal-description-v14" class="sr-only">Journal Dates use Asia/Kolkata. Historical dates are allowed; future dates are not. Choose one UTF-8 txt or Markdown file up to 1 MiB.</p>
        ${body}
        ${["review", "duplicate-decision", "failure", "interrupted", "success", "already-completed"].includes(upload.stage) ? "" : uploadPrototypeDisclosureV14()}
      </section>
    </div>`;
}

function renderPhotoModal() {
  const { day, photo } = state.modal;
  return `
    <div class="modal-backdrop lightbox-backdrop" data-action="modal-backdrop">
      <section class="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" tabindex="-1" data-modal-card>
        <header><div><span class="badge badge-source">${html(photo.sourceLabel || "Telegram photo")}</span><h2 id="lightbox-title">${html(photo.caption)}</h2><p>${longDate(day.date)} · ${html(photo.timestamp)}</p></div><button type="button" class="lightbox-close" data-action="close-modal" aria-label="Close original view">×</button></header>
        <img src="${html(photo.src)}" alt="${html(photo.alt)}" />
        <footer><p>Synthetic visual fixture · this is not a personal photograph.</p><span>Real originals open only on explicit request in the planned product.</span></footer>
      </section>
    </div>`;
}

function renderSparseArtworkModal() {
  const day = days[state.modal.date];
  const domDate = uploadDayDomTokenV14(day.date);
  const count = meaningfulWordCount(day);
  return `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="sparse-title" tabindex="-1" data-modal-card>
        <header><div><p class="eyebrow">Before generation</p><h2 id="sparse-title">The journal is very short</h2></div><button type="button" class="icon-button" data-action="close-modal" aria-label="Close artwork warning">×</button></header>
        <p>Only ${count} meaningful words are available. The result may be generic or miss important context.</p>
        <aside class="local-only-note"><span aria-hidden="true">◈</span><p>This simulation sends nothing. In the planned product, an Artwork Provider receives only the minimized Visual Brief—never raw journal text or a photo.</p></aside>
        <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button type="button" class="primary-button" data-action="confirm-art" data-date="${domDate}">Generate anyway</button></div>
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
  const domDate = uploadDayDomTokenV14(day.date);
  const view = modal.view || "list";
  const field = modal.field;
  const value = field === "tags" ? day.tags.join(", ") : day[field];
  const fieldLabel = field ? `${field[0].toUpperCase()}${field.slice(1)}` : "";
  const fieldRow = (name, label, display) => `
    <section class="reflection-manage-row" data-field-row="${name}" tabindex="-1">
      <header><h3>${label}</h3><span>${html(reflectionFieldStatus(day, name))}</span></header>
      ${name === "tags" ? `<p class="manage-topics">${day.tags.map((tag) => html(tag)).join(" · ")}</p>` : `<p>${html(display)}</p>`}
      <div class="manage-row-actions">
        ${name === "summary" && day.summaryStatus === "Stale" ? `<button type="button" class="text-button reflection-review" data-action="review-suggestion" data-date="${domDate}" data-field="summary">Review update</button>` : ""}
        <button type="button" class="text-button" data-action="edit-generated" data-date="${domDate}" data-field="${name}">Edit ${name}</button>
        ${name === "summary" && day.summaryProtected ? `<button type="button" class="text-button" data-action="resume-updates" data-date="${domDate}">Resume automatic updates</button>` : ""}
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
    <div class="sheet-sticky-actions"><button type="button" class="secondary-button" data-action="manage-back">Cancel</button><button type="button" class="primary-button" data-action="save-generated" data-date="${domDate}" data-field="${field}">Save ${html(field)}</button></div>`;

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
      <button type="button" class="secondary-button" data-action="keep-summary" data-date="${domDate}">Keep current version</button>
      <button type="button" class="secondary-button" data-action="edit-generated" data-date="${domDate}" data-field="summary">Edit current version</button>
      <button type="button" class="primary-button" data-action="use-summary" data-date="${domDate}">Use suggested version</button>
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
          <button type="button" data-action="open-upload"><strong>Upload journal</strong><small>Choose a .txt or .md file</small></button>
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
  const reconciling = correction.status === "reconciling";
  const unknown = correction.status === "unknown";
  const failed = correction.status === "failed";
  const saved = correction.status === "saved";
  const disconnected = state.shell.connection !== "connected";
  const checkingConnection = state.shell.connection === "checking";
  const reboundPending = Boolean(pendingCorrectionPopstateReboundV15);
  const baseRace = failed && correction.failure?.kind === "stale-base";
  const sourceRaceResultFound = baseRace && correction.intentResolution === "source-race-one";
  const locked = saving || reconciling || unknown || saved || baseRace || reboundPending;
  const preEffectConnection = disconnected && correction.dirty && ["clean", "dirty"].includes(correction.status);
  const validationVisible = correction.validationAttempted
    && ["whitespace", "unchanged"].includes(correction.validation.kind);
  const saveUnavailable = !correction.dirty || correction.validation.kind !== "valid" || disconnected || locked;
  const fixtureDirtyResetAvailable = state.shell.correctionBranch === "reset-while-dirty"
    && correction.dirty
    && !locked;
  return `
    <div class="modal-backdrop correction-sheet-backdrop-v10 correction-sheet-backdrop-v15" data-action="modal-backdrop">
      <section class="modal-card correction-sheet-v10 correction-sheet-v15" role="dialog" aria-modal="true" aria-labelledby="correction-title-v15" aria-describedby="correction-editor-help-v15 correction-prototype-boundary-v15" tabindex="-1" data-modal-card>
        <header class="correction-header-v15">
          <p class="eyebrow">${correction.mode === "update" ? "Update displayed Correction" : "Source Item Correction"}</p>
          <h2 id="correction-title-v15" tabindex="-1">Correct displayed text</h2>
        </header>
        <div class="correction-sheet-body-v10 correction-sheet-body-v15">
          <section class="correction-source-facts-v15" aria-labelledby="correction-source-title-v15">
            <h3 id="correction-source-title-v15">Source Item</h3>
            <dl>
              <div><dt>Source</dt><dd>${html(correction.sourceType)}</dd></div>
              <div><dt>Source title</dt><dd>${html(correction.sourceTitle)}</dd></div>
              <div><dt>Journal Date</dt><dd>${html(correction.journalDate)}</dd></div>
              <div><dt>Original Timestamp</dt><dd>${html(correction.sourceTimestamp)}</dd></div>
              <div><dt>Source status</dt><dd>${html(correction.sourceStatus)}</dd></div>
              <div><dt>Correction base</dt><dd>${html(correction.baseRevisionLabel)}</dd></div>
            </dl>
          </section>
          <section class="correction-base-v15" aria-labelledby="correction-base-title-v15">
            <div><p class="eyebrow">Complete base revision</p><h3 id="correction-base-title-v15">Source revision used as base · read only</h3></div>
            <p class="correction-base-text-v15">${html(correction.baseText)}</p>
          </section>
          ${correction.activeRecord ? `<aside class="correction-existing-v15" aria-label="Displayed Correction metadata"><strong>Correction ${correction.activeRecord.ordinal} · Displayed</strong><span>${html(correction.activeRecord.author)} · ${html(correction.activeRecord.timestamp)}</span><span>Based on ${html(correction.activeRecord.baseRevisionLabel)}</span></aside>` : ""}
          <label class="correction-editor-field-v15" for="correction-draft-v10"><span>Displayed Correction</span><textarea id="correction-draft-v10" class="correction-editor-v10 correction-editor-v15" rows="10" data-action="correction-input" aria-describedby="correction-editor-help-v15${validationVisible ? " correction-validation-v15" : ""}" aria-invalid="${validationVisible}" ${locked ? "disabled" : ""}>${html(correction.draft)}</textarea></label>
          <p id="correction-editor-help-v15">${html(CORRECTION_COPY_V15.helper)}</p>
          ${validationVisible ? `<p id="correction-validation-v15" class="correction-validation-v15" tabindex="-1">${html(correction.validation.message)}</p>` : ""}
          <p class="correction-status-v10 correction-status-v15" data-state="${html(correction.status)}" ${correction.dirty && !saved ? "" : "hidden"}>Unsaved changes · kept only while this page remains open.</p>
        ${preEffectConnection ? `<div id="correction-pre-effect-connection-v15" class="surface-state-row-v10 correction-failure-v15" role="group" aria-labelledby="correction-pre-effect-connection-title-v15" aria-describedby="correction-pre-effect-connection-copy-v15${state.shell.connectionMessage ? " correction-pre-effect-connection-detail-v15" : ""}" tabindex="-1"><strong id="correction-pre-effect-connection-title-v15">Connection interrupted</strong><span id="correction-pre-effect-connection-copy-v15">${html(CORRECTION_COPY_V15.connection)}</span>${state.shell.connectionMessage ? `<small id="correction-pre-effect-connection-detail-v15">${html(state.shell.connectionMessage)}</small>` : ""}</div>` : ""}
        ${failed || unknown ? `
          <div id="correction-save-failure-v10" class="surface-state-row-v10 correction-failure-v15" role="group" aria-labelledby="correction-save-failure-title-v10" aria-describedby="correction-save-failure-copy-v10" tabindex="-1"><strong id="correction-save-failure-title-v10">${unknown ? "Save result unknown" : sourceRaceResultFound ? "Save result found · source changed" : "Correction not saved"}</strong><span id="correction-save-failure-copy-v10">${html(correction.failure?.message || CORRECTION_COPY_V15.saveFailure)}</span>${state.shell.connectionMessage ? `<small>${html(state.shell.connectionMessage)}</small>` : ""}</div>` : ""}
        ${saving || reconciling ? `<p id="correction-operation-status-v10" class="surface-state-row-v10 correction-operation-v15" role="group" aria-label="${reconciling ? CORRECTION_COPY_V15.checkingSave : "Saving Correction"}" aria-busy="true" tabindex="-1">${reconciling ? `${CORRECTION_COPY_V15.checkingSave}…` : "Saving Correction…"}</p>` : ""}
          ${saved ? `<section id="correction-success-v15" class="surface-state-row-v10 correction-success-v15" role="group" aria-labelledby="correction-success-title-v15" tabindex="-1"><strong id="correction-success-title-v15">Correction displayed</strong><p>${html(correction.resultCopy || CORRECTION_COPY_V15.saveSuccess)}</p><span>Correction ${correction.resultRecord?.ordinal || correction.saveCount} · ${html(correction.resultRecord?.author || CORRECTION_AUTHOR_V15)} · ${html(correction.resultRecord?.timestamp || CORRECTION_TIMES_V15.voiceCreate)}</span><span>Based on ${html(correction.resultRecord?.baseRevisionLabel || correction.baseRevisionLabel)}</span><small>${html(CORRECTION_PROTOTYPE_DISCLOSURE_V15)}</small></section>` : ""}
          <p id="correction-prototype-boundary-v15" class="correction-boundary-v15">Conflict comparison, redating, complete History, and durable persistence are not represented here.</p>
        </div>
        <footer class="modal-actions unsaved-savebar-v10 correction-actions-v15">
          <button type="button" class="text-button" data-action="reset-dirty-correction-fixture" ${fixtureDirtyResetAvailable ? "" : "hidden"}>Prototype reset · discard draft</button>
          ${baseRace
            ? `${renderShellActionV10("review-correction-source-update", "Review source update", { disabled: reboundPending, className: "primary-button" })}`
            : failed || unknown
            ? `${failed ? renderShellActionV10("cancel-shell-correction", "Cancel", { disabled: reboundPending }) : ""}${disconnected ? renderShellActionV10("check-shell-connection", checkingConnection ? "Checking connection…" : "Check connection", { disabled: checkingConnection || reboundPending }) : ""}${correction.retryTarget ? renderShellActionV10("retry-shell-correction", unknown ? "Check save status" : "Retry saving", { disabled: saving || reconciling || reboundPending, className: "primary-button" }) : ""}`
            : saved
              ? renderShellActionV10("close-shell-correction", "Close", { className: "primary-button" })
              : `${renderShellActionV10("cancel-shell-correction", "Cancel", { disabled: locked })}${preEffectConnection ? renderShellActionV10("check-shell-connection", checkingConnection ? "Checking connection…" : "Check connection", { disabled: checkingConnection || reboundPending }) : ""}<button type="button" class="primary-button" data-action="save-shell-correction" aria-disabled="${saveUnavailable}" ${saving ? 'aria-label="Saving Correction"' : ""} ${saving || reconciling ? "disabled" : ""}>${saving ? "Saving Correction…" : "Save Correction"}</button>`}
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

function renderRemoveCorrectionV15() {
  const correction = state.shell.correction;
  const removing = correction.status === "removing";
  const reconciling = correction.status === "remove-reconciling";
  const unknown = correction.status === "remove-unknown";
  const failed = correction.status === "remove-failed";
  const baseRace = failed && correction.failure?.kind === "stale-base";
  const sourceRaceResultFound = baseRace && correction.intentResolution === "source-race-one";
  const working = removing || reconciling;
  const disconnected = state.shell.connection !== "connected";
  const checkingConnection = state.shell.connection === "checking";
  const reboundPending = Boolean(pendingCorrectionPopstateReboundV15);
  const dismissalLocked = working || unknown || correctionHasUnresolvedSourceRaceV15(correction) || reboundPending;
  return `
    <div class="modal-backdrop correction-remove-backdrop-v15" data-action="modal-backdrop">
      <section class="modal-card correction-remove-v15" role="alertdialog" aria-modal="true" aria-labelledby="correction-remove-title-v15" aria-describedby="correction-remove-copy-v15 correction-remove-boundary-v15" tabindex="-1" data-modal-card>
        <header><p class="eyebrow">Displayed Correction</p><h2 id="correction-remove-title-v15" tabindex="-1">Remove displayed Correction?</h2></header>
        <p id="correction-remove-copy-v15">The selected source revision will be displayed again. This Correction remains retained as historical. The Source Item and source revisions are unchanged.</p>
        <dl class="correction-remove-facts-v15">
          <div><dt>Currently displayed</dt><dd>Correction ${correction.activeRecord?.ordinal || 1}</dd></div>
          <div><dt>Will be displayed</dt><dd>${html(correction.baseRevisionLabel)}</dd></div>
          <div><dt>Retention</dt><dd>Correction remains Historical</dd></div>
        </dl>
        ${disconnected && !failed && !unknown ? `<div id="correction-remove-pre-effect-connection-v15" class="surface-state-row-v10 correction-failure-v15" role="group" aria-labelledby="correction-remove-pre-effect-connection-title-v15" aria-describedby="correction-remove-pre-effect-connection-copy-v15" tabindex="-1"><strong id="correction-remove-pre-effect-connection-title-v15">Connection interrupted</strong><span id="correction-remove-pre-effect-connection-copy-v15">The Correction remains displayed. Nothing was removed.</span></div>` : ""}
        ${failed || unknown ? `<div id="correction-remove-failure-v15" class="surface-state-row-v10 correction-failure-v15" role="group" aria-labelledby="correction-remove-failure-title-v15" aria-describedby="correction-remove-failure-copy-v15" tabindex="-1"><strong id="correction-remove-failure-title-v15">${unknown ? "Removal result unknown" : sourceRaceResultFound ? "Removal result found · source changed" : "Correction not removed"}</strong><span id="correction-remove-failure-copy-v15">${html(correction.failure?.message || CORRECTION_COPY_V15.removeFailure)}</span></div>` : ""}
        ${working ? `<p id="correction-remove-status-v15" class="surface-state-row-v10 correction-operation-v15" role="group" aria-label="${reconciling ? CORRECTION_COPY_V15.checkingRemove : "Removing displayed Correction"}" aria-busy="true" tabindex="-1">${reconciling ? `${CORRECTION_COPY_V15.checkingRemove}…` : "Removing displayed Correction…"}</p>` : ""}
        <p id="correction-remove-boundary-v15" class="correction-boundary-v15">${html(CORRECTION_PROTOTYPE_DISCLOSURE_V15)}</p>
        <footer class="modal-actions correction-remove-actions-v15">
          <button type="button" class="secondary-button" data-action="keep-displayed-correction" ${dismissalLocked ? "disabled" : ""}>Keep Correction</button>
          ${!baseRace && disconnected ? renderShellActionV10("check-shell-connection", checkingConnection ? "Checking connection…" : "Check connection", { disabled: checkingConnection || reboundPending }) : ""}
          ${baseRace
            ? `<button type="button" class="primary-button" data-action="review-correction-source-update" ${reboundPending ? "disabled" : ""}>Review source update</button>`
            : failed || unknown
              ? correction.retryTarget ? `<button type="button" class="primary-button" data-action="retry-remove-correction" ${working || checkingConnection || reboundPending ? "disabled" : ""}>${unknown ? "Check removal status" : "Retry removing"}</button>` : ""
              : `<button type="button" class="danger-button-v15" data-action="confirm-remove-correction" ${removing ? 'aria-label="Removing displayed Correction"' : ""} ${working || disconnected || reboundPending ? "disabled" : ""}>${removing ? "Removing displayed Correction…" : "Remove displayed Correction"}</button>`}
        </footer>
      </section>
    </div>`;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal.type === "source-conflict-preview-v16") return renderSourceConflictPreviewV16();
  if (state.modal.type === "leave-source-conflict-v16") return renderSourceConflictLeaveV16();
  if (state.modal.type === "date-review-picker") return renderDateReviewPicker();
  if (state.modal.type === "correction-v10") return renderCorrectionSheetV10();
  if (state.modal.type === "leave-correction-v10") return renderLeaveConfirmV10();
  if (state.modal.type === "remove-correction-v15") return renderRemoveCorrectionV15();
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
  invalidateNavigationFocusV13();
  uploadFocusEpochV14 += 1;
  const correctionFocusEpoch = ++correctionFocusEpochV15;
  const sourceConflictFocusEpoch = ++sourceConflictFocusEpochV16;
  viewScrollRestoreEpochV13 += 1;
  const liveUploadCard = state.modal?.type === "upload"
    ? modalRoot.querySelector("#upload-modal-card-v14")
    : null;
  if (liveUploadCard) {
    state.modal.cardScrollTop = state.modal.cardScrollStage === state.upload.stage
      ? liveUploadCard.scrollTop
      : 0;
  }
  const correctionModalWasOpen = ["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type);
  const liveCorrectionCard = correctionModalWasOpen ? modalRoot.querySelector("[data-modal-card]") : null;
  const liveCorrectionCardMatchesModal = Boolean(liveCorrectionCard) && (
    (state.modal.type === "correction-v10" && liveCorrectionCard.matches(".correction-sheet-v15"))
    || (state.modal.type === "leave-correction-v10" && liveCorrectionCard.matches(".leave-confirm-v10"))
    || (state.modal.type === "remove-correction-v15" && liveCorrectionCard.matches(".correction-remove-v15"))
  );
  if (liveCorrectionCardMatchesModal && !state.modal.restoreCardScrollAfterFocus) state.modal.cardScrollTop = liveCorrectionCard.scrollTop;
  const liveCorrectionBody = state.modal?.type === "correction-v10"
    ? modalRoot.querySelector(".correction-sheet-body-v15")
    : null;
  if (liveCorrectionBody && !state.modal.restoreBodyScrollAfterFocus) {
    state.modal.bodyScrollTop = liveCorrectionBody.scrollTop;
  }
  const activeBeforeCorrectionRender = correctionModalWasOpen ? document.activeElement : null;
  const correctionFocusSelectorBeforeRender = activeBeforeCorrectionRender?.matches?.("[data-modal-card]")
    ? "[data-modal-card]"
    : activeBeforeCorrectionRender?.id
      ? `#${CSS.escape(activeBeforeCorrectionRender.id)}`
      : selectorForLogicalFocus(activeBeforeCorrectionRender);
  const liveSearchInput = root.querySelector("#archive-search-input-v9");
  if (liveSearchInput) state.searchDraft = liveSearchInput.value;
  const liveCorrection = modalRoot.querySelector("#correction-draft-v10");
  if (liveCorrection && state.modal?.type === "correction-v10" && !state.modal.restoreEditorScrollAfterFocus) {
    state.modal.editorScrollTop = liveCorrection.scrollTop;
  }
  if (liveCorrection && document.activeElement === liveCorrection && state.shell.correction.open && !["saving", "saved"].includes(state.shell.correction.status)) {
    const editorIncarnation = correctionEditorIncarnationsV15.get(liveCorrection);
    const liveSelection = { start: liveCorrection.selectionStart, end: liveCorrection.selectionEnd, direction: liveCorrection.selectionDirection };
    if (liveCorrection.value !== state.shell.correction.draft) {
      dispatchShell("CORRECTION_INPUT", { draft: liveCorrection.value, selection: liveSelection, editorIncarnation });
    } else {
      dispatchShell("CORRECTION_SELECTION", { selection: liveSelection, editorIncarnation });
    }
  }
  const liveSourceConflictDraft = root.querySelector("#source-conflict-draft-v16");
  const liveSourceConflictEditorIncarnation = liveSourceConflictDraft
    ? sourceConflictEditorIncarnationsV16.get(liveSourceConflictDraft)
    : null;
  if (liveSourceConflictDraft
    && liveSourceConflictEditorIncarnation === state.sourceConflict.editorIncarnation
    && ["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(state.sourceConflict.stage)) {
    const liveSelection = { start: liveSourceConflictDraft.selectionStart, end: liveSourceConflictDraft.selectionEnd, direction: liveSourceConflictDraft.selectionDirection };
    if (liveSourceConflictDraft.value !== state.sourceConflict.draft) {
      dispatchSourceConflictV16("DRAFT_INPUT", { draft: liveSourceConflictDraft.value, selection: liveSelection, scrollTop: liveSourceConflictDraft.scrollTop, editorIncarnation: liveSourceConflictEditorIncarnation });
    } else dispatchSourceConflictV16("SELECTION", { selection: liveSelection, scrollTop: liveSourceConflictDraft.scrollTop, editorIncarnation: liveSourceConflictEditorIncarnation });
  }
  document.documentElement.dataset.theme = resolvedTheme();
  if (state.view !== "calendar") calendarStatusLive.textContent = "";
  if (state.view !== "telegram-capture") captureStatusLiveV13.textContent = "";
  root.innerHTML = renderUnifiedApp();
  let renderedSourceConflictDraft = root.querySelector("#source-conflict-draft-v16");
  const preserveSourceConflictEditor = Boolean(liveSourceConflictDraft)
    && Boolean(renderedSourceConflictDraft)
    && liveSourceConflictEditorIncarnation === state.sourceConflict.editorIncarnation
    && ["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(state.sourceConflict.stage);
  if (preserveSourceConflictEditor) {
    renderedSourceConflictDraft.replaceWith(liveSourceConflictDraft);
    renderedSourceConflictDraft = liveSourceConflictDraft;
  }
  if (renderedSourceConflictDraft && state.sourceConflict.editorIncarnation) {
    sourceConflictEditorIncarnationsV16.set(renderedSourceConflictDraft, state.sourceConflict.editorIncarnation);
  }
  if (renderedSourceConflictDraft && state.sourceConflict.draftSelection) {
    const { start, end, direction } = state.sourceConflict.draftSelection;
    renderedSourceConflictDraft.setSelectionRange(start, end, direction);
    renderedSourceConflictDraft.scrollTop = state.sourceConflict.draftScrollTop || 0;
  }
  const nextModalMarkup = renderModal();
  const preservedCorrectionEditor = state.modal?.type === "correction-v10"
    && liveCorrection
    && correctionEditorIncarnationsV15.get(liveCorrection) === state.shell.correction.editorIncarnation
    && reconcileCorrectionEditorDomV15(liveCorrection, nextModalMarkup);
  if (!preservedCorrectionEditor) modalRoot.innerHTML = nextModalMarkup;
  if (state.modal?.type === "upload" && Number.isFinite(state.modal.cardScrollTop)) {
    const uploadCard = modalRoot.querySelector("#upload-modal-card-v14");
    if (uploadCard) uploadCard.scrollTop = state.modal.cardScrollTop;
    state.modal.cardScrollStage = state.upload.stage;
  }
  if (["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type) && Number.isFinite(state.modal.cardScrollTop)) {
    const correctionCard = modalRoot.querySelector("[data-modal-card]");
    if (correctionCard) correctionCard.scrollTop = state.modal.cardScrollTop;
  }
  if (state.modal?.type === "correction-v10" && Number.isFinite(state.modal.bodyScrollTop)) {
    const correctionBody = modalRoot.querySelector(".correction-sheet-body-v15");
    if (correctionBody) correctionBody.scrollTop = state.modal.bodyScrollTop;
  }
  const renderedCorrection = modalRoot.querySelector("#correction-draft-v10");
  if (renderedCorrection && state.shell.correction.editorIncarnation) {
    correctionEditorIncarnationsV15.set(renderedCorrection, state.shell.correction.editorIncarnation);
  }
  if (renderedCorrection && state.shell.correction.selection) {
    const { start, end, direction } = state.shell.correction.selection;
    renderedCorrection.setSelectionRange(start, end, direction);
  }
  if (renderedCorrection && Number.isFinite(state.modal?.editorScrollTop)) {
    renderedCorrection.scrollTop = state.modal.editorScrollTop;
  }
  const appRootUnavailable = Boolean(state.modal || pendingCorrectionCloseTraversalV15);
  const sessionGateOwnsUi = ["session-expired", "reauth"].includes(state.shell.phase)
    || state.sourceConflict.stage === "session-ended";
  root.inert = appRootUnavailable;
  if (appRootUnavailable) root.setAttribute("aria-hidden", "true");
  else root.removeAttribute("aria-hidden");
  const prototypeBanner = root.querySelector(".prototype-banner");
  if (prototypeBanner) {
    prototypeBanner.inert = sessionGateOwnsUi;
    if (sessionGateOwnsUi) prototypeBanner.setAttribute("aria-hidden", "true");
    else prototypeBanner.removeAttribute("aria-hidden");
  }
  const skipLink = document.querySelector('.skip-link[href="#prototype-main"]');
  if (skipLink) {
    const skipLinkUnavailable = appRootUnavailable || sessionGateOwnsUi;
    skipLink.inert = skipLinkUnavailable;
    if (skipLinkUnavailable) skipLink.setAttribute("aria-hidden", "true");
    else skipLink.removeAttribute("aria-hidden");
  }
  modalRoot.inert = Boolean(pendingCorrectionCloseTraversalV15);
  if (pendingCorrectionCloseTraversalV15) modalRoot.setAttribute("aria-hidden", "true");
  else modalRoot.removeAttribute("aria-hidden");

  const calendarColumn = root.querySelector(".mosaic-calendar-column");
  const selectedDayIsModal = calendarSelectionSheetQuery.matches && state.view === "calendar" && state.screen === "month" && Boolean(state.selectedDate);
  if (calendarColumn) {
    calendarColumn.inert = selectedDayIsModal;
    if (selectedDayIsModal) calendarColumn.setAttribute("aria-hidden", "true");
    else calendarColumn.removeAttribute("aria-hidden");
  }

  const uploadGuardOwnsFocus = state.modal?.type === "upload" && state.modal.focusSelector === null;
  const correctionModalIsOpen = ["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type);
  const explicitCorrectionFocusSelector = correctionModalIsOpen ? state.modal.focusSelector : null;
  const explicitCorrectionFocusTarget = explicitCorrectionFocusSelector
    ? resolveLogicalSelector(explicitCorrectionFocusSelector)
    : null;
  const pendingCorrectionFocusSelector = correctionModalIsOpen ? state.modal.pendingFocusSelectorV15 : null;
  const correctionFocusWasUnclaimedBeforeRender = !activeBeforeCorrectionRender
    || !activeBeforeCorrectionRender.isConnected
    || activeBeforeCorrectionRender === document.body
    || activeBeforeCorrectionRender === document.documentElement
    || activeBeforeCorrectionRender === root
    || activeBeforeCorrectionRender === modalRoot;
  const pendingCorrectionFocusTarget = correctionFocusWasUnclaimedBeforeRender && pendingCorrectionFocusSelector
    ? resolveLogicalSelector(pendingCorrectionFocusSelector)
    : null;
  const correctionEditorRestorePending = state.modal?.type === "correction-v10"
    && Boolean(state.modal.restoreEditorScrollAfterFocus
      || state.modal.restoreBodyScrollAfterFocus
      || state.modal.restoreCardScrollAfterFocus);
  const correctionStateFallbackSelector = (() => {
    const correction = state.shell.correction;
    if (state.modal?.type === "correction-v10") {
      if (["saving", "reconciling"].includes(correction.status)) return "#correction-operation-status-v10";
      if (correction.status === "unknown") return correction.retryTarget
        ? '[data-action="retry-shell-correction"]'
        : "#correction-save-failure-v10";
      if (correction.status === "failed") return "#correction-save-failure-v10";
      if (correction.status === "saved") return "#correction-success-v15";
      if (state.shell.connection !== "connected" && correction.dirty) return "#correction-pre-effect-connection-v15";
      return "#correction-title-v15";
    }
    if (state.modal?.type === "leave-correction-v10") return '[data-action="keep-shell-correction"]';
    if (state.modal?.type === "remove-correction-v15") {
      if (["removing", "remove-reconciling"].includes(correction.status)) return "#correction-remove-status-v15";
      if (correction.status === "remove-unknown") return correction.retryTarget
        ? '[data-action="retry-remove-correction"]'
        : "#correction-remove-failure-v15";
      if (correction.status === "remove-failed") return "#correction-remove-failure-v15";
      if (state.shell.connection !== "connected") return "#correction-remove-pre-effect-connection-v15";
      return "#correction-remove-title-v15";
    }
    return "[data-modal-card]";
  })();
  const correctionModalFallbackSelector = state.modal?.type === "correction-v10"
    ? correctionEditorRestorePending ? "#correction-draft-v10" : correctionStateFallbackSelector
    : correctionStateFallbackSelector;
  const correctionFocusSelector = correctionModalIsOpen
    ? explicitCorrectionFocusTarget
      ? explicitCorrectionFocusSelector
      : pendingCorrectionFocusTarget
        ? pendingCorrectionFocusSelector
        : correctionFocusSelectorBeforeRender && resolveLogicalSelector(correctionFocusSelectorBeforeRender)
          ? correctionFocusSelectorBeforeRender
          : correctionModalFallbackSelector
    : null;
  const focusTarget = state.modal
    ? uploadGuardOwnsFocus ? null : resolveLogicalSelector(correctionFocusSelector || state.modal.focusSelector || "[data-modal-card]")
    : state.focusAfterRender
      ? state.view === "source-conflict"
        ? resolveSourceConflictFocusTargetV16(state.focusAfterRender)
        : resolveLogicalSelector(state.focusAfterRender)
      : null;
  const sourceConflictOwnsFocus = state.view === "source-conflict"
    || ["source-conflict-preview-v16", "leave-source-conflict-v16"].includes(state.modal?.type)
    || Boolean(focusTarget?.id?.startsWith("source-conflict-"))
    || Boolean(focusTarget?.matches?.('[data-action*="source-conflict"]'));
  const consumeCorrectionScrollRestoreV15 = () => {
    if (state.modal?.type !== "correction-v10") return;
    state.modal.restoreEditorScrollAfterFocus = false;
    state.modal.restoreBodyScrollAfterFocus = false;
    state.modal.restoreCardScrollAfterFocus = false;
    state.modal.restoredLeaveFocusSelector = null;
  };
  if (state.modal?.type === "correction-v10" && focusTarget?.id !== "correction-draft-v10") {
    // The new DOM already received the held offsets above. If a connection or
    // result render supersedes Keep editing before its textarea rAF, consume
    // the one-shot restoration here so later input cannot replay stale scroll.
    consumeCorrectionScrollRestoreV15();
  }
  if (correctionModalIsOpen && focusTarget) state.modal.pendingFocusSelectorV15 = correctionFocusSelector;
  const clearPendingCorrectionFocusV15 = () => {
    if (state.modal?.pendingFocusSelectorV15 === correctionFocusSelector) state.modal.pendingFocusSelectorV15 = null;
  };
  state.focusAfterRender = null;
  if (state.modal) state.modal.focusSelector = null;
  if (focusTarget) requestAnimationFrame(() => {
    if (sourceConflictOwnsFocus && sourceConflictFocusEpoch !== sourceConflictFocusEpochV16) return;
    if (correctionModalIsOpen) {
      if (correctionFocusEpoch !== correctionFocusEpochV15 || !["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type)) return;
      const active = document.activeElement;
      const focusIsUnclaimed = !active
        || !active.isConnected
        || active === document.body
        || active === document.documentElement
        || active === root
        || active === modalRoot
        || active === focusTarget;
      if (!focusIsUnclaimed) {
        consumeCorrectionScrollRestoreV15();
        clearPendingCorrectionFocusV15();
        return;
      }
    }
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
      requestAnimationFrame(() => {
        if (correctionFocusEpoch !== correctionFocusEpochV15
          || state.modal?.type !== "correction-v10"
          || focusTarget !== modalRoot.querySelector("#correction-draft-v10")) return;
        const claimedModalFocus = modalRoot.contains(document.activeElement)
          && document.activeElement !== focusTarget;
        if (claimedModalFocus) {
          consumeCorrectionScrollRestoreV15();
          clearPendingCorrectionFocusV15();
          return;
        }
        const card = modalRoot.querySelector("[data-modal-card]");
        const scrollContainer = modalRoot.querySelector(".correction-sheet-body-v15") || card;
        let restoredExactCorrectionScroll = false;
        if (state.modal?.restoreEditorScrollAfterFocus) {
          focusTarget.scrollTop = Number(state.modal.editorScrollTop) || 0;
          state.modal.restoreEditorScrollAfterFocus = false;
          restoredExactCorrectionScroll = true;
        }
        if (state.modal?.restoreBodyScrollAfterFocus && scrollContainer) {
          scrollContainer.scrollTop = Number(state.modal.bodyScrollTop) || 0;
          state.modal.restoreBodyScrollAfterFocus = false;
          restoredExactCorrectionScroll = true;
        }
        if (state.modal?.restoreCardScrollAfterFocus && card) {
          card.scrollTop = Number(state.modal.cardScrollTop) || 0;
          state.modal.restoreCardScrollAfterFocus = false;
          restoredExactCorrectionScroll = true;
        }
        const cardRect = scrollContainer?.getBoundingClientRect();
        const editorRect = focusTarget.getBoundingClientRect();
        const editorOutsideVisibleScrollAperture = Boolean(cardRect)
          && (editorRect.top < cardRect.top || editorRect.bottom > cardRect.bottom);
        if (restoredExactCorrectionScroll && editorOutsideVisibleScrollAperture) {
          const preferredReturnSelector = state.modal.restoredLeaveFocusSelector;
          state.modal.restoredLeaveFocusSelector = null;
          const preferredReturn = preferredReturnSelector && preferredReturnSelector !== "#correction-draft-v10"
            ? resolveLogicalSelector(preferredReturnSelector)
            : null;
          const visibleWithinModal = (element) => {
            if (!element?.getClientRects().length) return false;
            const elementRect = element.getBoundingClientRect();
            const elementScrollContainer = element.closest(".correction-sheet-body-v15");
            const visibleRect = (elementScrollContainer || card)?.getBoundingClientRect();
            return !visibleRect || (
              elementRect.top >= visibleRect.top
              && elementRect.bottom <= visibleRect.bottom
              && elementRect.left >= visibleRect.left
              && elementRect.right <= visibleRect.right
            );
          };
          const visibleReturn = visibleWithinModal(preferredReturn)
            ? preferredReturn
            : resolveLogicalSelector('[data-action="cancel-shell-correction"]');
          visibleReturn?.focus({ preventScroll: true });
        } else {
          state.modal.restoredLeaveFocusSelector = null;
        }
        if (!restoredExactCorrectionScroll && editorOutsideVisibleScrollAperture) {
          withInstantScroll(() => focusTarget.scrollIntoView({ behavior: "auto", block: "nearest" }));
        }
      });
    }
    if (state.modal?.scrollY != null) withInstantScroll(() => window.scrollTo({ top: state.modal.scrollY, behavior: "auto" }));
  });

  if (["session-expired", "reauth"].includes(state.shell.phase) && !focusTarget) {
    const sessionFocusEpoch = correctionFocusEpoch;
    const sessionFocusPhase = state.shell.phase;
    requestAnimationFrame(() => {
      if (correctionFocusEpochV15 !== sessionFocusEpoch || state.shell.phase !== sessionFocusPhase) return;
      const active = document.activeElement;
      const focusIsUnclaimed = !active
        || !active.isConnected
        || active === document.body
        || active === document.documentElement
        || active === root;
      if (focusIsUnclaimed) root.querySelector("#session-gate-title-v10")?.focus({ preventScroll: true });
    });
  }

  const shouldPositionAlmanacChapter = state.pendingChapterScroll && state.view === "almanac";
  const pendingAlmanacDestination = state.view === "almanac" && state.screen === "month"
    ? state.almanacPendingDestination
    : null;
  const almanacRenderEpoch = viewScrollRestoreEpochV13;
  const almanacRenderEntryId = window.history.state?.entryId;
  const almanacRenderIsCurrent = () => viewScrollRestoreEpochV13 === almanacRenderEpoch
    && state.view === "almanac"
    && state.screen === "month"
    && window.history.state?.entryId === almanacRenderEntryId;

  if (shouldPositionAlmanacChapter) {
    state.pendingChapterScroll = false;
    requestAnimationFrame(() => {
      if (!almanacRenderIsCurrent()) return;
      const chapter = root.querySelector(`#chapter-${CSS.escape(uploadDayDomTokenV14(state.selectedDate))}`);
      scrollElementIntoViewInstant(chapter);
      chapter?.focus({ preventScroll: true });
      syncUrl({ scrollY: window.scrollY });
      requestAnimationFrame(() => {
        if (almanacRenderIsCurrent()) updateAlmanacViewportState();
      });
    });
  }

  if (pendingAlmanacDestination) {
    const destination = pendingAlmanacDestination;
    state.almanacPendingDestination = null;
    requestAnimationFrame(() => {
      if (!almanacRenderIsCurrent()) return;
      const target = root.querySelector(destination.selector);
      scrollElementIntoViewInstant(target);
      target?.focus({ preventScroll: true });
      if (destination.announcement) announceAlmanac(destination.announcement);
      syncUrl({ scrollY: window.scrollY });
      state.viewMemory.almanac = captureViewMemory("almanac");
      state.almanacReadingAnchor = captureAlmanacReadingAnchor();
      requestAnimationFrame(() => {
        if (almanacRenderIsCurrent()) updateAlmanacViewportState();
      });
    });
  }
  if (state.view === "almanac" && state.screen === "month" && !shouldPositionAlmanacChapter && !pendingAlmanacDestination && !state.almanacRestoringHistory) {
    requestAnimationFrame(() => {
      if (almanacRenderIsCurrent()) updateAlmanacViewportState();
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

function clearShellBoundaryTransientsV10() {
  liveAnnouncementEpochV10 += 1;
  sourceConflictFocusEpochV16 += 1;
  clearSourceConflictReplayLedgerV16();
  clearTimeout(toastTimer);
  toastRegion.innerHTML = "";
  calendarStatusLive.textContent = "";
  almanacStatusLive.textContent = "";
  shellStatusLive.textContent = "";
  correctionStatusLiveV15.textContent = "";
  clearDateReviewAnnouncementV11();
  clearCaptureAnnouncementV13();
  clearUploadAnnouncementV14();
  clearSourceConflictAnnouncementV16();
  pendingLeaveNavigation = null;
  pendingPopGuard = null;
  suppressGuardedPopstate = false;
  pendingCorrectionPopstateReboundV15 = null;
  clearPendingCorrectionCloseTraversalV15();
  deferredCorrectionCallbacksV15.length = 0;
}

function canonicalRouteUrl({ entryId = window.history.state?.entryId } = {}) {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("view", state.view);
  if (["date-review", "telegram-capture", "source-conflict"].includes(state.view)) return url;
  url.searchParams.set("month", state.month);
  if (state.view === "almanac" && state.almanacThrough !== state.almanacMonth) url.searchParams.set("through", state.almanacThrough);
  else url.searchParams.delete("through");
  const opaqueCaptureDay = ["calendar", "almanac"].includes(state.view)
    && captureDayHistoryTargetsV13.get(entryId) === state.selectedDate;
  const opaqueSourceConflictReturn = sourceConflictReturnTargetMatchesStateV16(sourceConflictReturnTargetsV16.get(entryId));
  const opaquePrivateDay = opaqueCaptureDay || opaqueSourceConflictReturn;
  if (["calendar", "almanac"].includes(state.view) && state.selectedDate && !opaquePrivateDay) url.searchParams.set("date", state.selectedDate);
  else url.searchParams.delete("date");
  if (["calendar", "almanac"].includes(state.view) && state.screen === "day" && !opaquePrivateDay) url.searchParams.set("screen", "day");
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

function ensureHistoryEntry({ sourceConflictReturnTarget = null } = {}) {
  const currentId = window.history.state?.entryId;
  if (currentId && historyEntries.has(currentId)) {
    if (!historyPositions.has(currentId)) historyPositions.set(currentId, currentHistoryPosition);
    if (state.view === "source-conflict") sourceConflictWorkbenchHistoryEntryIdV16 = currentId;
    return currentId;
  }
  const entryId = nextHistoryEntryId();
  const normalizedSourceConflictReturnTarget = normalizeSourceConflictReturnTargetV16(sourceConflictReturnTarget);
  if (sourceConflictReturnTargetMatchesStateV16(normalizedSourceConflictReturnTarget)) {
    sourceConflictReturnTargetsV16.set(entryId, normalizedSourceConflictReturnTarget);
  }
  historyEntries.set(entryId, {});
  historyPositions.set(entryId, currentHistoryPosition);
  window.history.replaceState({ entryId }, "", canonicalRouteUrl({ entryId }));
  if (state.view === "source-conflict") sourceConflictWorkbenchHistoryEntryIdV16 = entryId;
  return entryId;
}

function syncLiveSearchDraft() {
  const input = root.querySelector("#archive-search-input-v9");
  if (input) state.searchDraft = input.value;
}

function captureHistorySnapshot(overrides = {}, priorSnapshot = currentHistorySnapshot() || {}) {
  syncLiveSearchDraft();
  const focusElement = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
  if (state.view === "source-conflict") {
    return {
      scrollY: overrides.scrollY ?? window.scrollY,
      focusSelector: "#source-conflict-title-v16",
      focusTop: null,
    };
  }
  const requestedFocusSelector = overrides.focusSelector !== undefined
    ? overrides.focusSelector
    : selectorForLogicalFocus(focusElement);
  const focusSelector = requestedFocusSelector;
  const focusTop = overrides.focusTop !== undefined
    ? overrides.focusTop
    : focusElement?.getBoundingClientRect?.().top ?? null;
  const prior = priorSnapshot;
  const {
    almanacEmptyArchive: _priorAlmanacEmptyArchive,
    uploadModalSnapshotV14: _priorUploadModalSnapshotV14,
    uploadModalEnvelopeV14: _priorUploadModalEnvelopeV14,
    ...safePrior
  } = prior;
  const uploadModalSnapshot = state.modal?.type === "upload"
    ? {
        uploadModalSnapshotV14: structuredClone(state.upload),
        uploadModalEnvelopeV14: {
          returnFocusSelector: state.modal.returnFocusSelector || null,
          scrollY: Number(state.modal.scrollY) || 0,
          cardScrollTop: Number(modalRoot.querySelector("#upload-modal-card-v14")?.scrollTop ?? state.modal.cardScrollTop) || 0,
        },
      }
    : {};
  return {
    ...safePrior,
    ...uploadModalSnapshot,
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
  const currentEntryId = ensureHistoryEntry();
  const modalEntryId = state.modal?.type === "upload" ? state.modal.historyEntryId : null;
  const entryId = modalEntryId && historyEntries.has(modalEntryId) ? modalEntryId : currentEntryId;
  const snapshot = sourceConflictSafeHistorySnapshotV16(
    entryId,
    captureHistorySnapshot(overrides, historyEntries.get(entryId) || {}),
  );
  historyEntries.set(entryId, snapshot);
  return snapshot;
}

function syncUrl({ push = false, selectionOpenedInApp, fullDayOpenedInApp, captureDayDate, captureDayPhotoId, sourceConflictReturnTarget, scrollY, focusSelector, focusTop, originAlreadySaved = false } = {}) {
  const previous = currentHistorySnapshot() || {};
  const previousEntryId = window.history.state?.entryId;
  const previousCaptureDayDate = captureDayHistoryTargetsV13.get(previousEntryId);
  const hasExplicitSourceConflictReturnTarget = sourceConflictReturnTarget !== undefined;
  const normalizedSourceConflictReturnTarget = normalizeSourceConflictReturnTargetV16(sourceConflictReturnTarget);
  const snapshotOverrides = { scrollY, focusSelector, focusTop };
  if (selectionOpenedInApp !== undefined) snapshotOverrides.selectionOpenedInApp = selectionOpenedInApp;
  if (fullDayOpenedInApp !== undefined) snapshotOverrides.fullDayOpenedInApp = fullDayOpenedInApp;

  if (push && !originAlreadySaved) saveCurrentHistorySnapshot();

  const entryId = push
    ? nextHistoryEntryId()
    : ensureHistoryEntry({ sourceConflictReturnTarget: normalizedSourceConflictReturnTarget });
  if (push) currentHistoryPosition += 1;
  const resolvedCaptureDayDate = isDateKey(captureDayDate)
    ? captureDayDate
    : ["calendar", "almanac"].includes(state.view)
      && isDateKey(state.selectedDate)
      && (days[state.selectedDate]?.captureOnlyV13 || days[state.selectedDate]?.uploadOnlyV14 || uploadPrivateDatesV14.has(state.selectedDate) || previousCaptureDayDate === state.selectedDate)
      ? state.selectedDate
      : null;
  const captureDestinationIsVisible = state.selectedDate === resolvedCaptureDayDate
    && ["calendar", "almanac"].includes(state.view);
  const inferredOpaqueSelection = captureDestinationIsVisible
    && state.view === "calendar"
    && state.screen === "month";
  const inferredOpaqueFullDay = captureDestinationIsVisible
    && state.screen === "day";
  if (isDateKey(resolvedCaptureDayDate) && captureDestinationIsVisible) {
    captureDayHistoryTargetsV13.set(entryId, resolvedCaptureDayDate);
    if (captureDayPhotoId !== undefined) {
      if (captureDayPhotoId && days[resolvedCaptureDayDate]?.photos?.some((photo) => photo.id === captureDayPhotoId)) {
        captureDayPhotoTargetsV13.set(entryId, captureDayPhotoId);
      } else captureDayPhotoTargetsV13.delete(entryId);
    }
  } else {
    const mappedDate = captureDayHistoryTargetsV13.get(entryId);
    const mappedDestinationIsVisible = state.selectedDate === mappedDate
      && ["calendar", "almanac"].includes(state.view);
    if (mappedDate && !mappedDestinationIsVisible) {
      captureDayHistoryTargetsV13.delete(entryId);
      captureDayPhotoTargetsV13.delete(entryId);
    }
  }
  if (hasExplicitSourceConflictReturnTarget) {
    if (sourceConflictReturnTargetMatchesStateV16(normalizedSourceConflictReturnTarget)) {
      sourceConflictReturnTargetsV16.set(entryId, normalizedSourceConflictReturnTarget);
    } else sourceConflictReturnTargetsV16.delete(entryId);
  } else {
    const mappedSourceConflictReturnTarget = sourceConflictReturnTargetsV16.get(entryId);
    if (mappedSourceConflictReturnTarget && !sourceConflictReturnTargetMatchesStateV16(mappedSourceConflictReturnTarget)) {
      sourceConflictReturnTargetsV16.delete(entryId);
    }
  }
  const destinationSnapshot = sourceConflictSafeHistorySnapshotV16(entryId, captureHistorySnapshot({
    ...snapshotOverrides,
    selectionOpenedInApp: selectionOpenedInApp
      ?? (captureDestinationIsVisible ? inferredOpaqueSelection : push ? false : previous.selectionOpenedInApp),
    fullDayOpenedInApp: fullDayOpenedInApp
      ?? (captureDestinationIsVisible ? inferredOpaqueFullDay : push ? false : previous.fullDayOpenedInApp),
    focusSelector: focusSelector !== undefined ? focusSelector : state.focusAfterRender || selectorForLogicalFocus(document.activeElement),
    scrollY: scrollY ?? (state.screen === "day" ? 0 : window.scrollY),
  }));
  historyEntries.set(entryId, destinationSnapshot);
  historyPositions.set(entryId, currentHistoryPosition);
  window.history[push ? "pushState" : "replaceState"]({ entryId }, "", canonicalRouteUrl({ entryId }));
  if (state.view === "source-conflict") sourceConflictWorkbenchHistoryEntryIdV16 = entryId;
  else if (!pendingSourceConflictPopReboundV16) sourceConflictWorkbenchHistoryEntryIdV16 = null;
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
  else if (focusTarget === "calendar-cell" && state.view === "calendar") state.focusAfterRender = `[data-calendar-date="${uploadDayDomTokenV14(state.focusDate)}"]`;
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

function handleCaptureSkipLinkV13(event) {
  const skipLink = event.target.closest?.('.skip-link[href="#prototype-main"]');
  if (skipLink && (state.modal || pendingCorrectionCloseTraversalV15 || ["session-expired", "reauth"].includes(state.shell.phase))) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (pendingCorrectionCloseTraversalV15) {
      announceCorrectionV15("Returning to the Correction origin. Try again after it is restored.", { assertive: true });
    }
    return;
  }
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

function revealCaptureFailureOutcomeV13({
  expectedGeneration = state.capture.generation,
  expectedTerminalType = state.capture.terminal?.type,
  expectedEntryId = window.history.state?.entryId,
} = {}) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (state.view !== "telegram-capture" || ["session-expired", "reauth"].includes(state.shell.phase)) return;
    if (state.capture.surface !== "companion"
      || state.capture.generation !== expectedGeneration
      || state.capture.terminal?.type !== expectedTerminalType
      || window.history.state?.entryId !== expectedEntryId) return;
    const selector = "#capture-outcome-title-v14";
    const target = root.querySelector(selector);
    if (!target?.getClientRects().length) return;

    const active = document.activeElement;
    const focusIsUnclaimed = !active
      || active === document.body
      || active === document.documentElement
      || active === root
      || active === target;
    if (!focusIsUnclaimed) return;

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

function renderCaptureOutcomeWithGuardedFocusV13(originSelectors = []) {
  const activeSelector = selectorForLogicalFocus(document.activeElement);
  const preserveSelector = activeSelector && !originSelectors.includes(activeSelector)
    ? activeSelector
    : null;
  state.focusAfterRender = null;
  render();
  const guardedSelector = preserveSelector && resolveLogicalSelector(preserveSelector)
    ? preserveSelector
    : "#capture-outcome-title-v14";
  reinforceNavigationFocusV13(guardedSelector, "telegram-capture", "companion");
  revealCaptureFailureOutcomeV13();
}

function renderCaptureStageWithGuardedFocusV13(fallbackSelector = '[data-action="capture-run"]') {
  const activeBeforeRender = document.activeElement;
  const focusWasUnclaimed = !activeBeforeRender
    || activeBeforeRender === document.body
    || activeBeforeRender === document.documentElement
    || activeBeforeRender === root;
  const activeSelector = selectorForLogicalFocus(activeBeforeRender);
  state.focusAfterRender = null;
  render();
  const activeSelectorSurvives = activeSelector && resolveLogicalSelector(activeSelector);
  const activeSelectorWasRemoved = Boolean(activeSelector && !activeSelectorSurvives);
  const guardedSelector = activeSelectorSurvives
    ? activeSelector
    : focusWasUnclaimed || activeSelectorWasRemoved ? fallbackSelector : null;
  if (guardedSelector && resolveLogicalSelector(guardedSelector)) {
    reinforceNavigationFocusV13(guardedSelector, "telegram-capture", "companion");
  }
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
  const restoreEpoch = ++viewScrollRestoreEpochV13;
  const expectedEntryId = window.history.state?.entryId;
  const restorationIsCurrent = () => viewScrollRestoreEpochV13 === restoreEpoch
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
      if (anchor) {
        const active = document.activeElement;
        const focusIsUnclaimed = !active
          || active === document.body
          || active === document.documentElement
          || active === root
          || active === modalRoot
          || active === anchor;
        if (focusIsUnclaimed) anchor.focus({ preventScroll: true });
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
  const logicalFocusSelector = selectorForLogicalFocus(focusElement);
  const activeEntryId = window.history.state?.entryId;
  const mappedCaptureDayDate = ["calendar", "almanac"].includes(view)
    && captureDayHistoryTargetsV13.get(activeEntryId) === state.selectedDate
    ? state.selectedDate
    : null;
  const mappedCaptureDayPhotoId = mappedCaptureDayDate
    ? captureDayPhotoTargetsV13.get(activeEntryId) || null
    : null;
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
        ? logicalFocusSelector || (state.capture.surface === "change-date" ? "#capture-change-title-v14" : "#capture-title-v14")
        : logicalFocusSelector,
    focusTop: view === "date-review" ? null : focusElement?.getBoundingClientRect?.().top ?? null,
    searchQuery: state.searchQuery,
    searchDraft: state.searchDraft,
    settingsSection: state.settingsSection,
    dateReviewDetailKey: null,
    captureSurface: view === "telegram-capture" ? state.capture.surface : "companion",
    // Private duplicate handoff provenance remains live-memory-only. It lets
    // an exact Calendar/Almanac surface stay opaque when restored after an
    // intervening Search or Settings entry; browser history still stores only
    // its opaque entryId.
    captureDayDate: mappedCaptureDayDate,
    captureDayPhotoId: mappedCaptureDayPhotoId,
  };
}

function captureAlmanacReadingAnchor() {
  if (state.view !== "almanac" || state.screen !== "month") return null;
  const isVisible = (chapter) => {
    if (!chapter) return false;
    const rect = chapter.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };
  const selected = state.selectedDate ? root.querySelector(`#chapter-${CSS.escape(uploadDayDomTokenV14(state.selectedDate))}`) : null;
  const current = root.querySelector("[data-chapter-date].is-current");
  const chapter = [selected, current, ...root.querySelectorAll("[data-chapter-date]")].find(isVisible);
  if (!chapter?.dataset.chapterDate) return null;
  return {
    date: resolveUploadDayDomTokenV14(chapter.dataset.chapterDate),
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
  const restoreToken = beginAlmanacRestorationV13();
  let restoreEpoch = null;
  let expectedEntryId = null;
  const restorationIsCurrent = () => almanacRestoreTokenV13 === restoreToken
    && viewScrollRestoreEpochV13 === restoreEpoch
    && state.view === "almanac"
    && state.screen === "month"
    && !["session-expired", "reauth"].includes(state.shell.phase)
    && window.history.state?.entryId === expectedEntryId;
  const finishRestoration = () => {
    finishAlmanacRestorationV13(restoreToken);
  };
  const restore = () => {
    if (!restorationIsCurrent()) return;
    withInstantScroll(() => window.scrollTo({ top: anchor.scrollY, behavior: "auto" }));
    const element = root.querySelector(anchor.selector);
    if (element && Number.isFinite(anchor.top)) {
      const delta = element.getBoundingClientRect().top - anchor.top;
      if (Math.abs(delta) > 0.5) withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
    }
  };
  render();
  restoreEpoch = viewScrollRestoreEpochV13;
  expectedEntryId = window.history.state?.entryId;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (restorationIsCurrent()) restore();
  }));
  schedulePrivateArchiveTimeoutV13(() => {
    if (!restorationIsCurrent()) {
      finishRestoration();
      return;
    }
    restore();
    finishRestoration();
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
      ? memory.focusSelector || (state.capture.surface === "change-date" ? "#capture-change-title-v14" : "#capture-title-v14")
      : memory.focusSelector;
  return true;
}

function captureDayLineageForFirstArchiveVisitV13(date) {
  if (!isDateKey(date)) return null;
  return [state.viewMemory.calendar, state.viewMemory.almanac]
    .find((memory) => memory?.captureDayDate === date) || null;
}

function uploadDismissalLockedV14() {
  return state.modal?.type === "upload"
    && (Boolean(pendingUploadPopstateReboundV14) || ["reconciling", "uploading", "saving"].includes(state.upload.stage) || state.upload.resultStatus === "unknown");
}

function uploadLockedExplanationV14(activeMessage) {
  return state.upload.resultStatus === "unknown"
    ? "The previous upload result is unknown. Retry must reconcile it before this dialog can close."
    : activeMessage;
}

function discardUploadDraftForNavigationV14() {
  if (state.modal?.type !== "upload") return;
  const modalEntryId = state.modal.historyEntryId || null;
  clearUploadTimersV14();
  cancelUploadPopstateReboundV14();
  clearUploadAnnouncementV14();
  state.upload = transitionUploadV14(state.upload, "CANCEL");
  state.modal = null;
  scrubUploadHistorySnapshotsV14(modalEntryId);
}

function setView(nextView, { push = true } = {}) {
  if (!allowedViews.has(nextView)) return;
  if (uploadDismissalLockedV14()) {
    announceUploadV14(uploadLockedExplanationV14("Upload in progress. Wait for the represented result before leaving this dialog."));
    return;
  }
  if (state.modal?.type === "upload") discardUploadDraftForNavigationV14();
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
    if (activeControl?.dataset.date) state.almanacReturnFocusDate = resolveUploadDayDomTokenV14(activeControl.dataset.date);
    else if (activeControl?.dataset.action) state.almanacLastFocusAction = activeControl.dataset.action;
  }
  if (previousView === "date-review" && nextView !== previousView) {
    if (state.dateReview.assignment.status === "assigning" || dateReviewTimersV11.size) {
      cancelDateReviewOperationsV11({ preserveFailure: false });
    } else clearDateReviewAnnouncementV11();
  }
  if (previousView === "telegram-capture" && nextView !== previousView) {
    cancelCaptureOperationsV13({ keepTerminal: !state.capture.active, stage: state.capture.active ? "selected" : state.capture.stage });
  }
  state.scrollByView[previousView] = window.scrollY;
  if (previousView === "calendar") state.calendarMonth = state.month;
  if (previousView === "almanac") state.almanacMonth = state.month;
  if (nextView === "search" && ["calendar", "almanac"].includes(previousView)) state.searchReturnView = previousView;
  state.view = nextView;

  const savedView = state.viewMemory[nextView];
  if (savedView) {
    restoreViewMemory(nextView, savedView);
    const restoredCaptureDayDate = ["calendar", "almanac"].includes(nextView)
      && savedView.captureDayDate === state.selectedDate
      ? savedView.captureDayDate
      : undefined;
    syncUrl({
      push,
      originAlreadySaved: push,
      captureDayDate: restoredCaptureDayDate,
      captureDayPhotoId: restoredCaptureDayDate ? savedView.captureDayPhotoId : undefined,
    });
    render();
    const restoredFocus = nextView === "date-review"
      ? "#date-review-title-v11"
      : nextView === "telegram-capture"
        ? savedView.focusSelector || "#capture-title-v14"
        : savedView.focusSelector;
    restoreViewScroll(nextView, savedView.scrollY, restoredFocus, nextView === "date-review" ? null : savedView.focusTop);
    const viewLabels = { calendar: "Calendar", almanac: "Almanac", search: "Search", settings: "Settings", "date-review": "Needs Date Review" };
    if (nextView !== "telegram-capture") toast(nextView === "settings" ? "Settings opened." : nextView === "date-review" ? "Needs Date Review opened." : `${viewLabels[nextView]} view, ${monthLabel(state.month)}.`);
    return;
  }

  const firstArchiveCaptureLineage = ["calendar", "almanac"].includes(nextView)
    ? captureDayLineageForFirstArchiveVisitV13(previousSelectedDate)
    : null;
  const shouldScrollChapter = nextView === "almanac"
    && Boolean(previousView === "calendar" ? state.selectedDate : firstArchiveCaptureLineage?.captureDayDate);
  if (nextView === "calendar") {
    state.month = state.calendarMonth;
    state.selectedDate = previousSelectedDate?.startsWith(`${state.calendarMonth}-`) ? previousSelectedDate : null;
    state.screen = "month";
    state.focusAfterRender = '[data-action="set-view"][data-view="calendar"]';
  } else if (nextView === "almanac") {
    state.month = state.almanacMonth;
    state.screen = "month";
    const almanacAnchor = previousView === "calendar" && previousSelectedDate
      ? previousSelectedDate
      : firstArchiveCaptureLineage?.captureDayDate || state.almanacVisibleDate;
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
      ? `[data-action="open-full-day"][data-date="${uploadDayDomTokenV14(state.almanacReturnFocusDate)}"]`
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
    state.focusAfterRender = "#capture-title-v14";
  } else {
    state.screen = "month";
    state.focusAfterRender = "#settings-section-heading";
  }

  const inheritedCaptureLineage = ["calendar", "almanac"].includes(nextView)
    ? captureDayLineageForFirstArchiveVisitV13(state.selectedDate)
    : null;
  syncUrl({
    push,
    originAlreadySaved: push,
    captureDayDate: inheritedCaptureLineage?.captureDayDate,
    captureDayPhotoId: inheritedCaptureLineage?.captureDayPhotoId,
  });
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
    targetDays.length ? `#chapter-${uploadDayDomTokenV14(targetDays[0].date)}` : `#volume-${targetMonth} h2`,
    targetDays.length ? `Showing ${monthLabel(targetMonth)}.` : `No journaled days in ${monthLabel(targetMonth)}.`,
  );
  syncUrl({
    push,
    originAlreadySaved: push,
    focusSelector: targetDays.length ? `#chapter-${uploadDayDomTokenV14(targetDays[0].date)}` : `#volume-${targetMonth} h2`,
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
  queueAlmanacDestination(`#chapter-${uploadDayDomTokenV14(date)}`, `${longDate(date)} selected in the Almanac.`);
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

  schedulePrivateArchiveTimeoutV13(() => {
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
    voicenotes: { section: "integrations", selector: "#capture-source-a-settings-title-v14" },
    telegram: { section: "integrations", selector: "#capture-source-b-settings-title-v14" },
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
  cancelCaptureOperationsV13();
  state.capture = initialCaptureStateV13((state.capture?.generation || 0) + 1, state.capture?.branch || "success");
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
  state.focusAfterRender = previousDate ? `[data-calendar-date="${uploadDayDomTokenV14(previousDate)}"]` : null;
  syncUrl();
  render();
}

function validateUploadDateV14(rawValue) {
  const value = String(rawValue ?? "");
  const validation = validateDateReviewDate(value);
  if (validation.kind === "blank") return { kind: "blank", message: "Choose a Journal Date before selecting a file." };
  if (validation.kind === "future") return { kind: "future", message: "Future Journal Dates are not supported. Choose today or an earlier date in Asia/Kolkata." };
  return validation;
}

function openUpload(date, returnFocusSelector = null) {
  const inline = isDateKey(date);
  const initialDate = inline ? date : "";
  const nextUpload = transitionUploadV14(state.upload, "OPEN", {
    origin: inline ? "inline" : "global",
    inheritedDate: inline ? date : null,
    date: initialDate,
    validation: validateUploadDateV14(initialDate),
  });
  if (nextUpload === state.upload) return false;
  // A represented upload owns the foreground operation boundary. Invalidate
  // inherited pending work only after OPEN is accepted so an older callback
  // cannot later change global connection/session truth behind this modal.
  cancelShellOpsForNavigationV10();
  clearDateReviewAnnouncementV11();
  clearCaptureAnnouncementV13();
  const connectionWasChecking = state.shell.connection === "checking";
  cancelShellOperations(["connection"]);
  if (connectionWasChecking) dispatchShell("CONNECTION_CHECK_FAIL");
  invalidatePrivateArchiveAsyncWorkV13();
  cancelUploadPopstateReboundV14();
  clearUploadAnnouncementV14();
  const originScrollY = window.scrollY;
  saveCurrentHistorySnapshot({
    scrollY: originScrollY,
    focusSelector: returnFocusSelector,
    focusTop: null,
  });
  state.upload = nextUpload;
  state.modal = {
    type: "upload",
    returnFocusSelector,
    focusSelector: "#upload-modal-title",
    scrollY: originScrollY,
    cardScrollTop: 0,
  };
  const modalEntryId = syncUrl({
    push: true,
    originAlreadySaved: true,
    scrollY: originScrollY,
    focusSelector: "#upload-modal-title",
    focusTop: null,
  });
  state.modal.historyEntryId = modalEntryId;
  render();
  return true;
}

function uploadReturnFocusSelector(control, date) {
  if (state.modal?.type === "more") return '[data-action="open-more"]';
  if (state.modal?.type === "almanac-drawer") return '[data-action="open-almanac-drawer"]';
  if (date) {
    const domDate = ensureUploadDayDomTokenV14(date);
    const chapter = control.closest("[data-chapter-date]");
    if (chapter) return `[data-chapter-date="${domDate}"] [data-action="open-upload"][data-date="${domDate}"]`;
    const sourceSection = control.closest(".sources-section");
    if (sourceSection) return `.sources-section [data-action="open-upload"][data-date="${domDate}"]`;
    const actionsSection = control.closest(".day-actions-section");
    if (actionsSection) return `.day-actions-section [data-action="open-upload"][data-date="${domDate}"]`;
    return `[data-action="open-upload"][data-date="${domDate}"]`;
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
    returnFocusSelector: current?.returnFocusSelector || `[data-action="open-manage-reflection"][data-date="${uploadDayDomTokenV14(date)}"]`,
  };
  render();
}

function closeModal() {
  const modal = state.modal;
  if (modal?.type === "leave-correction-v10") {
    if (pendingPopGuard || pendingCorrectionPopstateReboundV15) {
      announceCorrectionV15("Return to the Correction dialog is still in progress. Try again after it is restored.", { assertive: true });
      return;
    }
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_KEEP");
    state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10", scrollY: modal.scrollY ?? window.scrollY, sourceHandle: modal.sourceHandle, historyEntryId: modal.historyEntryId || null, originHistoryEntryId: modal.originHistoryEntryId || null, cardScrollTop: modal.returnCardScrollTop || 0, bodyScrollTop: modal.returnBodyScrollTop || 0, editorScrollTop: modal.returnEditorScrollTop || 0, restoreCardScrollAfterFocus: true, restoreBodyScrollAfterFocus: true, restoreEditorScrollAfterFocus: true, restoredLeaveFocusSelector: modal.returnEditorFocusSelector || null };
    render();
    return;
  }
  if (modal?.type === "correction-v10") {
    if (pendingPopGuard || pendingCorrectionPopstateReboundV15) {
      announceCorrectionV15("Return to the Correction dialog is still in progress. Try again after it is restored.", { assertive: true });
      return;
    }
    if (correctionHasUnresolvedSourceRaceV15(state.shell.correction)
      || ["saving", "reconciling", "unknown"].includes(state.shell.correction.status)) {
      toast("Resolve the current Correction result before leaving.");
      return;
    }
    if (state.shell.correction.dirty) {
      requestCorrectionLeaveV10("close", { kind: "close" });
      return;
    }
    closeCorrectionModalEntryV15();
    return;
  }
  if (modal?.type === "remove-correction-v15") {
    if (pendingCorrectionPopstateReboundV15) {
      announceCorrectionV15("Return to the Correction dialog is still in progress. Try again after it is restored.", { assertive: true });
      return;
    }
    if (correctionHasUnresolvedSourceRaceV15(state.shell.correction)
      || ["removing", "remove-reconciling", "remove-unknown"].includes(state.shell.correction.status)) {
      toast("Resolve the current removal result before leaving.");
      return;
    }
    cancelShellOperations(["correction"]);
    closeCorrectionModalEntryV15({ announcement: "Correction kept. Display state did not change." });
    return;
  }
  if (modal?.type === "upload") {
    if (uploadDismissalLockedV14()) {
      announceUploadV14(state.upload.resultStatus === "unknown"
        ? "The previous upload result must be reconciled before this dialog can close."
        : "Upload in progress. Wait for the represented result before leaving this dialog.");
      return;
    }
    cancelUploadFlowV14();
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

function scrubUploadHistorySnapshotsV14(targetEntryId = undefined) {
  for (const [entryId, snapshot] of historyEntries) {
    if (targetEntryId !== undefined && entryId !== targetEntryId) continue;
    if (!snapshot?.uploadModalSnapshotV14 && !snapshot?.uploadModalEnvelopeV14) continue;
    const {
      uploadModalSnapshotV14: _uploadModalSnapshotV14,
      uploadModalEnvelopeV14: _uploadModalEnvelopeV14,
      ...safeSnapshot
    } = snapshot;
    historyEntries.set(entryId, safeSnapshot);
  }
}

function cancelUploadFlowV14({ restoreFocus = true } = {}) {
  if (state.modal?.type !== "upload") return;
  if (uploadDismissalLockedV14()) {
    announceUploadV14("The previous upload result must be reconciled before this dialog can close.");
    return;
  }
  const modal = state.modal;
  const currentEntryId = window.history.state?.entryId;
  const closesDedicatedModalEntry = currentHistoryPosition > 0
    && modal.historyEntryId === currentEntryId
    && Boolean(historyEntries.get(currentEntryId)?.uploadModalSnapshotV14);
  clearUploadTimersV14();
  cancelUploadPopstateReboundV14();
  clearUploadAnnouncementV14();
  state.upload = transitionUploadV14(state.upload, "CANCEL");
  state.modal = null;
  scrubUploadHistorySnapshotsV14(modal.historyEntryId || currentEntryId);
  if (restoreFocus && modal.returnFocusSelector) state.focusAfterRender = modal.returnFocusSelector;
  render();
  if (closesDedicatedModalEntry) {
    window.history.back();
    return;
  }
  if (modal.scrollY != null) {
    requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: modal.scrollY, behavior: "auto" })));
  }
}

function viewUploadDayV14() {
  if (state.modal?.type !== "upload" || !["success", "already-completed"].includes(state.upload.stage)) return;
  const result = state.upload.result;
  if (!result || !days[result.date]) return;
  const originEntryId = ensureHistoryEntry();
  const originSnapshot = captureHistorySnapshot({
    scrollY: state.modal.scrollY ?? window.scrollY,
    focusSelector: '[data-action="view-upload-day"]',
    focusTop: null,
  });
  historyEntries.set(originEntryId, originSnapshot);
  state.modal = null;
  state.view = "calendar";
  state.month = result.date.slice(0, 7);
  state.calendarMonth = state.month;
  state.selectedDate = result.date;
  state.focusDate = result.date;
  state.screen = "day";
  state.galleryIndex[result.date] ??= 0;
  state.focusAfterRender = "#journal-day-title-v14";
  const destinationEntryId = syncUrl({
    push: true,
    originAlreadySaved: true,
    captureDayDate: result.date,
    fullDayOpenedInApp: true,
    scrollY: 0,
    focusSelector: state.focusAfterRender,
    focusTop: null,
  });
  uploadDayHistoryTargetsV14.set(destinationEntryId, result.journalId);
  render();
  withInstantScroll(() => window.scrollTo({ top: 0, behavior: "auto" }));
}

function uploadFocusIsUnclaimedV14(active, target) {
  return !active
    || !active.isConnected
    || active === document.body
    || active === document.documentElement
    || active === root
    || active === modalRoot
    || active === target;
}

function renderUploadWithGuardedFocusV14(fallbackSelector = null, originSelectors = []) {
  const activeBeforeRender = document.activeElement;
  // Upload stage headings and the plain-text preview live inside the clickable
  // modal backdrop. Prefer their stable neutral IDs so the backdrop's
  // data-action cannot masquerade as the logical focus target after rerender.
  const activeSelector = activeBeforeRender?.id
    ? `#${CSS.escape(activeBeforeRender.id)}`
    : selectorForLogicalFocus(activeBeforeRender);
  const focusWasUnclaimed = !activeBeforeRender || activeBeforeRender === document.body || activeBeforeRender === document.documentElement || activeBeforeRender === root;
  const preserveSelector = activeSelector && !originSelectors.includes(activeSelector) ? activeSelector : null;
  if (state.modal?.type === "upload") state.modal.focusSelector = null;
  render();
  saveCurrentHistorySnapshot({
    scrollY: state.modal?.scrollY ?? window.scrollY,
    focusSelector: fallbackSelector || preserveSelector || state.modal?.returnFocusSelector || null,
    focusTop: null,
  });
  const selector = preserveSelector && resolveLogicalSelector(preserveSelector)
    ? preserveSelector
    : focusWasUnclaimed || (activeSelector && !resolveLogicalSelector(activeSelector)) || originSelectors.includes(activeSelector)
      ? fallbackSelector
      : null;
  if (!selector || !resolveLogicalSelector(selector)) return;
  const epoch = ++uploadFocusEpochV14;
  const generation = state.upload.generation;
  const immediateTarget = resolveLogicalSelector(selector);
  if (uploadFocusIsUnclaimedV14(document.activeElement, immediateTarget)) {
    immediateTarget?.focus({ preventScroll: true });
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (epoch !== uploadFocusEpochV14 || state.upload.generation !== generation || state.modal?.type !== "upload") return;
    const target = resolveLogicalSelector(selector);
    if (uploadFocusIsUnclaimedV14(document.activeElement, target)) {
      target?.focus({ preventScroll: true });
    }
  }));
}

function uploadFixtureCandidateV14(key = state.upload.fixture) {
  const fixture = UPLOAD_FIXTURES_V14[key] || UPLOAD_FIXTURES_V14["valid-md"];
  return {
    id: `upload-candidate-v14-${++uploadIntentSequenceV14}`,
    intentId: `upload-intent-v14-${uploadIntentSequenceV14}`,
    fileName: fixture.fileName,
    fileSize: fixture.fileSize,
    extension: fixture.fileName.split(".").pop().toLowerCase(),
    sourceType: fixture.sourceType,
    originalTimestamp: fixture.originalTimestamp || null,
    text: fixture.text,
    bytes: null,
    representedIdentity: fixture.representedIdentity,
    fixtureKey: key,
  };
}

function validateUploadEnvelopeV14({ name = "", size = 0 } = {}) {
  const extension = name.split(".").pop()?.toLowerCase();
  if (!["txt", "md"].includes(extension)) {
    return { error: "Choose a UTF-8 .txt or .md file. Word, PDF, photo, and OCR files are not accepted." };
  }
  if (size > UPLOAD_MAX_BYTES_V14) {
    return { error: `This file is ${formatUploadBytesV14(size)}. The maximum is 1 MiB (1,048,576 bytes).` };
  }
  return { extension };
}

function formatUploadReceiptTimestampV14(receivedAt = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(receivedAt).filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]));
  return `${parts.day} ${parts.month} ${parts.year} · ${parts.hour}:${parts.minute} ${String(parts.dayPeriod).toLowerCase()}`;
}

function readUploadBytesV14(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    uploadReadersV14.add(reader);
    const finish = () => {
      uploadReadersV14.delete(reader);
      reader.onload = null;
      reader.onerror = null;
      reader.onabort = null;
    };
    reader.onload = () => {
      const result = reader.result;
      finish();
      resolve(result);
    };
    reader.onerror = () => {
      finish();
      reject(reader.error || new Error("read-failed"));
    };
    reader.onabort = () => {
      finish();
      reject(new DOMException("File read cancelled", "AbortError"));
    };
    reader.readAsArrayBuffer(file);
  });
}

async function readJournalFile(file) {
  if (!file || state.modal?.type !== "upload") return;
  const receiptTimestamp = formatUploadReceiptTimestampV14();
  const envelope = validateUploadEnvelopeV14(file);
  const nextUpload = transitionUploadV14(state.upload, "READ_START");
  if (nextUpload === state.upload) return;
  state.upload = nextUpload;
  const generation = state.upload.generation;
  state.modal.focusSelector = null;
  renderUploadWithGuardedFocusV14("#upload-validating-title-v14", ['[data-action="journal-file"]']);
  announceUploadV14("Validating file. Nothing has been added.");
  if (envelope.error) {
    state.upload = transitionUploadV14(state.upload, "READ_REJECT", { error: envelope.error });
    clearUploadAnnouncementV14();
    renderUploadWithGuardedFocusV14("#upload-error-v14");
    return;
  }
  try {
    const buffer = await readUploadBytesV14(file);
    if (state.modal?.type !== "upload" || state.upload.generation !== generation || state.upload.stage !== "validating") return;
    const bytes = new Uint8Array(buffer.slice(0));
    let textValue;
    try {
      textValue = new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/^\uFEFF/, "");
    } catch {
      throw new Error("invalid-utf8");
    }
    if (!textValue.trim()) throw new Error("empty");
    const intentNumber = ++uploadIntentSequenceV14;
    const candidate = {
      id: `upload-candidate-v14-${intentNumber}`,
      intentId: `upload-intent-v14-${intentNumber}`,
      fileName: file.name,
      fileSize: file.size,
      extension: envelope.extension,
      sourceType: envelope.extension === "md" ? "UTF-8 Markdown" : "UTF-8 text",
      originalTimestamp: receiptTimestamp,
      text: textValue,
      bytes,
      representedIdentity: `live-original-v14-${intentNumber}`,
      fixtureKey: null,
    };
    state.upload = transitionUploadV14(state.upload, "READ_READY", { candidate });
    renderUploadWithGuardedFocusV14("#upload-review-title-v14");
    announceUploadV14("Journal ready for review.");
  } catch (error) {
    if (state.modal?.type !== "upload" || state.upload.generation !== generation || state.upload.stage !== "validating" || error?.name === "AbortError") return;
    const message = error.message === "empty"
      ? "This file has no journal text. Nothing was changed."
      : error.message === "invalid-utf8"
        ? "This file is not valid UTF-8 text. Nothing was changed."
        : "This file could not be read. Choose it again.";
    state.upload = transitionUploadV14(state.upload, "READ_REJECT", { error: message });
    clearUploadAnnouncementV14();
    renderUploadWithGuardedFocusV14("#upload-error-v14");
  }
}

function applyUploadFixtureV14() {
  if (state.modal?.type !== "upload") return;
  const fixture = UPLOAD_FIXTURES_V14[state.upload.fixture];
  if (!fixture) return;
  const validation = validateUploadDateV14(state.upload.date || fixture.date);
  const datedUpload = transitionUploadV14(state.upload, "DATE_SET", { value: state.upload.date || fixture.date, validation });
  if (datedUpload === state.upload) return;
  const readingUpload = transitionUploadV14(datedUpload, "READ_START");
  if (readingUpload === datedUpload) return;
  state.upload = readingUpload;
  renderUploadWithGuardedFocusV14("#upload-validating-title-v14");
  announceUploadV14("Validating file. Nothing has been added.");
  const generation = state.upload.generation;
  const timer = window.setTimeout(() => {
    uploadTimersV14.delete(`fixture-read-${generation}`);
    if (state.modal?.type !== "upload" || state.upload.generation !== generation || state.upload.stage !== "validating") return;
    let error = null;
    if (fixture.rejection === "oversize") error = `This file is ${formatUploadBytesV14(fixture.fileSize)}. The maximum is 1 MiB (1,048,576 bytes).`;
    else if (fixture.rejection === "unsupported-type") error = "Choose a UTF-8 .txt or .md file. Word, PDF, photo, and OCR files are not accepted.";
    else if (fixture.rejection === "invalid-utf8") error = "This file is not valid UTF-8 text. Nothing was changed.";
    else if (fixture.rejection === "empty") error = "This file has no journal text. Nothing was changed.";
    else if (fixture.rejection === "read-failure") error = "This file could not be read. Choose it again.";
    if (error) {
      state.upload = transitionUploadV14(state.upload, "READ_REJECT", { error });
      clearUploadAnnouncementV14();
      renderUploadWithGuardedFocusV14("#upload-error-v14");
      return;
    }
    state.upload = transitionUploadV14(state.upload, "READ_READY", { candidate: uploadFixtureCandidateV14(state.upload.fixture) });
    renderUploadWithGuardedFocusV14("#upload-review-title-v14");
    announceUploadV14("Journal ready for review.");
  }, 420);
  uploadTimersV14.set(`fixture-read-${generation}`, timer);
}

function sameUploadBytesV14(first, second) {
  if (!(first instanceof Uint8Array) || !(second instanceof Uint8Array) || first.byteLength !== second.byteLength) return false;
  for (let index = 0; index < first.byteLength; index += 1) if (first[index] !== second[index]) return false;
  return true;
}

function findLiveUploadMatchV14(candidate) {
  if (!candidate) return null;
  for (const day of Object.values(days)) {
    for (const journal of day.journals || []) {
      if (String(journal.kind).toLowerCase() !== "uploaded journal" || !journal.uploadV14) continue;
      const storedBytes = uploadOriginalBytesV14.get(journal.id);
      const bytesMatch = candidate.bytes && storedBytes ? sameUploadBytesV14(candidate.bytes, storedBytes) : false;
      const representedMatch = !candidate.bytes && journal.uploadV14.representedIdentity === candidate.representedIdentity;
      if (bytesMatch || representedMatch) return { date: day.date, journalId: journal.id };
    }
  }
  return null;
}

function uploadOperationIsCurrentV14(token) {
  return Boolean(token)
    && state.modal?.type === "upload"
    && state.upload.active === token
    && state.upload.generation === token.generation
    && state.upload.candidate?.id === token.candidateId
    && state.upload.date === token.date
    && state.shell.phase === "ready"
    && state.shell.connection === "connected"
    && state.shell.ops.generation === token.sessionGeneration;
}

function scheduleUploadV14(token, key, delay, callback) {
  const timerKey = `${token.id}:${key}`;
  const timer = window.setTimeout(() => {
    uploadTimersV14.delete(timerKey);
    if (pendingUploadPopstateReboundV14) {
      deferredUploadCallbacksV14.push(callback);
      return;
    }
    callback();
  }, delay);
  uploadTimersV14.set(timerKey, timer);
  return timer;
}

function flushDeferredUploadCallbacksV14() {
  while (!pendingUploadPopstateReboundV14 && deferredUploadCallbacksV14.length) {
    const callback = deferredUploadCallbacksV14.shift();
    callback();
  }
}

function newUploadTokenV14(kind) {
  const candidate = state.upload.candidate;
  return Object.freeze({
    id: ++uploadOperationSequenceV14,
    kind,
    intentId: candidate.intentId,
    candidateId: candidate.id,
    date: state.upload.date,
    generation: state.upload.generation,
    sessionGeneration: state.shell.ops.generation,
    archiveRevision: uploadArchiveRevisionV14,
  });
}

function defaultUploadedDayV14(date) {
  return {
    date,
    title: "",
    titleStatus: "AI not run",
    summary: "",
    summaryStatus: "AI not run",
    tags: [],
    tagsStatus: "AI not run",
    photos: [],
    artworks: [],
    journals: [],
    uploadOnlyV14: true,
    uploadDerivedStateV14: "pending",
  };
}

function safeUploadResultCandidateV14(candidate) {
  return {
    fileName: candidate.fileName,
    fileSize: candidate.fileSize,
    extension: candidate.extension,
    sourceType: candidate.sourceType,
    originalTimestamp: candidate.originalTimestamp,
    text: candidate.text,
    representedIdentity: candidate.representedIdentity,
  };
}

function commitUploadCandidateV14({ candidate, date, permit = false, token = null }) {
  const settled = uploadCommittedIntentsV14.get(candidate.intentId);
  if (settled) return { ...settled, alreadyCompleted: true };
  if (token && (!uploadOperationIsCurrentV14(token) || state.upload.stage !== "saving")) return null;
  const startingFromFirstUse = isFirstUseFixture();
  const existingDay = !startingFromFirstUse && days[date] ? structuredClone(days[date]) : null;
  const newDay = !existingDay;
  const destination = existingDay || defaultUploadedDayV14(date);
  const originalTimestamp = candidate.originalTimestamp;
  if (!originalTimestamp) return null;
  const journalId = `upload-source-v14-${++uploadInternalSourceSequenceV14}`;
  destination.journals.push({
    id: journalId,
    kind: "Uploaded journal",
    title: candidate.fileName,
    timestamp: originalTimestamp,
    status: "Current displayed version",
    text: candidate.text,
    uploadV14: {
      uiHandle: `upload-source-card-v14-${++uploadSourceUiSequenceV14}`,
      sourceType: candidate.sourceType,
      byteLength: candidate.fileSize,
      representedIdentity: candidate.representedIdentity,
      duplicateProvenance: permit ? "Added after exact-file duplicate warning" : null,
      exportRestoreStatus: "Original download and complete archive export/restore inclusion represented · download, export, and restore not implemented",
    },
  });
  destination.journals.sort(compareJournalTimestampsV14);
  if (!newDay) {
    destination.uploadDerivedStateV14 = "stale";
    destination.attention = "Source changed · refresh pending";
    delete state.generation[date];
  }
  if (startingFromFirstUse) Object.keys(days).forEach((date) => delete days[date]);
  days[date] = destination;
  ensureUploadDayDomTokenV14(date);
  if (candidate.bytes) uploadOriginalBytesV14.set(journalId, new Uint8Array(candidate.bytes));
  state.readinessFixture = startingFromFirstUse ? "archive/owner-started" : state.readinessFixture;
  state.almanacEmptyArchive = false;
  uploadArchiveRevisionV14 += 1;
  uploadPrivateDatesV14.add(date);
  const result = {
    date,
    journalId,
    originalTimestamp,
    newDay,
    addedAnyway: permit,
    candidate: safeUploadResultCandidateV14(candidate),
  };
  uploadCommittedIntentsV14.set(candidate.intentId, result);
  return result;
}

function applyUploadCommitV14(token) {
  return commitUploadCandidateV14({
    candidate: state.upload.candidate,
    date: token.date,
    permit: state.upload.permit,
    token,
  });
}

function settleFreshIntentRaceV14(token) {
  if (!uploadOperationIsCurrentV14(token) || state.upload.stage !== "saving" || state.upload.branch !== "fresh-intent-race" || state.upload.raceProof || state.upload.permit) return;
  const sourceCandidate = state.upload.candidate;
  const competingIntentNumber = ++uploadIntentSequenceV14;
  const competingCandidate = {
    ...sourceCandidate,
    id: `upload-candidate-v14-${competingIntentNumber}`,
    intentId: `upload-intent-v14-${competingIntentNumber}`,
    bytes: sourceCandidate.bytes ? new Uint8Array(sourceCandidate.bytes) : null,
  };
  if (findLiveUploadMatchV14(competingCandidate)) return;
  const result = commitUploadCandidateV14({ candidate: competingCandidate, date: token.date });
  if (!result) return;
  state.upload = {
    ...state.upload,
    raceProof: "One separate fresh operation committed exactly one Source Item. This operation now requires its own Add anyway decision.",
  };
}

function completeUploadCommitV14(token, { unknownResult = null, retry = false } = {}) {
  if (!uploadOperationIsCurrentV14(token) || state.upload.stage !== "saving") return;
  if (state.upload.branch === "commit-failure" && !retry) {
    state.upload = transitionUploadV14(state.upload, "COMMIT_FAIL", { token, expectedStage: "saving", error: "Journal wasn’t added. Your local file is unchanged and no Journal Day item was created. Retry." });
    renderUploadWithGuardedFocusV14("#upload-failure-title-v14");
    announceUploadV14("Journal was not added. Nothing changed.");
    return;
  }
  const commitTimeMatch = findLiveUploadMatchV14(state.upload.candidate);
  if (commitTimeMatch && !state.upload.permit && !uploadCommittedIntentsV14.has(token.intentId)) {
    state.upload = transitionUploadV14(state.upload, "CHECK_MATCH", { token, expectedStage: "saving", match: commitTimeMatch });
    renderUploadWithGuardedFocusV14("#upload-duplicate-title-v14");
    announceUploadV14("Exact-file decision ready.");
    return;
  }
  if (unknownResult) {
    const result = unknownResult === "one" ? applyUploadCommitV14(token) : null;
    if (unknownResult === "one" && !result) return;
    state.upload = transitionUploadV14(state.upload, "INTERRUPT", { token, retryTarget: "commit", resultStatus: "unknown", error: "The previous upload result is unknown in this tab. Retry will check the prior operation before creating anything." });
    renderUploadWithGuardedFocusV14("#upload-failure-title-v14");
    announceUploadV14("Upload result unknown. Retry will reconcile the prior operation.");
    return;
  }
  const result = applyUploadCommitV14(token);
  if (!result) return;
  state.upload = transitionUploadV14(state.upload, "SUCCESS", { token, expectedStage: "saving", result, alreadyCompleted: false });
  renderUploadWithGuardedFocusV14("#upload-result-title-v14", ['[data-action="confirm-upload"]', '[data-action="upload-add-anyway"]', '[data-action="upload-retry"]']);
  announceUploadV14(result.alreadyCompleted ? "Upload already completed. No second journal was created." : "Journal added. One Uploaded Journal is represented.");
}

function beginUploadCommitV14({ retry = false } = {}) {
  const legalCommitOrigin = state.upload.commitAuthorized
    && ["review", "duplicate-decision"].includes(state.upload.stage);
  if (state.modal?.type !== "upload" || !state.upload.candidate || state.upload.active || !legalCommitOrigin || state.shell.connection !== "connected") return;
  const settled = uploadCommittedIntentsV14.get(state.upload.candidate.intentId);
  if (settled) {
    const token = newUploadTokenV14("check");
    state.upload = transitionUploadV14(state.upload, "CHECK_START", { token, reconcile: true });
    if (state.upload.active !== token || state.upload.stage !== "reconciling") return;
    state.upload = transitionUploadV14(state.upload, "SUCCESS", { token, expectedStage: "reconciling", result: settled, alreadyCompleted: true });
    renderUploadWithGuardedFocusV14("#upload-result-title-v14");
    announceUploadV14("Upload already completed. No second journal was created.");
    return;
  }
  const latestMatch = findLiveUploadMatchV14(state.upload.candidate);
  if (latestMatch && !state.upload.permit) {
    const checkToken = newUploadTokenV14("check");
    state.upload = transitionUploadV14(state.upload, "CHECK_START", { token: checkToken });
    if (state.upload.active !== checkToken || state.upload.stage !== "checking") return;
    state.upload = transitionUploadV14(state.upload, "CHECK_MATCH", { token: checkToken, expectedStage: "checking", match: latestMatch });
    renderUploadWithGuardedFocusV14("#upload-duplicate-title-v14");
    announceUploadV14("Exact-file decision ready.");
    return;
  }
  const token = newUploadTokenV14("commit");
  state.upload = transitionUploadV14(state.upload, "COMMIT_START", { token, resultStatus: retry ? "known-zero" : "none" });
  if (state.upload.active !== token || state.upload.stage !== "uploading") return;
  renderUploadWithGuardedFocusV14("#upload-progress-title-v14", ['[data-action="confirm-upload"]', '[data-action="upload-add-anyway"]', '[data-action="upload-retry"]']);
  announceUploadV14("Uploading original file. Nothing is added until completion.");
  scheduleUploadV14(token, "saving", 420, () => {
    if (!uploadOperationIsCurrentV14(token) || state.upload.stage !== "uploading") return;
    if (state.upload.branch === "connection-interruption" && !retry) {
      state.upload = transitionUploadV14(state.upload, "INTERRUPT", { token, retryTarget: "commit", resultStatus: "known-zero", error: "Upload interrupted. Nothing was added. Your file and Journal Date remain selected in this tab. Retry." });
      renderUploadWithGuardedFocusV14("#upload-failure-title-v14");
      announceUploadV14("Upload interrupted. Nothing was added.");
      return;
    }
    state.upload = transitionUploadV14(state.upload, "COMMIT_STAGE", { token, expectedStage: "uploading", stage: "saving" });
    renderUploadWithGuardedFocusV14("#upload-progress-title-v14");
    announceUploadV14("Saving Uploaded Journal. Nothing is added until completion.");
  });
  scheduleUploadV14(token, "complete", 860, () => completeUploadCommitV14(token, {
    unknownResult: !retry && state.upload.branch === "unknown-result"
      ? "one"
      : !retry && ["unknown-result-zero", "reconciliation-failure"].includes(state.upload.branch)
        ? "zero"
        : null,
    retry,
  }));
  if (!retry && state.upload.branch === "fresh-intent-race" && !state.upload.permit) {
    scheduleUploadV14(token, "fresh-intent-race", 780, () => settleFreshIntentRaceV14(token));
  }
  if (state.upload.branch === "concurrent-intent") {
    scheduleUploadV14(token, "concurrent-complete", 840, () => completeUploadCommitV14(token, { retry }));
  }
  if (state.upload.branch === "rapid-repeat") beginUploadCommitV14({ retry });
}

function completeUploadCheckV14(token, { retry = false, reconcile = false } = {}) {
  const expectedStage = reconcile ? "reconciling" : "checking";
  if (!uploadOperationIsCurrentV14(token) || state.upload.stage !== expectedStage) return;
  if (state.upload.branch === "duplicate-check-failure" && !retry) {
    state.upload = transitionUploadV14(state.upload, "CHECK_FAIL", { token, expectedStage, error: "Life in Days could not check for an identical file. Nothing was added. Retry." });
    renderUploadWithGuardedFocusV14("#upload-failure-title-v14");
    announceUploadV14("Duplicate check could not finish. Nothing was added.");
    return;
  }
  const match = findLiveUploadMatchV14(state.upload.candidate);
  if (match && !state.upload.permit) {
    state.upload = transitionUploadV14(state.upload, "CHECK_MATCH", { token, expectedStage, match });
    renderUploadWithGuardedFocusV14("#upload-duplicate-title-v14", ['[data-action="confirm-upload"]', '[data-action="upload-retry"]']);
    announceUploadV14("Exact-file decision ready.");
    return;
  }
  state.upload = transitionUploadV14(state.upload, "CHECK_CLEAR", { token, expectedStage });
  beginUploadCommitV14({ retry });
}

function beginUploadCheckV14({ retry = false, reconcile = false } = {}) {
  const legalCheckOrigin = reconcile
    ? ["failure", "interrupted"].includes(state.upload.stage) && Boolean(state.upload.retryTarget)
    : state.upload.stage === "review" && !state.upload.commitAuthorized;
  if (state.modal?.type !== "upload" || !state.upload.candidate || state.upload.active || !legalCheckOrigin || state.upload.dateValidation.kind !== "valid" || state.shell.connection !== "connected") return;
  const token = newUploadTokenV14("check");
  state.upload = transitionUploadV14(state.upload, "CHECK_START", { token, reconcile });
  if (state.upload.active !== token || state.upload.stage !== (reconcile ? "reconciling" : "checking")) return;
  renderUploadWithGuardedFocusV14("#upload-progress-title-v14", ['[data-action="confirm-upload"]', '[data-action="upload-retry"]']);
  announceUploadV14(reconcile ? "Checking previous upload result." : "Checking for an identical file. Nothing has been added.");
  if (reconcile && state.upload.branch === "reconciliation-failure") {
    scheduleUploadV14(token, "reconcile-failure", 520, () => {
      if (!uploadOperationIsCurrentV14(token) || state.upload.stage !== "reconciling") return;
      state.upload = transitionUploadV14(state.upload, "CHECK_FAIL", {
        token,
        expectedStage: "reconciling",
        retryTarget: "reconcile",
        error: "Life in Days still could not establish the previous upload result. Nothing new was created. Retry.",
      });
      renderUploadWithGuardedFocusV14("#upload-failure-title-v14");
      announceUploadV14("Previous upload result remains unknown. Nothing new was created.");
    });
    return;
  }
  if (reconcile && uploadCommittedIntentsV14.has(token.intentId)) {
    scheduleUploadV14(token, "reconcile", 520, () => {
      if (!uploadOperationIsCurrentV14(token) || state.upload.stage !== "reconciling") return;
      const result = uploadCommittedIntentsV14.get(token.intentId);
      state.upload = transitionUploadV14(state.upload, "SUCCESS", { token, expectedStage: "reconciling", result, alreadyCompleted: true });
      renderUploadWithGuardedFocusV14("#upload-result-title-v14");
      announceUploadV14("Upload already completed. No second journal was created.");
    });
    return;
  }
  scheduleUploadV14(token, "complete", 760, () => completeUploadCheckV14(token, { retry, reconcile }));
  if (state.upload.branch === "connection-interruption" && !retry) scheduleUploadV14(token, "interrupt", 420, () => {
    if (!uploadOperationIsCurrentV14(token) || state.upload.stage !== "checking") return;
    state.upload = transitionUploadV14(state.upload, "INTERRUPT", { token, retryTarget: "check", resultStatus: "known-zero", error: "Upload interrupted. Nothing was added. Your file and Journal Date remain selected in this tab. Retry." });
    renderUploadWithGuardedFocusV14("#upload-failure-title-v14");
    announceUploadV14("Upload interrupted. Nothing was added.");
  });
  if (state.upload.branch === "rapid-repeat") beginUploadCheckV14({ retry, reconcile });
  if (!retry && state.upload.branch === "navigate-before-completion") {
    scheduleUploadV14(token, "navigate", 240, () => setView("search"));
  }
  if (!retry && state.upload.branch === "reset-before-completion") {
    scheduleUploadV14(token, "reset", 240, () => resetUploadScenarioV14({ focusConsole: false }));
  }
  if (!retry && state.upload.branch === "file-change-before-completion") {
    scheduleUploadV14(token, "file-change", 240, () => {
      clearUploadTimersV14();
      state.upload = transitionUploadV14(state.upload, "READ_START");
      state.upload = transitionUploadV14(state.upload, "READ_READY", { candidate: uploadFixtureCandidateV14("valid-md") });
      renderUploadWithGuardedFocusV14("#upload-review-title-v14");
      announceUploadV14("The file changed before commit. Nothing was added.");
    });
  }
  if (!retry && state.upload.branch === "date-change-before-completion") {
    scheduleUploadV14(token, "date-change", 240, () => {
      clearUploadTimersV14();
      const nextDate = state.upload.date === "2026-08-08" ? "2026-08-09" : "2026-08-08";
      state.upload = transitionUploadV14(state.upload, "DATE_SET", { value: nextDate, validation: validateUploadDateV14(nextDate) });
      renderUploadWithGuardedFocusV14("#upload-review-title-v14");
      announceUploadV14("The Journal Date changed before commit. Nothing was added.");
    });
  }
}

function confirmUpload() {
  if (state.shell.connection !== "connected") {
    announceUploadV14("Upload unavailable while the connection is interrupted. Restore the connection to continue.");
    return;
  }
  beginUploadCheckV14();
}

function beginArtworkGeneration(date) {
  if (!days[date] || days[date].uploadDerivedStateV14) return;
  const asyncGeneration = inheritedAsyncGenerationV10;
  state.modal = null;
  state.generation[date] = "waiting";
  state.focusAfterRender = `#generation-status-${uploadDayDomTokenV14(date)}`;
  render();
  toast("Artwork simulation queued. Authentic journals remain available.");

  schedulePrivateArchiveTimeoutV13(() => {
    if (asyncGeneration !== inheritedAsyncGenerationV10 || !days[date] || days[date].uploadDerivedStateV14) {
      delete state.generation[date];
      return;
    }
    state.generation[date] = "in-progress";
    state.focusAfterRender = `#generation-status-${uploadDayDomTokenV14(date)}`;
    render();
  }, 650);

  schedulePrivateArchiveTimeoutV13(() => {
    const currentDay = days[date];
    if (asyncGeneration !== inheritedAsyncGenerationV10 || !currentDay || currentDay.uploadDerivedStateV14) {
      delete state.generation[date];
      return;
    }
    currentDay.artworks.forEach((artwork) => {
      artwork.active = false;
    });
    currentDay.artworks.push({
      id: `synthetic-art-${Date.now()}`,
      src: "assets/art-golden-path.svg",
      alt: `AI artwork for ${longDate(date).replace(/^\w+, /, "")}`,
      brief: "A winding golden path through warm hills; quiet, symbolic, painterly, and without recognizable people.",
      created: "Just now · simulated",
      trigger: "Generate artwork now",
      active: true,
    });
    state.generation[date] = "complete";
    state.focusAfterRender = `#artwork-title-${uploadDayDomTokenV14(date)}`;
    render();
    toast(currentDay.photos.length ? "Synthetic artwork added. The real Daily Photo remains the Calendar Cover." : "Synthetic artwork added and shown as the AI artwork cover.");
    schedulePrivateArchiveTimeoutV13(() => {
      if (asyncGeneration !== inheritedAsyncGenerationV10) return;
      delete state.generation[date];
    }, 1400);
  }, 1900);
}

function triggerArtwork(date, returnFocusSelector = null) {
  const day = days[date];
  if (!day || day.uploadDerivedStateV14) {
    toast("Artwork generation is unavailable while source refresh is pending.");
    return;
  }
  const count = meaningfulWordCount(day);
  if (count < 5) {
    toast("At least 5 meaningful journal words are needed.");
    return;
  }
  if (count < 20) {
    state.modal = {
      type: "sparse-art",
      date,
      returnFocusSelector: returnFocusSelector || `[data-action="trigger-art"][data-date="${uploadDayDomTokenV14(date)}"]`,
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

function resetCaptureTruthForExternalArchiveResetV13() {
  const hasCaptureTruth = state.captureArchiveActive
    || Boolean(state.capture?.active)
    || Boolean(state.capture?.fixtureIdentity)
    || captureCommittedIdentitiesV13.size > 0
    || captureResolvedReviewIdentitiesV13.size > 0
    || captureDuplicateReferenceByIdentityV13.size > 0
    || captureConcurrentPermitLedgerV13.size > 0
    || captureDayHistoryTargetsV13.size > 0
    || captureDayPhotoTargetsV13.size > 0;
  if (!hasCaptureTruth) return;
  cancelCaptureOperationsV13();
  captureCommittedIdentitiesV13.clear();
  captureResolvedReviewIdentitiesV13.clear();
  captureDuplicateReferenceByIdentityV13.clear();
  captureConcurrentPermitLedgerV13.clear();
  captureDayHistoryTargetsV13.clear();
  captureDayPhotoTargetsV13.clear();
  sourceConflictReturnTargetsV16.clear();
  state.capture = initialCaptureStateV13((state.capture?.generation || 0) + 1, state.capture?.branch || "success");
  state.captureArchiveActive = false;
  state.galleryIndex = {};
  state.viewMemory["telegram-capture"] = null;
  state.scrollByView["telegram-capture"] = 0;
}

function establishDateReviewArchiveBaselineV11(populated) {
  // Queue fixture transitions own an exact destination baseline. Re-clone the
  // frozen v10 archive (or the first-use empty archive) only after any prior
  // assignment backup has been restored, so no represented attachment can
  // leak into a later fixture.
  resetCaptureTruthForExternalArchiveResetV13();
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

function setDateReviewDraftV11(value, { selection = null, announce = true, focusAfterRender = "#date-review-date-input-v11" } = {}) {
  if (!state.dateReview.detailKey || state.dateReview.assignment.status === "assigning") return;
  const item = dateReviewItem(state.dateReview.detailKey);
  const validation = validateDateReviewDate(value);
  const preview = validation.kind === "valid" ? dateReviewPreview(item, value) : null;
  dispatchDateReview("DRAFT_SET", { value, validation, preview });
  state.pendingDateReviewSelection = selection;
  state.focusAfterRender = focusAfterRender;
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
    if (state.capture.fixtureIdentity) captureResolvedReviewIdentitiesV13.add(state.capture.fixtureIdentity);
    dispatchCaptureV13("REVIEW_RESOLVED");
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
  invalidateNavigationFocusV13();
  viewScrollRestoreEpochV13 += 1;
  invalidateAlmanacRestorationV13();
  if (almanacScrollFrame) window.cancelAnimationFrame(almanacScrollFrame);
  if (almanacMemoryTimer) window.clearTimeout(almanacMemoryTimer);
  almanacScrollFrame = 0;
  almanacMemoryTimer = 0;
  cancelCaptureOperationsV13();
  captureCommittedIdentitiesV13.clear();
  captureResolvedReviewIdentitiesV13.clear();
  captureDuplicateReferenceByIdentityV13.clear();
  captureConcurrentPermitLedgerV13.clear();
  captureDayHistoryTargetsV13.clear();
  captureDayPhotoTargetsV13.clear();
  sourceConflictReturnTargetsV16.clear();
  state.capture = initialCaptureStateV13((state.capture?.generation || 0) + 1, state.capture?.branch || "success");
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
  state.almanacStatus = "idle";
  state.almanacStatusMessage = "";
  state.almanacFailNext = false;
  state.almanacLoadRequestId += 1;
  state.almanacReturnFocusDate = null;
  state.almanacLastFocusAction = null;
  state.almanacPendingDestination = null;
  state.almanacRestoringHistory = false;
  state.almanacReadingAnchor = null;
  state.selectedDate = selectedDate;
  state.focusDate = selectedDate || today;
  state.screen = screen;
  state.galleryIndex = {};
  state.generation = {};
  state.searchQuery = "";
  state.searchDraft = "";
  state.searchReturnView = "calendar";
  state.pendingChapterScroll = false;
  state.pendingInputSelection = null;
  state.pendingDateReviewSelection = null;
  state.searchSelection = null;
  state.transientFocusSelector = null;
  state.pendingDrawerFocusSelector = null;
  state.pendingSelectionCloseFocus = null;
  state.focusAfterRender = null;
  state.monthAnnouncement = "";
  state.settingsSection = "overview";
  state.modal = null;
  state.viewMemory = { calendar: null, almanac: null, search: null, settings: null, "date-review": null, "telegram-capture": null, "source-conflict": null };
  state.scrollByView = { calendar: 0, almanac: 0, search: 0, settings: 0, "date-review": 0, "telegram-capture": 0, "source-conflict": 0 };
}

function resetSessionHistoryV13() {
  historyEntries.clear();
  historyPositions.clear();
  sourceConflictReturnTargetsV16.clear();
  currentHistoryPosition = 0;
  const safeEntryId = nextHistoryEntryId();
  historyEntries.set(safeEntryId, {});
  historyPositions.set(safeEntryId, 0);
  window.history.replaceState({ entryId: safeEntryId }, "", canonicalRouteUrl({ entryId: safeEntryId }));
  return safeEntryId;
}

function setShellFixtureV10(fixture) {
  const requestedFixture = Object.hasOwn(SHELL_FIXTURES, fixture) ? fixture : "shell/ready";
  const sessionFixture = ["shell/session-expired", "shell/session-expired-with-draft"].includes(requestedFixture);
  if (uploadDismissalLockedV14() && !sessionFixture) {
    announceUploadV14(uploadLockedExplanationV14("Upload in progress. Reset is available after the represented result settles."));
    return;
  }
  inheritedAsyncGenerationV10 += 1;
  state.generation = {};
  cancelShellOperations();
  clearCorrectionCallbackReplayV15();
  clearShellBoundaryTransientsV10();
  const populated = ["shell/month-failure", "shell/media-failure", "shell/connection-interrupted", "shell/correction-interrupted"].includes(requestedFixture);
  const selectedDate = requestedFixture === "shell/media-failure"
    ? SHELL_MEDIA_ITEM.date
    : requestedFixture === "shell/correction-interrupted"
      ? CORRECTION_SOURCE_ITEM_V15.date
      : null;
  resetShellViewV10({ populated, selectedDate, screen: requestedFixture === "shell/correction-interrupted" ? "day" : "month" });
  dispatchShell("FIXTURE_SET", { fixture: requestedFixture });
  const safeFixture = state.shell.fixture;
  const selectedSessionFixture = ["shell/session-expired", "shell/session-expired-with-draft"].includes(safeFixture);
  if (selectedSessionFixture) resetSessionHistoryV13();
  if (selectedSessionFixture) {
    state.focusAfterRender = "#session-gate-title-v10";
  } else if (safeFixture === "shell/app-loading") state.focusAfterRender = "#app-loading-title-v10";
  else if (safeFixture === "shell/server-failure") state.focusAfterRender = "#server-failure-title-v10";
  else if (safeFixture === "shell/month-failure") state.focusAfterRender = '[data-action="retry-shell-month"]';
  else if (safeFixture === "shell/media-failure") state.focusAfterRender = `[data-action="retry-shell-image"][data-photo-id="${SHELL_MEDIA_ITEM.photoId}"]`;
  else state.focusAfterRender = isFirstUseFixture() ? "#first-use-title-v9" : "#prototype-main";
  syncUrl({ scrollY: 0, focusSelector: state.focusAfterRender, focusTop: null });
  if (safeFixture === "shell/correction-interrupted") {
    openCorrectionModalEntryV15("correction-v10", "#correction-draft-v10", null, state.shell.correction.returnFocusSelector);
  }
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
  const domDate = uploadDayDomTokenV14(date);
  const itemSelector = state.view === "calendar" && state.screen === "month" && state.selectedDate === date
    ? `#museum-media-${domDate}`
    : state.view === "calendar" && state.screen === "month"
      ? `[data-calendar-date="${domDate}"]`
      : state.view === "almanac" && state.screen === "month"
        ? `#chapter-${domDate}`
        : `#gallery-title-${domDate}`;
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
  if (["correction-v10", "remove-correction-v15"].includes(state.modal?.type)) state.modal.focusSelector = '[data-action="check-shell-connection"]';
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
    if (state.modal?.type === "correction-v10") {
      state.modal.focusSelector = state.shell.correction.failure?.kind === "stale-base"
        ? '[data-action="review-correction-source-update"]'
        : state.shell.connection !== "connected" && state.shell.correction.dirty
        ? '[data-action="check-shell-connection"]'
        : state.shell.correction.retryTarget
          ? '[data-action="retry-shell-correction"]'
          : ["failed", "unknown"].includes(state.shell.correction.status)
            ? "#correction-save-failure-v10"
            : "#correction-draft-v10";
    }
    else if (state.modal?.type === "remove-correction-v15") {
      state.modal.focusSelector = state.shell.correction.failure?.kind === "stale-base"
        ? '[data-action="review-correction-source-update"]'
        : state.shell.connection !== "connected"
        ? '[data-action="check-shell-connection"]'
        : state.shell.correction.retryTarget
          ? '[data-action="retry-remove-correction"]'
          : ["remove-failed", "remove-unknown"].includes(state.shell.correction.status)
            ? "#correction-remove-failure-v15"
            : '[data-action="confirm-remove-correction"]';
    }
    else state.focusAfterRender = state.shell.connection === "connected" ? "#connection-restored-v10" : '[data-action="check-shell-connection"]';
    render();
  });
  if (state.shell.branch === "navigate-before-completion"
    && !["correction-v10", "remove-correction-v15"].includes(state.modal?.type)) {
    // Connection checks are the only shell operation allowed to survive an
    // ordinary view change. The destination keeps the interrupted banner
    // until this same guarded check settles.
    setView("search");
  }
}

function claimCorrectionForegroundV15() {
  cancelShellOpsForNavigationV10();
  clearDateReviewAnnouncementV11();
  clearCaptureAnnouncementV13();
  const connectionWasChecking = state.shell.connection === "checking";
  cancelShellOperations(["connection"]);
  if (connectionWasChecking) dispatchShell("CONNECTION_CHECK_FAIL");
  invalidatePrivateArchiveAsyncWorkV13();
  pendingCorrectionPopstateReboundV15 = null;
  clearPendingCorrectionCloseTraversalV15();
  correctionStatusLiveV15.textContent = "";
}

function openCorrectionModalEntryV15(type, focusSelector, sourceHandle, returnFocusSelector) {
  const originScrollY = window.scrollY;
  const originHistoryEntryId = ensureHistoryEntry();
  saveCurrentHistorySnapshot({
    scrollY: originScrollY,
    focusSelector: returnFocusSelector,
    focusTop: null,
  });
  state.modal = { type, focusSelector, scrollY: originScrollY, sourceHandle, originHistoryEntryId };
  const historyEntryId = syncUrl({
    push: true,
    originAlreadySaved: true,
    scrollY: originScrollY,
    focusSelector,
    focusTop: null,
  });
  state.modal.historyEntryId = historyEntryId;
}

function correctionReturnTargetExistsV15(selector) {
  if (!selector) return false;
  try {
    return Boolean(document.querySelector(selector));
  } catch {
    return false;
  }
}

function clearPendingCorrectionCloseTraversalV15() {
  pendingCorrectionCloseTraversalV15 = null;
  modalRoot.inert = false;
  modalRoot.removeAttribute("aria-hidden");
  const skipLink = document.querySelector('.skip-link[href="#prototype-main"]');
  if (skipLink) {
    skipLink.inert = false;
    skipLink.removeAttribute("aria-hidden");
  }
}

function closeCorrectionModalEntryV15({ alreadyClosed = false, returnSelector = null, announcement = null } = {}) {
  const modal = state.modal;
  if (!["correction-v10", "remove-correction-v15"].includes(modal?.type)) return false;
  const requestedReturn = returnSelector || state.shell.correction.returnFocusSelector;
  const cardReturn = modal.sourceHandle ? `#correction-card-title-${modal.sourceHandle}` : null;
  const forceJournalDayFallback = state.shell.correctionBranch === "missing-return-card";
  const safeReturn = !forceJournalDayFallback && correctionReturnTargetExistsV15(requestedReturn)
    ? requestedReturn
    : !forceJournalDayFallback && correctionReturnTargetExistsV15(cardReturn)
      ? cardReturn
      : "#journal-day-title-v14";
  if (!alreadyClosed) {
    const previousShell = state.shell;
    dispatchShell("CORRECTION_CLOSE");
    if (state.shell === previousShell) return false;
  }
  if (forceJournalDayFallback && modal.sourceHandle) correctionHiddenSourceHandlesV15.add(modal.sourceHandle);
  const currentEntryId = window.history.state?.entryId;
  const closesDedicatedEntry = currentHistoryPosition > 0
    && modal.historyEntryId === currentEntryId;
  const originEntryId = modal.originHistoryEntryId;
  const guardsExactReturn = closesDedicatedEntry
    && originEntryId
    && historyEntries.has(originEntryId);
  state.modal = null;
  state.focusAfterRender = guardsExactReturn ? null : safeReturn;
  if (closesDedicatedEntry) {
    if (originEntryId && historyEntries.has(originEntryId)) {
      historyEntries.set(originEntryId, captureHistorySnapshot({
        scrollY: modal.scrollY ?? window.scrollY,
        focusSelector: safeReturn,
        focusTop: null,
      }, historyEntries.get(originEntryId) || {}));
    }
    historyEntries.set(currentEntryId, captureHistorySnapshot({
      scrollY: modal.scrollY ?? window.scrollY,
      focusSelector: safeReturn,
      focusTop: null,
      }, historyEntries.get(currentEntryId) || {}));
  }
  if (guardsExactReturn) {
    pendingCorrectionCloseTraversalV15 = {
      originEntryId,
      modalEntryId: currentEntryId,
      originPosition: historyPositions.get(originEntryId) ?? currentHistoryPosition - 1,
      focusSelector: safeReturn,
      scrollY: modal.scrollY ?? window.scrollY,
    };
    correctionFocusEpochV15 += 1;
    root.inert = true;
    root.setAttribute("aria-hidden", "true");
    modalRoot.inert = true;
    modalRoot.setAttribute("aria-hidden", "true");
    const skipLink = document.querySelector('.skip-link[href="#prototype-main"]');
    if (skipLink) {
      skipLink.inert = true;
      skipLink.setAttribute("aria-hidden", "true");
    }
    window.history.back();
  } else {
    render();
    if (closesDedicatedEntry) window.history.back();
    else if (modal.scrollY != null) requestAnimationFrame(() => withInstantScroll(() => window.scrollTo({ top: modal.scrollY, behavior: "auto" })));
  }
  if (announcement) announceCorrectionV15(announcement);
  return true;
}

function renderCorrectionPreservingFocusV15(fallbackSelector = null) {
  if (!["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type)) {
    render();
    return;
  }
  const active = document.activeElement;
  const activeSelector = active?.id
    ? `#${CSS.escape(active.id)}`
    : selectorForLogicalFocus(active);
  state.modal.focusSelector = activeSelector && resolveLogicalSelector(activeSelector)
    ? activeSelector
    : fallbackSelector || "[data-modal-card]";
  render();
}

function openShellCorrectionV10(sourceHandle, returnFocusSelector = null) {
  const source = resolveCorrectionSourceV15(sourceHandle);
  if (!source) return false;
  const { day, journal } = source;
  const meta = correctionSourceMetaV15(day, journal);
  if (!meta.eligible) {
    announceCorrectionV15(meta.baseComplete
      ? "Correction editing waits for source-update review. No text was changed."
      : "Correction editing requires a complete selected base revision. No editor or draft was created.", { assertive: true });
    return false;
  }
  const previousShell = state.shell;
  dispatchShell("CORRECTION_OPEN", { date: day.date, journalId: journal.id, ...meta, returnFocusSelector, editorIncarnation: nextCorrectionEditorIncarnationV15() });
  if (state.shell === previousShell) return false;
  claimCorrectionForegroundV15();
  openCorrectionModalEntryV15("correction-v10", "#correction-title-v15", sourceHandle, returnFocusSelector);
  render();
  return true;
}

function correctionOperationBranchV15() {
  return state.shell.correctionBranch !== "success" ? state.shell.correctionBranch : state.shell.branch;
}

function settleCorrectionSaveV15(intentKey, envelope) {
  const correction = state.shell.correction;
  if (!envelope || correction.operation?.intentKey !== intentKey) return false;
  const result = state.shell.correctionResults[intentKey];
  const branch = correctionOperationBranchV15();
  const knownZeroStatusCheck = envelope.operationOrigin === "save-known-zero-retry";
  const statusCheck = envelope.operationOrigin === "save-status-check" || knownZeroStatusCheck;
  if (statusCheck) {
    if (!knownZeroStatusCheck && branch === "reconciliation-unknown") {
      const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_UNKNOWN", envelope);
      if (accepted) {
        state.modal.focusSelector = '[data-action="retry-shell-correction"]';
        announceCorrectionV15(CORRECTION_COPY_V15.unknownSave, { assertive: true });
      }
      return accepted;
    }
    if (state.shell.connection !== "connected" || ["connection-interruption", "repeat-failure"].includes(branch)) {
      if (branch === "connection-interruption") dispatchShell("CONNECTION_INTERRUPT");
      const connectionBlocked = state.shell.connection !== "connected" || branch === "connection-interruption";
      const knownZeroFailure = connectionBlocked
        ? { kind: "connection", message: CORRECTION_COPY_V15.connection }
        : { kind: "known-zero", message: CORRECTION_COPY_V15.saveFailure };
      const accepted = knownZeroStatusCheck
        ? dispatchCorrectionCallbackV15("CORRECTION_SAVE_FAIL", {
          ...envelope,
          resolution: "known-zero",
          failure: knownZeroFailure,
        })
        : dispatchCorrectionCallbackV15("CORRECTION_SAVE_UNKNOWN", envelope);
      if (accepted) {
        state.modal.focusSelector = knownZeroStatusCheck
          ? "#correction-save-failure-v10"
          : '[data-action="retry-shell-correction"]';
        if (!knownZeroStatusCheck) announceCorrectionV15(CORRECTION_COPY_V15.unknownSave, { assertive: true });
      }
      return accepted;
    }
    if (result?.kind === "save") {
      const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_READY", { ...envelope, record: result.record });
      if (accepted) {
        const sourceRace = state.shell.correction.intentResolution === "source-race-one";
        state.modal.focusSelector = sourceRace ? "#correction-save-failure-v10" : "#correction-success-v15";
        if (!sourceRace) announceCorrectionV15(CORRECTION_COPY_V15.alreadySaved);
      }
      return accepted;
    }
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_FAIL", {
      ...envelope,
      resolution: "unknown-zero",
      failure: { kind: "known-zero", message: "No Correction was found for the original save intent. Nothing was saved; your draft remains in this page." },
    });
    if (accepted) {
      state.modal.focusSelector = "#correction-save-failure-v10";
    }
    return accepted;
  }
  if (branch === "repeat-failure" || (branch === "known-zero-failure" && envelope.operationOrigin === "save-user")) {
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_FAIL", { ...envelope, resolution: "known-zero", failure: { kind: "known-zero", message: CORRECTION_COPY_V15.saveFailure } });
    if (accepted) {
      state.modal.focusSelector = "#correction-save-failure-v10";
    }
    return accepted;
  }
  if (branch === "stale-base") {
    const accepted = representCorrectionSourceRevisionChangeV15(correction);
    if (!accepted) return false;
    const afterRace = state.shell;
    dispatchCorrectionCallbackV15("CORRECTION_SAVE_READY", {
      ...envelope,
      record: correctionRecordForIntentV15(correction, intentKey),
    });
    const ignored = state.shell === afterRace;
    correctionCallbackProbeV15.staleSaveReadyIgnored = ignored;
    state.modal.focusSelector = "#correction-save-failure-v10";
    return ignored;
  }
  if (branch === "connection-interruption" || state.shell.connection !== "connected") {
    dispatchShell("CONNECTION_INTERRUPT");
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_FAIL", { ...envelope, resolution: "known-zero", failure: { kind: "connection", message: CORRECTION_COPY_V15.connection } });
    if (accepted) {
      state.modal.focusSelector = "#correction-save-failure-v10";
    }
    return accepted;
  }
  if (["unknown-zero", "unknown-completed", "reconciliation-unknown"].includes(branch) && envelope.operationOrigin === "save-user") {
    const record = branch === "unknown-completed" ? correctionRecordForIntentV15(correction, intentKey) : null;
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_UNKNOWN", {
      ...envelope,
      ...(record ? { observedResult: { kind: "save", record } } : {}),
    });
    if (accepted) {
      state.modal.focusSelector = '[data-action="retry-shell-correction"]';
      announceCorrectionV15(CORRECTION_COPY_V15.unknownSave, { assertive: true });
    }
    return accepted;
  }
  if (branch === "foreign-save-callback" && !runForeignSaveCallbackProbeV15(envelope, correction)) return false;
  if (branch === "prior-flow-save-callback" && !runPriorFlowSaveCallbackProbeV15(envelope)) return false;
  const record = correctionRecordForIntentV15(correction, intentKey);
  const accepted = dispatchCorrectionCallbackV15("CORRECTION_SAVE_READY", { ...envelope, record });
  if (accepted) {
    state.modal.focusSelector = "#correction-success-v15";
    announceCorrectionV15(CORRECTION_COPY_V15.saveSuccess);
  }
  return accepted;
}

function saveShellCorrectionV10({ retry = false } = {}) {
  const liveEditor = modalRoot.querySelector("#correction-draft-v10");
  flushShellCompositionHistoryV15(liveEditor);
  if (liveEditor && !liveEditor.disabled) {
    dispatchShell("CORRECTION_SELECTION", {
      selection: { start: liveEditor.selectionStart, end: liveEditor.selectionEnd, direction: liveEditor.selectionDirection },
      editorIncarnation: correctionEditorIncarnationsV15.get(liveEditor),
    });
  }
  const correction = state.shell.correction;
  if (!correction.open || ["saving", "reconciling", "saved"].includes(correction.status)) return;
  const operationOrigin = correctionOperationOriginV15("save", correction, retry);
  if (!operationOrigin) {
    announceCorrectionV15(correction.failure?.message || CORRECTION_COPY_V15.saveFailure, { assertive: true });
    return;
  }
  const statusCheck = operationOrigin === "save-status-check";
  if (!retry && (!correction.dirty || correction.validation.kind !== "valid")) {
    if (liveEditor && !liveEditor.disabled) {
      dispatchShell("CORRECTION_VALIDATE", {
        selection: { start: liveEditor.selectionStart, end: liveEditor.selectionEnd, direction: liveEditor.selectionDirection },
        editorIncarnation: correctionEditorIncarnationsV15.get(liveEditor),
      });
    }
    state.modal.focusSelector = "#correction-draft-v10";
    render();
    return;
  }
  if (correctionOperationBranchV15() === "stale-before-effect") {
    if (representCorrectionSourceRevisionChangeV15(correction)) {
      state.modal.focusSelector = "#correction-save-failure-v10";
      render();
    }
    return;
  }
  const intentKey = correction.intentKey || nextCorrectionIntentV15("save", correction);
  const token = beginOp("correction", intentKey);
  if (!token) return;
  const envelope = correctionOperationEnvelopeV15(token, correction, intentKey, operationOrigin);
  dispatchShell("CORRECTION_SAVE_START", envelope);
  if (state.shell.correction.operation?.operationId !== token.id) {
    finishOp(token);
    return;
  }
  state.modal.focusSelector = "#correction-operation-status-v10";
  render();
  scheduleOp(token, () => {
    if (correctionOperationBranchV15() === "session-interruption") {
      const pendingCorrection = state.shell.correction;
      expireShellSessionV10({
        delayedCallbackPayload: Object.freeze({
          ...envelope,
          record: correctionRecordForIntentV15(pendingCorrection, intentKey),
        }),
      });
      return;
    }
    settleCorrectionSaveV15(intentKey, envelope);
    render();
    if (state.shell.correction.status === "failed") requestAnimationFrame(() => withInstantScroll(() => resolveLogicalSelector("#correction-save-failure-v10")?.scrollIntoView({ behavior: "auto", block: "nearest" })));
  });
  if (correctionOperationBranchV15() === "rapid-repeat") saveShellCorrectionV10({ retry });
  if (correctionOperationBranchV15() === "navigate-before-completion") {
    schedulePrivateArchiveTimeoutV13(() => {
      if (!isCurrentOp(token) || state.modal?.type !== "correction-v10") return;
      window.history.back();
    }, 180);
  }
}

function openCorrectionRemovalV15(sourceHandle, returnFocusSelector = null) {
  const source = resolveCorrectionSourceV15(sourceHandle);
  if (!source) return false;
  const { day, journal } = source;
  const meta = correctionSourceMetaV15(day, journal);
  const activeRecord = activeCorrectionRecordV15(day.date, journal.id);
  if (!meta.eligible || !activeRecord) return false;
  const previousShell = state.shell;
  dispatchShell("CORRECTION_OPEN", { date: day.date, journalId: journal.id, ...meta, returnFocusSelector, editorIncarnation: nextCorrectionEditorIncarnationV15() });
  if (state.shell === previousShell) return false;
  const openedShell = state.shell;
  dispatchShell("CORRECTION_REMOVE_OPEN", { activeRecord, returnFocusSelector });
  if (state.shell === openedShell) {
    dispatchShell("CORRECTION_CLOSE");
    return false;
  }
  claimCorrectionForegroundV15();
  openCorrectionModalEntryV15("remove-correction-v15", "#correction-remove-title-v15", sourceHandle, returnFocusSelector);
  render();
  return true;
}

function settleCorrectionRemovalV15(intentKey, envelope) {
  const correction = state.shell.correction;
  if (!envelope || correction.operation?.intentKey !== intentKey) return null;
  const result = state.shell.correctionResults[intentKey];
  const branch = correctionOperationBranchV15();
  const knownZeroStatusCheck = envelope.operationOrigin === "remove-known-zero-retry";
  const statusCheck = envelope.operationOrigin === "remove-status-check" || knownZeroStatusCheck;
  if (statusCheck) {
    if (!knownZeroStatusCheck && branch === "reconciliation-unknown") {
      const accepted = dispatchCorrectionCallbackV15("CORRECTION_REMOVE_UNKNOWN", envelope);
      if (accepted) announceCorrectionV15(CORRECTION_COPY_V15.unknownRemove, { assertive: true });
      return accepted ? false : null;
    }
    if (state.shell.connection !== "connected" || ["connection-interruption", "repeat-failure"].includes(branch)) {
      if (branch === "connection-interruption") dispatchShell("CONNECTION_INTERRUPT");
      const connectionBlocked = state.shell.connection !== "connected" || branch === "connection-interruption";
      const knownZeroFailure = connectionBlocked
        ? { kind: "connection", message: "The connection was interrupted. The Correction remains displayed; Retry is explicit." }
        : { kind: "known-zero", message: CORRECTION_COPY_V15.removeFailure };
      const accepted = knownZeroStatusCheck
        ? dispatchCorrectionCallbackV15("CORRECTION_REMOVE_FAIL", {
          ...envelope,
          resolution: "known-zero",
          failure: knownZeroFailure,
        })
        : dispatchCorrectionCallbackV15("CORRECTION_REMOVE_UNKNOWN", envelope);
      if (accepted && !knownZeroStatusCheck) announceCorrectionV15(CORRECTION_COPY_V15.unknownRemove, { assertive: true });
      return accepted ? false : null;
    }
    if (result?.kind === "remove") {
      const accepted = dispatchCorrectionCallbackV15("CORRECTION_REMOVE_READY", { ...envelope, removal: result.removal });
      if (accepted) {
        const sourceRace = state.shell.correction.intentResolution === "source-race-one";
        if (!sourceRace) announceCorrectionV15(CORRECTION_COPY_V15.alreadyRemoved);
        return sourceRace ? false : true;
      }
      return null;
    }
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_REMOVE_FAIL", {
      ...envelope,
      resolution: "unknown-zero",
      failure: { kind: "known-zero", message: "No removal was found for the original intent. The Correction remains displayed." },
    });
    return accepted ? false : null;
  }
  if (branch === "repeat-failure" || (["removal-failure", "known-zero-failure"].includes(branch) && envelope.operationOrigin === "remove-user")) {
    const retryConsumed = envelope.operationOrigin === "remove-unknown-zero-retry";
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_REMOVE_FAIL", {
      ...envelope,
      resolution: "known-zero",
      failure: {
        kind: "known-zero",
        message: retryConsumed
          ? "Correction not removed. The displayed Correction remains unchanged. No additional removal retry is available in this fixture."
          : CORRECTION_COPY_V15.removeFailure,
      },
    });
    return accepted ? false : null;
  }
  if (branch === "stale-base") {
    const accepted = representCorrectionSourceRevisionChangeV15(correction);
    return accepted ? false : null;
  }
  if (branch === "connection-interruption" || state.shell.connection !== "connected") {
    dispatchShell("CONNECTION_INTERRUPT");
    const retryConsumed = envelope.operationOrigin === "remove-unknown-zero-retry";
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_REMOVE_FAIL", {
      ...envelope,
      resolution: "known-zero",
      failure: {
        kind: "connection",
        message: retryConsumed
          ? "The connection was interrupted. The Correction remains displayed. No additional removal was attempted."
          : "The connection was interrupted. The Correction remains displayed; Retry is explicit.",
      },
    });
    return accepted ? false : null;
  }
  if (["unknown-zero", "unknown-completed", "reconciliation-unknown"].includes(branch) && envelope.operationOrigin === "remove-user") {
    const removal = branch === "unknown-completed" ? correctionRemovalForIntentV15(correction, intentKey) : null;
    const accepted = dispatchCorrectionCallbackV15("CORRECTION_REMOVE_UNKNOWN", {
      ...envelope,
      ...(removal ? { observedResult: { kind: "remove", removal } } : {}),
    });
    if (accepted) announceCorrectionV15(CORRECTION_COPY_V15.unknownRemove, { assertive: true });
    return accepted ? false : null;
  }
  const accepted = dispatchCorrectionCallbackV15("CORRECTION_REMOVE_READY", { ...envelope, removal: correctionRemovalForIntentV15(correction, intentKey) });
  if (accepted) announceCorrectionV15(CORRECTION_COPY_V15.removeSuccess);
  return accepted ? true : null;
}

function removeCorrectionV15({ retry = false } = {}) {
  const correction = state.shell.correction;
  if (state.modal?.type !== "remove-correction-v15" || (!correction.activeRecord && !correction.intentKey) || ["removing", "remove-reconciling"].includes(correction.status)) return;
  if (state.shell.connection !== "connected") {
    if (state.shell.connection !== "checking") dispatchShell("CONNECTION_CHECK_FAIL");
    state.modal.focusSelector = correction.retryTarget && state.shell.connection !== "checking"
      ? '[data-action="retry-remove-correction"]'
      : ["remove-failed", "remove-unknown"].includes(correction.status)
        ? "#correction-remove-failure-v15"
        : "#correction-remove-pre-effect-connection-v15";
    render();
    announceCorrectionV15(state.shell.connection === "checking"
      ? "Connection check in progress. The Correction remains displayed and no removal was attempted."
      : "Still disconnected. The Correction remains displayed and no removal was attempted.", { assertive: true });
    return;
  }
  const operationOrigin = correctionOperationOriginV15("remove", correction, retry);
  if (!operationOrigin) {
    announceCorrectionV15(correction.failure?.message || CORRECTION_COPY_V15.removeFailure, { assertive: true });
    return;
  }
  if (correctionOperationBranchV15() === "stale-before-effect") {
    if (representCorrectionSourceRevisionChangeV15(correction)) {
      state.modal.focusSelector = "#correction-remove-failure-v15";
      render();
    }
    return;
  }
  const intentKey = correction.intentKey || nextCorrectionIntentV15("remove", correction);
  const token = beginOp("correction", intentKey);
  if (!token) return;
  const envelope = correctionOperationEnvelopeV15(token, correction, intentKey, operationOrigin);
  dispatchShell("CORRECTION_REMOVE_START", envelope);
  if (state.shell.correction.operation?.operationId !== token.id) {
    finishOp(token);
    return;
  }
  state.modal.focusSelector = "#correction-remove-status-v15";
  render();
  scheduleOp(token, () => {
    if (correctionOperationBranchV15() === "session-interruption") {
      expireShellSessionV10();
      return;
    }
    const removed = settleCorrectionRemovalV15(intentKey, envelope);
    if (removed === true) {
      const sourceHandle = state.modal?.sourceHandle;
      closeCorrectionModalEntryV15({
        alreadyClosed: true,
        returnSelector: sourceHandle ? `#correction-card-title-${sourceHandle}` : "#journal-day-title-v14",
      });
      return;
    }
    if (removed === false) {
      state.modal.focusSelector = state.shell.correction.status === "remove-unknown"
        ? '[data-action="retry-remove-correction"]'
        : "#correction-remove-failure-v15";
    }
    render();
  });
  if (correctionOperationBranchV15() === "rapid-repeat") removeCorrectionV15({ retry });
  if (correctionOperationBranchV15() === "navigate-before-completion") {
    schedulePrivateArchiveTimeoutV13(() => {
      if (!isCurrentOp(token) || state.modal?.type !== "remove-correction-v15") return;
      window.history.back();
    }, 180);
  }
}

function requestCorrectionLeaveV10(reason = "leave", navigation = null) {
  const editorInput = modalRoot.querySelector("#correction-draft-v10");
  flushShellCompositionHistoryV15(editorInput);
  invalidateShellCompositionHistoryV15(editorInput);
  if (state.modal?.type === "leave-correction-v10" && state.shell.leaveConfirm) {
    if (!pendingLeaveNavigation && navigation) pendingLeaveNavigation = navigation;
    return true;
  }
  const sourceHandle = state.modal?.sourceHandle;
  const scrollY = state.modal?.scrollY ?? window.scrollY;
  const historyEntryId = state.modal?.historyEntryId || null;
  const originHistoryEntryId = state.modal?.originHistoryEntryId || null;
  const activeBeforeLeave = document.activeElement;
  const returnEditorFocusSelector = activeBeforeLeave?.id
    ? `#${CSS.escape(activeBeforeLeave.id)}`
    : selectorForLogicalFocus(activeBeforeLeave);
  const cardScrollTop = Number(modalRoot.querySelector("[data-modal-card]")?.scrollTop ?? state.modal?.cardScrollTop) || 0;
  const bodyScrollTop = Number(modalRoot.querySelector(".correction-sheet-body-v15")?.scrollTop ?? state.modal?.bodyScrollTop) || 0;
  const editorScrollTop = Number(modalRoot.querySelector("#correction-draft-v10")?.scrollTop ?? state.modal?.editorScrollTop) || 0;
  const previousShell = state.shell;
  dispatchShell("LEAVE_REQUEST", { reason });
  if (state.shell === previousShell) return false;
  pendingLeaveNavigation = navigation;
  state.modal = { type: "leave-correction-v10", focusSelector: '[data-action="keep-shell-correction"]', sourceHandle, scrollY, historyEntryId, originHistoryEntryId, cardScrollTop: 0, returnCardScrollTop: cardScrollTop, returnBodyScrollTop: bodyScrollTop, returnEditorScrollTop: editorScrollTop, returnEditorFocusSelector };
  render();
  return true;
}

function expireShellSessionV10({ delayedCallbackPayload = null } = {}) {
  const activeCorrectionOperation = state.shell.correction.operation;
  const canArmDelayedCallbackFixture = Boolean(delayedCallbackPayload)
    && state.shell.correction.status === "saving"
    && activeCorrectionOperation?.kind === "save"
    && delayedCallbackPayload.intentKey === activeCorrectionOperation.intentKey
    && delayedCallbackPayload.operationKey === activeCorrectionOperation.operationKey
    && delayedCallbackPayload.operationId === activeCorrectionOperation.operationId
    && delayedCallbackPayload.operationGeneration === activeCorrectionOperation.generation
    && delayedCallbackPayload.operationOrigin === activeCorrectionOperation.origin
    && delayedCallbackPayload.sourceSnapshot === activeCorrectionOperation.sourceSnapshot;
  const hadDraft = state.shell.correction.dirty;
  inheritedAsyncGenerationV10 += 1;
  state.generation = {};
  cancelShellOperations();
  clearCorrectionCallbackReplayV15();
  dispatchShell("SESSION_EXPIRE", { hadDraft });
  if (canArmDelayedCallbackFixture) {
    const correctionOperationActive = [...shellOperations.values()].some((token) => token.kind === "correction");
    const teardownComplete = !correctionOperationActive
      && !state.shell.correction.operation
      && Object.keys(state.shell.ops.active).length === 0
      && Object.keys(state.shell.representedCorrections).length === 0
      && Object.keys(state.shell.correctionResults).length === 0
      && Object.keys(state.shell.correctionSourceRevisions).length === 0;
    const afterExpiry = state.shell;
    dispatchShell("CORRECTION_SAVE_READY", delayedCallbackPayload);
    expiredSessionCallbackProbeV15 = teardownComplete && state.shell === afterExpiry ? "ignored" : "unexpected";
  } else expiredSessionCallbackProbeV15 = null;
  clearShellBoundaryTransientsV10();
  state.modal = null;
  resetShellViewV10();
  resetSessionHistoryV13();
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
  const correctionSaving = ["saving", "reconciling"].includes(state.shell.correction.status);
  const correctionRemoving = ["removing", "remove-reconciling"].includes(state.shell.correction.status);
  const correctionPending = correctionSaving || correctionRemoving;
  const serverPending = state.shell.server.status === "pending";
  cancelShellOperations(correctionPending ? ["month", "media", "server"] : ["month", "media", "correction", "server"]);
  if (hadPendingMonth) dispatchShell("MONTH_CANCEL");
  pendingMedia.forEach((photoId) => dispatchShell("MEDIA_RETRY_FAIL", { photoId }));
  if (serverPending) dispatchShell("SERVER_RETRY_FAIL");
  if (state.dateReview.assignment.status === "assigning" || dateReviewTimersV11.size) cancelDateReviewOperationsV11();
  if (state.view === "telegram-capture" || state.capture.active || captureTimersV13.size) {
    cancelCaptureForManualNavigationV13();
  }
}

function sourceConflictNavigationIsLockedV16(stage) {
  return ["review-loading", "resolution-pending", "resolution-unknown", "reconciling", "session-ended"].includes(stage);
}

function sourceConflictNavigationLockCopyV16(stage) {
  if (stage === "review-loading") return "Loading source update. Navigation remains locked.";
  if (stage === "resolution-pending") return "Resolving source update. Navigation remains locked.";
  if (stage === "session-ended") return SOURCE_CONFLICT_COPY_V16.session;
  return "Check the original resolution status before leaving.";
}

function sourceConflictNavigationDestinationV16(control, action) {
  if (action === "set-view") return { kind: "view", view: control.dataset.view };
  if (action === "open-settings") return { kind: "settings", section: control.dataset.section || "overview", focusSelector: "#settings-section-heading" };
  if (action === "open-more") return { kind: "more", focusSelector: "[data-modal-card]", returnFocusSelector: '[data-action="open-more"]' };
  if (action === "open-date-review") return { kind: "date-review", focusSelector: "#date-review-title-v11" };
  if (action === "open-upload") {
    const date = resolveUploadDayDomTokenV14(control.dataset.date) || null;
    return { kind: "upload", date, focusSelector: "#upload-modal-title", returnFocusSelector: uploadReturnFocusSelector(control, date) };
  }
  return { kind: "review" };
}

function guardSourceConflictNavigationV16(destination, { event = null, guardDirty = true } = {}) {
  if (state.view !== "source-conflict") return false;
  const model = state.sourceConflict;
  if (sourceConflictNavigationIsLockedV16(model.stage)) {
    event?.preventDefault();
    announceSourceConflictV16(sourceConflictNavigationLockCopyV16(model.stage), { assertive: true });
    return true;
  }
  if (!guardDirty || !model.dirty) return false;
  event?.preventDefault();
  requestSourceConflictWorkspaceLeaveV16(destination);
  return true;
}

function handleSourceConflictActionV16(control, action, event) {
  const model = state.sourceConflict;
  if (pendingSourceConflictPopReboundV16 && action !== "toggle-theme") {
    event.preventDefault();
    return true;
  }
  if (model.stage === "session-ended" && action !== "resume-source-conflict-session") {
    event.preventDefault();
    announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.session, { assertive: true });
    return true;
  }
  if (action === "expire-shell-session" && model.active && (state.view === "source-conflict" || model.dirty || model.operation)) {
    event.preventDefault();
    expireSourceConflictSessionV16();
    return true;
  }
  const fixtureActions = new Set(["set-source-conflict-fixture", "set-source-conflict-branch", "open-source-conflict-fixture", "settle-source-conflict-load", "inject-source-conflict-r3", "deliver-competing-source-conflict-outcome", "replay-source-conflict-callback", "fail-after-source-conflict-success", "callback-after-source-conflict-reset", "reset-source-conflict-fixture", "expire-source-conflict-session"]);
  const presentationOnlyActions = new Set(["toggle-theme"]);
  const conflictActions = new Set([
    ...fixtureActions,
    "review-source-conflict", "cancel-source-conflict", "set-source-conflict-view", "toggle-source-conflict-unchanged", "select-source-conflict-document",
    "preview-source-conflict-outcome", "close-source-conflict-preview", "source-conflict-preview-backdrop", "confirm-source-conflict-outcome",
    "cancel-source-conflict-workspace", "save-source-conflict-correction", "retry-source-conflict-load", "retry-source-conflict-resolution",
    "check-source-conflict-status", "review-latest-source-conflict", "keep-source-conflict-editing", "discard-source-conflict-and-leave",
    "resume-source-conflict-session",
  ]);
  const permittedInPlaceRecovery = state.view === "source-conflict"
    && ((action === "check-source-conflict-status" && model.stage === "resolution-unknown")
      || (action === "resume-source-conflict-session" && model.stage === "session-ended"));
  const navigationDestination = sourceConflictNavigationDestinationV16(control, action);
  if (!fixtureActions.has(action)
    && !presentationOnlyActions.has(action)
    && !permittedInPlaceRecovery
    && guardSourceConflictNavigationV16(navigationDestination, { event, guardDirty: !conflictActions.has(action) })) {
    return true;
  }
  if (presentationOnlyActions.has(action)) return false;
  if (!conflictActions.has(action)) return false;
  event.preventDefault();
  if (action === "set-source-conflict-fixture") {
    if (model.operation) return true;
    const fixture = Object.hasOwn(SOURCE_CONFLICT_FIXTURES_V16, control.dataset.conflictFixture) ? control.dataset.conflictFixture : "primary";
    clearSourceConflictTimersV16();
    dispatchSourceConflictV16("FIXTURE_SET", { fixture });
    state.focusAfterRender = `[data-action="set-source-conflict-fixture"][data-conflict-fixture="${CSS.escape(fixture)}"]`;
    render();
    announceSourceConflictV16("Source conflict fixture selected.");
    return true;
  }
  if (action === "set-source-conflict-branch") {
    if (model.operation || !Object.hasOwn(SOURCE_CONFLICT_BRANCHES_V16, control.dataset.conflictBranch)) return true;
    dispatchSourceConflictV16("BRANCH_SET", { branch: control.dataset.conflictBranch });
    state.focusAfterRender = `[data-action="set-source-conflict-branch"][data-conflict-branch="${CSS.escape(state.sourceConflict.branch)}"]`;
    render();
    announceSourceConflictV16(`Conflict branch set to ${SOURCE_CONFLICT_BRANCHES_V16[state.sourceConflict.branch]}.`);
    return true;
  }
  if (action === "open-source-conflict-fixture") {
    prepareSourceConflictFixtureV16();
    return true;
  }
  if (action === "reset-source-conflict-fixture") {
    resetSourceConflictFixtureV16();
    return true;
  }
  if (action === "review-source-conflict") {
    openSourceConflictV16(control);
    return true;
  }
  if (action === "settle-source-conflict-load") {
    completeSourceConflictLoadV16();
    return true;
  }
  if (action === "retry-source-conflict-load") {
    retrySourceConflictLoadV16();
    return true;
  }
  if (action === "cancel-source-conflict") {
    cancelSourceConflictV16();
    return true;
  }
  if (action === "set-source-conflict-view") {
    if (model.stage !== "review-ready" || !["complete", "changes"].includes(control.dataset.conflictView)) return true;
    const scrollY = window.scrollY;
    dispatchSourceConflictV16("COMPARE_MODE_SET", { mode: control.dataset.conflictView });
    state.focusAfterRender = `[data-action="set-source-conflict-view"][data-conflict-view="${CSS.escape(control.dataset.conflictView)}"]`;
    render();
    withInstantScroll(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
    return true;
  }
  if (action === "toggle-source-conflict-unchanged") {
    const scrollY = window.scrollY;
    dispatchSourceConflictV16("UNCHANGED_TOGGLE");
    state.focusAfterRender = '[data-action="toggle-source-conflict-unchanged"]';
    render();
    withInstantScroll(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
    return true;
  }
  if (action === "select-source-conflict-document") {
    const documentKind = control.dataset.conflictDocument === "revision" ? "r2" : "c1";
    dispatchSourceConflictV16("COMPACT_DOCUMENT_SET", { document: documentKind });
    state.focusAfterRender = `[data-action="select-source-conflict-document"][data-conflict-document="${documentKind === "c1" ? "correction" : "revision"}"]`;
    render();
    return true;
  }
  if (action === "preview-source-conflict-outcome") {
    openSourceConflictPreviewV16(control.dataset.conflictOutcome, control);
    return true;
  }
  if (["close-source-conflict-preview", "source-conflict-preview-backdrop"].includes(action)) {
    if (action === "source-conflict-preview-backdrop" && event.target !== control) return true;
    closeSourceConflictPreviewV16();
    return true;
  }
  if (action === "confirm-source-conflict-outcome") {
    const outcome = model.outcome;
    if (outcome === "based-on-both") openSourceConflictWorkspaceV16();
    else beginSourceConflictResolutionV16(outcome);
    return true;
  }
  if (action === "cancel-source-conflict-workspace") {
    requestSourceConflictWorkspaceLeaveV16({ kind: "review" });
    return true;
  }
  if (action === "save-source-conflict-correction") {
    if (model.branch === "workspace-connection") {
      state.sourceConflict.lastProbe = "Workspace connection interruption · draft retained · zero effect";
      render();
      announceSourceConflictV16(SOURCE_CONFLICT_COPY_V16.workspaceConnection, { assertive: true });
    } else beginSourceConflictResolutionV16("based-on-both");
    return true;
  }
  if (action === "keep-source-conflict-editing") {
    keepSourceConflictEditingV16();
    return true;
  }
  if (action === "discard-source-conflict-and-leave") {
    discardSourceConflictAndLeaveV16();
    return true;
  }
  if (action === "retry-source-conflict-resolution") {
    retrySourceConflictResolutionV16();
    return true;
  }
  if (action === "check-source-conflict-status") {
    if (!permittedInPlaceRecovery) return true;
    checkSourceConflictStatusV16();
    return true;
  }
  if (action === "inject-source-conflict-r3") {
    injectSourceConflictR3V16();
    return true;
  }
  if (action === "review-latest-source-conflict") {
    reviewLatestSourceConflictV16();
    return true;
  }
  if (action === "deliver-competing-source-conflict-outcome") {
    deliverCompetingSourceConflictOutcomeV16(control.dataset.conflictOutcome);
    return true;
  }
  if (action === "replay-source-conflict-callback") {
    replaySourceConflictCallbackV16("success");
    return true;
  }
  if (action === "fail-after-source-conflict-success") {
    replaySourceConflictCallbackV16("failure");
    return true;
  }
  if (action === "callback-after-source-conflict-reset") {
    let heldNeutralEnvelope = neutralSourceConflictReplayEnvelopeV16(sourceConflictReplayEnvelopeV16);
    resetSourceConflictFixtureV16();
    if (!heldNeutralEnvelope) {
      state.sourceConflict.lastProbe = "No prior callback · reset remained empty";
      render();
      return true;
    }
    const before = sourceConflictCallbackEffectSnapshotV16();
    dispatchSourceConflictCallbackV16(heldNeutralEnvelope);
    assertSourceConflictCallbackNoEffectV16(before, "Callback after reset ignored · zero effect");
    heldNeutralEnvelope = null;
    return true;
  }
  if (action === "expire-source-conflict-session") {
    expireSourceConflictSessionV16();
    return true;
  }
  if (action === "resume-source-conflict-session") {
    resumeSourceConflictSessionV16();
    return true;
  }
  return false;
}

function handleClick(event) {
  if (pendingCorrectionCloseTraversalV15) {
    event.preventDefault();
    announceCorrectionV15("Returning to the Correction origin. Try again after it is restored.", { assertive: true });
    return;
  }
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const action = control.dataset.action;
  if (handleSourceConflictActionV16(control, action, event)) return;
  if (state.modal?.type === "upload"
    && pendingUploadPopstateReboundV14
    && ["close-modal", "modal-backdrop", "confirm-upload", "upload-cancel", "upload-add-anyway", "upload-retry", "upload-restore-connection", "view-upload-day"].includes(action)) {
    event.preventDefault();
    announceUploadV14("Return to the upload dialog is still in progress. Try again after it is restored.");
    return;
  }
  if (["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type)
    && (pendingPopGuard || pendingCorrectionPopstateReboundV15)
    && ["close-modal", "modal-backdrop", "save-shell-correction", "retry-shell-correction", "cancel-shell-correction", "close-shell-correction", "keep-shell-correction", "discard-shell-correction", "keep-displayed-correction", "confirm-remove-correction", "retry-remove-correction", "review-correction-source-update", "check-shell-connection"].includes(action)) {
    event.preventDefault();
    announceCorrectionV15("Return to the Correction dialog is still in progress. Try again after it is restored.", { assertive: true });
    return;
  }
  if (action === "save-shell-correction" && ["saving", "reconciling"].includes(state.shell.correction.status)) {
    event.preventDefault();
    modalRoot.querySelector("#correction-operation-status-v10")?.focus({ preventScroll: true });
    return;
  }
  if (control.disabled || control.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    if (action === "save-shell-correction") {
      if (state.shell.connection !== "connected") {
        state.modal.focusSelector = "#correction-pre-effect-connection-v15";
        render();
        announceCorrectionV15(CORRECTION_COPY_V15.connection, { assertive: true });
      } else {
        const liveEditor = modalRoot.querySelector("#correction-draft-v10");
        if (liveEditor && !liveEditor.disabled) {
          dispatchShell("CORRECTION_VALIDATE", {
            selection: { start: liveEditor.selectionStart, end: liveEditor.selectionEnd, direction: liveEditor.selectionDirection },
            editorIncarnation: correctionEditorIncarnationsV15.get(liveEditor),
          });
        }
        state.modal.focusSelector = "#correction-draft-v10";
        render();
      }
    }
    if (["confirm-upload", "upload-add-anyway", "upload-retry"].includes(action)) {
      announceUploadV14("Upload unavailable while the connection is interrupted. Restore the connection to continue.");
    }
    return;
  }
  const date = resolveUploadDayDomTokenV14(control.dataset.date);

  if (action === "toggle-shell-lab") {
    state.shellLabOpen = !control.parentElement.open;
    return;
  }
  if (action === "set-correction-branch") {
    if (["saving", "reconciling", "removing", "remove-reconciling"].includes(state.shell.correction.status)) return;
    if (control.dataset.correctionBranch !== "missing-return-card") correctionHiddenSourceHandlesV15.clear();
    dispatchShell("CORRECTION_BRANCH_SET", { branch: control.dataset.correctionBranch });
    state.focusAfterRender = `[data-action="set-correction-branch"][data-correction-branch="${CSS.escape(state.shell.correctionBranch)}"]`;
    render();
    announceCorrectionV15(`Correction branch set to ${CORRECTION_BRANCHES_V15[state.shell.correctionBranch]}.`);
    return;
  }
  if (action === "open-correction-fixture") {
    const kind = ["uploaded", "long"].includes(control.dataset.correctionKind) ? control.dataset.correctionKind : "voice";
    openCorrectionFixtureV15(kind);
    return;
  }
  if (action === "open-existing-correction-fixture") {
    openCorrectionFixtureV15("uploaded", { existing: true });
    return;
  }
  if (action === "test-missing-base-correction") {
    runMissingBaseCorrectionFixtureV15();
    return;
  }
  if (action === "test-stale-editor-input") {
    runStaleEditorInputProbeV15();
    return;
  }
  if (action === "reset-correction-fixture") {
    resetCorrectionFixtureV15();
    return;
  }
  if (action === "reset-dirty-correction-fixture") {
    if (state.modal?.type !== "correction-v10"
      || state.shell.correctionBranch !== "reset-while-dirty"
      || !state.shell.correction.dirty
      || ["saving", "reconciling", "unknown", "saved"].includes(state.shell.correction.status)) return;
    resetCorrectionFixtureV15();
    return;
  }
  if (["replay-correction-callback", "fail-after-correction-success", "callback-after-correction-reset"].includes(action)) {
    const kind = control.dataset.callbackKind === "remove" ? "remove" : "save";
    const variant = action === "fail-after-correction-success"
      ? "failure"
      : action === "callback-after-correction-reset"
        ? "after-reset"
        : "ready";
    runCorrectionCallbackReplayFixtureV15(kind, variant, selectorForLogicalFocus(control));
    return;
  }

  if (action === "open-capture-companion" || action === "capture-open-selected") {
    openCaptureCompanionV13(control);
    return;
  }
  if (action === "capture-select") {
    selectCaptureFixtureV13({ group: control.dataset.captureGroup, key: control.dataset.captureKey }, { open: true });
    return;
  }
  if (action === "capture-branch") {
    if (captureSelectedFixtureV13().kind === "duplicate") return;
    const fixtureIdentity = state.capture.fixtureIdentity;
    const hasDurableCaptureTruth = Boolean(fixtureIdentity) && (
      captureCommittedIdentitiesV13.has(fixtureIdentity)
      || [...captureCommittedIdentitiesV13].some((identity) => identity.startsWith(`${fixtureIdentity}:member-`))
    );
    cancelCaptureOperationsV13({
      keepTerminal: hasDurableCaptureTruth,
      stage: hasDurableCaptureTruth ? state.capture.stage : "selected",
    });
    dispatchCaptureV13("BRANCH_SET", { branch: control.dataset.captureBranch });
    state.focusAfterRender = `[data-action="capture-branch"][data-capture-branch="${CSS.escape(state.capture.branch)}"]`;
    render();
    announceCaptureV13(`Operation branch set to ${CAPTURE_OPERATION_BRANCHES_V13[state.capture.branch]}.`);
    return;
  }
  if (action === "capture-duplicate-branch") {
    if (state.capture.active) return;
    const selection = { ...state.capture.selection };
    const branch = control.dataset.captureBranch;
    if (branch !== "concurrent-permit") clearCaptureTimersV13();
    const concurrentLedger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
    const concurrentMutationSettled = concurrentLedger?.secondaryStatus === "added";
    const resumableTerminal = !concurrentMutationSettled
      && ["duplicate-decision", "duplicate-check-failed", "duplicate-add-failed", "interrupted"].includes(state.capture.terminal?.type);
    if (!resumableTerminal) selectCaptureFixtureV13(selection, { open: true });
    dispatchCaptureV13("DUPLICATE_BRANCH_SET", { branch });
    const concurrentDecisionAvailable = state.capture.terminal?.type === "duplicate-decision"
      || Boolean(state.capture.terminal?.decisionPreserved);
    if (branch === "concurrent-permit" && concurrentDecisionAvailable) {
      const ledger = initializeConcurrentPermitLedgerV13();
      if (ledger && state.shell.connection !== "connected") ledger.freshnessUnknown = true;
    }
    if (branch !== "concurrent-permit") captureConcurrentPermitLedgerV13.delete(state.capture.fixtureIdentity);
    state.focusAfterRender = `[data-action="capture-duplicate-branch"][data-capture-branch="${CSS.escape(state.capture.duplicateBranch)}"]`;
    render();
    announceCaptureV13(`Duplicate operation branch set to ${CAPTURE_DUPLICATE_BRANCHES_V13[state.capture.duplicateBranch]}.`);
    return;
  }
  if (action === "capture-reset") {
    selectCaptureFixtureV13({ group: "scenario", key: "guide" }, { open: true });
    return;
  }
  if (action === "capture-run") {
    beginCaptureOperationV13();
    return;
  }
  if (action === "capture-retry") {
    beginCaptureOperationV13({ retry: true });
    return;
  }
  if (action === "capture-duplicate-permit") {
    beginDuplicatePermitV13();
    return;
  }
  if (action === "capture-duplicate-cancel") {
    const terminal = state.capture.terminal;
    const concurrentLedger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
    const resumingDecision = terminal?.type === "interrupted" && terminal.decisionPreserved;
    const activePermit = state.capture.active?.intended === "duplicate-permit";
    if (captureSelectedFixtureV13().kind !== "duplicate" || (state.capture.active && !activePermit) || (terminal?.type !== "duplicate-decision" && !resumingDecision)) return;
    cancelCaptureOperationsV13({
      stage: "duplicate-cancelled",
      terminal: { type: "duplicate-cancelled", stage: "duplicate-cancelled" },
      preserveConcurrentSecondary: state.capture.duplicateBranch === "concurrent-permit",
    });
    renderCaptureOutcomeWithGuardedFocusV13([
      '[data-action="capture-duplicate-cancel"]',
      '[data-action="capture-duplicate-permit"]',
    ]);
    const cancelAnnouncement = concurrentLedger?.secondaryStatus === "added"
      ? "Message A duplicate not added. Message B remains added."
      : concurrentLedger?.secondaryStatus === "pending"
        ? "Message A duplicate not added. Message B permit remains pending."
        : concurrentLedger
          ? "Message A duplicate not added. Message B remains decision ready."
          : "Duplicate not added. Nothing changed.";
    announceCaptureV13(cancelAnnouncement);
    return;
  }
  if (action === "capture-replay-duplicate-message") {
    replaySettledDuplicateMessageV13();
    return;
  }
  if (action === "capture-replay-pending-duplicate-message") {
    replayPendingDuplicateMessageV13();
    return;
  }
  if (action === "capture-deliver-different-duplicate-message") {
    deliverDifferentDuplicateMessageV13();
    return;
  }
  if (action === "capture-concurrent-permit-secondary") {
    beginConcurrentSecondaryPermitV13();
    return;
  }
  if (action === "capture-back") {
    captureBackV13();
    return;
  }
  if (action === "capture-handoff-back") {
    window.history.back();
    return;
  }
  if (action === "capture-change-date") {
    openCaptureChangeDateV13(control);
    return;
  }
  if (action === "capture-view-day") {
    viewCaptureDayV13(control);
    return;
  }
  if (action === "capture-view-concurrent-day") {
    viewConcurrentDuplicateDayV13(control);
    return;
  }
  if (action === "capture-view-concurrent-existing-day") {
    viewConcurrentDuplicateExistingDayV13(control);
    return;
  }
  if (action === "capture-view-existing-duplicate-day") {
    viewExistingDuplicateDayV13(control);
    return;
  }
  if (action === "view-related-media-day") {
    viewRelatedMediaDayV13(control);
    return;
  }
  if (action === "capture-review-date") {
    openCaptureReviewDateV13(control);
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

  if (action === "set-upload-fixture") {
    if (state.modal?.type === "upload") return;
    clearUploadTimersV14();
    state.upload = transitionUploadV14(state.upload, "FIXTURE_SET", { fixture: control.dataset.uploadFixture });
    state.focusAfterRender = `[data-action="set-upload-fixture"][data-upload-fixture="${CSS.escape(state.upload.fixture)}"]`;
    render();
    announceUploadV14("Fictional upload file fixture selected.");
    return;
  }
  if (action === "set-upload-branch") {
    if (state.modal?.type === "upload") return;
    state.upload = transitionUploadV14(state.upload, "BRANCH_SET", { branch: control.dataset.uploadBranch });
    state.focusAfterRender = `[data-action="set-upload-branch"][data-upload-branch="${CSS.escape(state.upload.branch)}"]`;
    render();
    announceUploadV14(`Upload branch set to ${UPLOAD_BRANCHES_V14[state.upload.branch]}.`);
    return;
  }
  if (action === "open-upload-global-fixture") {
    openUpload(null, '[data-action="open-upload-global-fixture"]');
    return;
  }
  if (action === "open-upload-inline-fixture") {
    openUpload("2026-08-13", '[data-action="open-upload-inline-fixture"]');
    return;
  }
  if (action === "run-upload-fixture") {
    if (isFirstUseFixture()) resetUploadScenarioV14({ focusConsole: false });
    const fixture = UPLOAD_FIXTURES_V14[state.upload.fixture];
    if (!openUpload(fixture.date, '[data-action="run-upload-fixture"]')) return;
    applyUploadFixtureV14();
    return;
  }
  if (action === "reset-upload-fixture") {
    resetUploadScenarioV14();
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
    const uploadModalWasOpen = state.modal?.type === "upload";
    if (["interrupted", "checking"].includes(state.shell.connection)) dispatchShell("CONNECTION_RESTORE");
    else {
      const concurrentLedger = captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity);
      if (state.dateReview.assignment.status === "assigning" || dateReviewTimersV11.size) cancelDateReviewOperationsV11({ preserveFailure: true });
      const uploadOperationWasActive = uploadModalWasOpen
        && state.upload.candidate
        && (Boolean(state.upload.active) || ["checking", "reconciling", "uploading", "saving"].includes(state.upload.stage));
      if (uploadOperationWasActive) {
        const retryTarget = ["checking", "reconciling"].includes(state.upload.stage) ? "check" : "commit";
        const activeToken = state.upload.active;
        const resultStillUnknown = state.upload.stage === "reconciling" && state.upload.resultStatus === "unknown";
        clearUploadTimersV14();
        state.upload = transitionUploadV14(state.upload, "INTERRUPT", {
          token: activeToken || undefined,
          retryTarget,
          resultStatus: resultStillUnknown ? "unknown" : "known-zero",
          error: resultStillUnknown
            ? "The previous upload result is still unknown in this tab. Retry will check it before creating anything."
            : "Upload interrupted. Nothing was added. Your file and Journal Date remain selected in this tab. Retry.",
        });
      }
      if (state.capture.active) {
        cancelCaptureOperationsV13({
          stage: "interrupted",
          terminal: { type: "interrupted", stage: "interrupted" },
          retryAvailable: true,
        });
      } else if (state.capture.terminal?.type === "duplicate-decision") {
        cancelCaptureOperationsV13({
          keepTerminal: true,
          stage: "interrupted",
          terminal: {
            type: "interrupted",
            stage: "interrupted",
            interruptedAt: "duplicate-decision",
            interruptedStep: "duplicate-decision",
            decisionPreserved: true,
            freshnessUnknown: true,
          },
        });
      } else if (captureConcurrentPermitLedgerV13.get(state.capture.fixtureIdentity)?.secondaryStatus === "pending") {
        cancelCaptureOperationsV13({ keepTerminal: true, stage: state.capture.stage, terminal: { ...state.capture.terminal, freshnessUnknown: true } });
      } else if (state.capture.terminal?.type === "partial" && !state.capture.terminal.retryAvailable && captureSelectedFixtureV13().key === "t3") {
        cancelCaptureOperationsV13({
          stage: "partial",
          terminal: { ...state.capture.terminal, retryAvailable: true },
          });
      }
      if (concurrentLedger?.secondaryStatus === "decision") concurrentLedger.freshnessUnknown = true;
      dispatchShell("CONNECTION_INTERRUPT");
    }
    if (uploadModalWasOpen && state.modal?.type === "upload") {
      renderUploadWithGuardedFocusV14(state.upload.stage === "interrupted" ? "#upload-failure-title-v14" : null);
      if (state.shell.connection === "connected") {
        announceUploadV14(state.upload.stage === "interrupted"
          ? "Connection restored. Retry remains explicit."
          : "Connection restored. Upload choices remain unchanged.");
      }
      else if (state.upload.stage === "interrupted") {
        announceUploadV14(state.upload.resultStatus === "unknown"
          ? "Previous upload result remains unknown. Retry will reconcile it."
          : "Upload interrupted. Nothing was added.");
      }
      else if (state.shell.connection !== "connected") announceUploadV14("Upload choices remain unchanged. Restore the connection to continue.");
      return;
    }
    state.focusAfterRender = '[data-action="toggle-shell-connection"]';
    render();
    announceShell(state.shell.connection === "connected" ? "Connection restored in this prototype." : "Connection interrupted.");
    return;
  }
  if (action === "toggle-shell-server-variant") {
    if (uploadDismissalLockedV14()) {
      announceUploadV14(uploadLockedExplanationV14("Upload in progress. Server-state reset is available after the represented result settles."));
      return;
    }
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
    openShellCorrectionV10(control.dataset.correctionHandle, selectorForLogicalFocus(control));
    return;
  }
  if (action === "remove-correction") {
    openCorrectionRemovalV15(control.dataset.correctionHandle, selectorForLogicalFocus(control));
    return;
  }
  if (action === "save-shell-correction") {
    if (correctionOperationBranchV15() === "touch-compatibility-click") runTouchCompatibilitySaveFixtureV15();
    else saveShellCorrectionV10();
    return;
  }
  if (action === "retry-shell-correction") {
    if (state.shell.connection !== "connected") {
      dispatchShell("CONNECTION_CHECK_FAIL");
      state.modal.focusSelector = '[data-action="retry-shell-correction"]';
      render();
      announceCorrectionV15("Still disconnected. Nothing was saved.", { assertive: true });
    } else saveShellCorrectionV10({ retry: true });
    return;
  }
  if (action === "keep-displayed-correction") {
    if (correctionHasUnresolvedSourceRaceV15(state.shell.correction)
      || ["removing", "remove-reconciling", "remove-unknown"].includes(state.shell.correction.status)) {
      announceCorrectionV15("Resolve the current Correction result before leaving.", { assertive: true });
      return;
    }
    cancelShellOperations(["correction"]);
    closeCorrectionModalEntryV15({ announcement: "Correction kept. Display state did not change." });
    return;
  }
  if (action === "confirm-remove-correction") {
    removeCorrectionV15();
    return;
  }
  if (action === "retry-remove-correction") {
    removeCorrectionV15({ retry: true });
    return;
  }
  if (action === "review-correction-source-update") {
    announceCorrectionV15("Source update review is available in v16. No source revision was selected or merged.", { assertive: true });
    return;
  }
  if (action === "cancel-shell-correction") {
    if (correctionHasUnresolvedSourceRaceV15(state.shell.correction)
      || ["saving", "reconciling", "unknown"].includes(state.shell.correction.status)) {
      announceCorrectionV15("Resolve the current Correction result before leaving.", { assertive: true });
      return;
    }
    if (state.shell.correction.dirty) requestCorrectionLeaveV10("cancel", { kind: "close" });
    else closeCorrectionModalEntryV15();
    return;
  }
  if (action === "close-shell-correction") {
    if (correctionHasUnresolvedSourceRaceV15(state.shell.correction)
      || ["saving", "reconciling", "unknown", "removing", "remove-reconciling", "remove-unknown"].includes(state.shell.correction.status)) {
      announceCorrectionV15("Resolve the current Correction result before leaving.", { assertive: true });
      return;
    }
    const sourceHandle = state.modal?.sourceHandle;
    closeCorrectionModalEntryV15({ returnSelector: state.shell.correction.returnFocusSelector || (sourceHandle ? `#correction-card-${sourceHandle}` : "#journal-day-title-v14") });
    return;
  }
  if (action === "keep-shell-correction") {
    const leaveModal = state.modal;
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_KEEP");
    state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10", sourceHandle: leaveModal?.sourceHandle, scrollY: leaveModal?.scrollY, historyEntryId: leaveModal?.historyEntryId || null, originHistoryEntryId: leaveModal?.originHistoryEntryId || null, cardScrollTop: leaveModal?.returnCardScrollTop || 0, bodyScrollTop: leaveModal?.returnBodyScrollTop || 0, editorScrollTop: leaveModal?.returnEditorScrollTop || 0, restoreCardScrollAfterFocus: true, restoreBodyScrollAfterFocus: true, restoreEditorScrollAfterFocus: true, restoredLeaveFocusSelector: leaveModal?.returnEditorFocusSelector || null };
    render();
    return;
  }
  if (action === "discard-shell-correction") {
    const leaveModal = state.modal;
    const pending = pendingLeaveNavigation;
    const returnSelector = state.shell.correction.returnFocusSelector;
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_DISCARD");
    state.modal = null;
    const cardReturn = leaveModal?.sourceHandle ? `#correction-card-title-${leaveModal.sourceHandle}` : null;
    const safeReturn = correctionReturnTargetExistsV15(returnSelector)
      ? returnSelector
      : correctionReturnTargetExistsV15(cardReturn)
        ? cardReturn
        : "#journal-day-title-v14";
    state.focusAfterRender = safeReturn;
    const closesDedicatedEntry = pending?.kind === "close"
      && currentHistoryPosition > 0
      && leaveModal?.historyEntryId === window.history.state?.entryId;
    if (closesDedicatedEntry) {
      if (leaveModal?.originHistoryEntryId && historyEntries.has(leaveModal.originHistoryEntryId)) {
        historyEntries.set(leaveModal.originHistoryEntryId, captureHistorySnapshot({
          scrollY: leaveModal.scrollY ?? window.scrollY,
          focusSelector: safeReturn,
          focusTop: null,
        }, historyEntries.get(leaveModal.originHistoryEntryId) || {}));
      }
      historyEntries.set(leaveModal.historyEntryId, captureHistorySnapshot({
        scrollY: leaveModal.scrollY ?? window.scrollY,
        focusSelector: safeReturn,
        focusTop: null,
      }, historyEntries.get(leaveModal.historyEntryId) || {}));
    }
    render();
    if (pending?.kind === "pop" && Number.isFinite(pending.delta) && pending.delta !== 0) {
      window.history.go(pending.delta);
    } else if (closesDedicatedEntry) window.history.back();
    return;
  }
  if (action === "expire-shell-session") {
    expireShellSessionV10();
    return;
  }
  if (action === "start-shell-reauth") {
    clearCorrectionCallbackReplayV15();
    dispatchShell("REAUTH_START");
    state.focusAfterRender = "#session-gate-title-v10";
    render();
    return;
  }
  if (action === "return-from-shell-reauth") {
    cancelShellOperations();
    clearCorrectionCallbackReplayV15();
    clearShellBoundaryTransientsV10();
    dispatchShell("REAUTH_RETURN");
    expiredSessionCallbackProbeV15 = null;
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
    const returnFocusSelector = state.modal.returnFocusSelector;
    state.modal = null;
    setDateReviewDraftV11(chosen, { announce: true, focusAfterRender: returnFocusSelector });
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
    const selectedChapter = state.selectedDate ? root.querySelector(`#chapter-${CSS.escape(uploadDayDomTokenV14(state.selectedDate))}`) : null;
    const currentChapter = root.querySelector("[data-chapter-date].is-current");
    const visibleChapter = [selectedChapter, currentChapter, ...root.querySelectorAll("[data-chapter-date]")]
      .find(chapterIsVisible);
    const anchorDate = settledAnchor?.date
      || resolveUploadDayDomTokenV14(visibleChapter?.dataset.chapterDate)
      || state.almanacVisibleDate
      || state.selectedDate;
    const anchorSelector = anchorDate ? `#chapter-${CSS.escape(uploadDayDomTokenV14(anchorDate))}` : null;
    const rememberedAnchorTop = settledAnchor?.selector === anchorSelector
      ? settledAnchor.top
      : settledReading?.focusSelector === anchorSelector ? settledReading.focusTop : null;
    const anchorTop = Number.isFinite(rememberedAnchorTop)
      ? rememberedAnchorTop
      : anchorSelector ? root.querySelector(anchorSelector)?.getBoundingClientRect().top ?? null : null;
    const restoreToken = beginAlmanacRestorationV13();
    let restoreEpoch = null;
    let expectedEntryId = null;
    const restorationIsCurrent = () => almanacRestoreTokenV13 === restoreToken
      && viewScrollRestoreEpochV13 === restoreEpoch
      && state.view === "almanac"
      && state.screen === "month"
      && !["session-expired", "reauth"].includes(state.shell.phase)
      && window.history.state?.entryId === expectedEntryId;
    const finishRestoration = () => {
      finishAlmanacRestorationV13(restoreToken);
    };
    const restoreReadingAnchor = () => {
      if (!restorationIsCurrent()) return;
      withInstantScroll(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
      const anchor = anchorSelector ? root.querySelector(anchorSelector) : null;
      if (anchor && Number.isFinite(anchorTop)) {
        const delta = anchor.getBoundingClientRect().top - anchorTop;
        if (Math.abs(delta) > 0.5) withInstantScroll(() => window.scrollBy({ top: delta, behavior: "auto" }));
      }
    };
    state.almanacCollapsed = !state.almanacCollapsed;
    window.localStorage.setItem("life-in-days-v9-almanac-collapsed", String(state.almanacCollapsed));
    state.focusAfterRender = '[data-action="toggle-almanac-rail"]';
    syncUrl();
    render();
    restoreEpoch = viewScrollRestoreEpochV13;
    expectedEntryId = window.history.state?.entryId;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (restorationIsCurrent()) restoreReadingAnchor();
    }));
    schedulePrivateArchiveTimeoutV13(() => {
      if (!restorationIsCurrent()) {
        finishRestoration();
        return;
      }
      restoreReadingAnchor();
      finishRestoration();
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
    if (monthDays.length) queueAlmanacDestination(`#chapter-${uploadDayDomTokenV14(monthDays[0].date)}`, `Showing ${monthLabel(monthKey)}.`);
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
      state.focusAfterRender = `[data-calendar-date="${uploadDayDomTokenV14(destinationFocus)}"]`;
      render();
    } else requestCalendarMonthV10(nextMonth, { focusDate: destinationFocus, focusTarget: "calendar-cell" });
  } else if (action === "previous-month" || action === "next-month") {
    requestCalendarMonthV10(shiftMonth(state.month, action === "previous-month" ? -1 : 1));
  } else if (action === "today") {
    if (state.month === today.slice(0, 7)) {
      state.focusDate = today;
      state.focusAfterRender = `[data-calendar-date="${uploadDayDomTokenV14(today)}"]`;
      render();
    } else requestCalendarMonthV10(today.slice(0, 7), { focusDate: today });
  } else if (action === "select-day") showDay(date);
  else if (action === "empty-day") toast(`${longDate(date).replace(/^\w+, /, "")} has no Journal Day. Uploading a journal is the only way to begin this date on the web.`);
  else if (action === "open-day") showDay(date);
  else if (action === "open-full-day") {
    if (state.view === "almanac") {
      const stableReading = state.almanacReadingAnchor;
      const domDate = uploadDayDomTokenV14(date);
      const returnFocusSelector = selectorForLogicalFocus(control)
        || `#chapter-${CSS.escape(domDate)} [data-action="open-full-day"][data-date="${CSS.escape(domDate)}"]`;
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
      state.focusAfterRender = fallbackDate ? `[data-calendar-date="${uploadDayDomTokenV14(fallbackDate)}"]` : '[data-action="set-view"][data-view="calendar"]';
      syncUrl();
      render();
      return;
    }
    state.screen = "month";
    state.focusDate = state.selectedDate;
    state.focusAfterRender = `[data-calendar-date="${uploadDayDomTokenV14(state.selectedDate)}"]`;
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
    const searchResultDay = days[date];
    const captureOnlyResult = Boolean(searchResultDay?.captureOnlyV13);
    const captureLineage = captureDayLineageForFirstArchiveVisitV13(date);
    const privateCaptureResult = captureOnlyResult || Boolean(captureLineage);
    state.scrollByView.search = window.scrollY;
    state.selectedDate = date;
    state.focusDate = date;
    state.month = date.slice(0, 7);
    const capturedPhotoIndex = captureLineage?.captureDayPhotoId
      ? searchResultDay?.photos?.findIndex((photo) => photo.id === captureLineage.captureDayPhotoId)
      : -1;
    if (capturedPhotoIndex >= 0) state.galleryIndex[date] = capturedPhotoIndex;
    else state.galleryIndex[date] ??= 0;
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
      queueAlmanacDestination(`#chapter-${uploadDayDomTokenV14(date)}`, `${longDate(date)} selected in the Almanac.`);
    } else {
      state.view = "calendar";
      state.screen = "day";
      state.focusAfterRender = ".day-detail-header .back-button";
    }
    syncUrl({
      push: true,
      captureDayDate: privateCaptureResult ? date : undefined,
      captureDayPhotoId: privateCaptureResult ? captureLineage?.captureDayPhotoId : undefined,
      fullDayOpenedInApp: privateCaptureResult && state.view === "calendar" ? true : undefined,
    });
    render();
  } else if (action === "open-upload") openUpload(date, uploadReturnFocusSelector(control, date));
  else if (action === "open-manage-reflection") openManageReflection(date);
  else if (action === "close-modal") closeModal();
  else if (action === "modal-backdrop" && event.target === control) closeModal();
  else if (action === "confirm-upload") confirmUpload();
  else if (action === "upload-cancel") cancelUploadFlowV14();
  else if (action === "upload-add-anyway") {
    if (state.shell.connection !== "connected") {
      announceUploadV14("Upload unavailable while the connection is interrupted. Restore the connection to continue.");
      return;
    }
    state.upload = transitionUploadV14(state.upload, "PERMIT");
    beginUploadCommitV14();
  }
  else if (action === "upload-retry") {
    if (state.shell.connection !== "connected") return;
    beginUploadCheckV14({ retry: true, reconcile: true });
  }
  else if (action === "upload-restore-connection") {
    if (state.shell.connection === "connected") return;
    dispatchShell("CONNECTION_RESTORE");
    renderUploadWithGuardedFocusV14('[data-action="upload-retry"]', ['[data-action="upload-restore-connection"]']);
    announceUploadV14(state.upload.resultStatus === "unknown"
      ? "Connection restored. Retry will reconcile the previous upload result."
      : "Connection restored. Retry remains explicit.");
  }
  else if (action === "view-upload-day") viewUploadDayV14();
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
      returnFocusSelector: `[data-action="open-photo"][data-date="${control.dataset.date}"][data-photo-id="${CSS.escape(control.dataset.photoId)}"]`,
    };
    render();
  } else if (action === "make-cover") makeCover(date, control.dataset.photoId);
  else if (action === "move-photo") movePhoto(date, control.dataset.photoId, Number(control.dataset.direction));
  else if (action === "trigger-art") triggerArtwork(date, `[data-action="trigger-art"][data-date="${control.dataset.date}"]`);
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
  } else if (action === "retry-image") toast("Retry simulated. The image remains unavailable so the failure state stays visible.");
  else if (action === "nav-placeholder") toast(`${control.dataset.label} is outside this v10 prototype’s review scope.`);
  else if (["view-provenance", "view-art-history", "regenerate-brief", "change-date", "download-placeholder", "trash-placeholder", "journal-menu", "correct-text", "export-placeholder", "regenerate-reflection", "generation-details"].includes(action)) {
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
  if (control.dataset.action === "upload-date" && state.modal.type === "upload") {
    const validation = validateUploadDateV14(control.value);
    const nextUpload = transitionUploadV14(state.upload, "DATE_SET", { value: control.value, validation });
    if (nextUpload === state.upload) return;
    clearUploadTimersV14();
    clearUploadAnnouncementV14();
    state.upload = nextUpload;
    renderUploadWithGuardedFocusV14("#upload-date");
  }
}

function syncElementAttributesV15(current, next) {
  [...current.attributes].forEach((attribute) => {
    if (!next.hasAttribute(attribute.name)) current.removeAttribute(attribute.name);
  });
  [...next.attributes].forEach((attribute) => current.setAttribute(attribute.name, attribute.value));
}

function replaceSiblingsAroundPreservedChildV15(currentParent, currentChild, nextParent, nextChild) {
  let sibling = currentParent.firstChild;
  while (sibling && sibling !== currentChild) {
    const following = sibling.nextSibling;
    sibling.remove();
    sibling = following;
  }
  sibling = currentChild.nextSibling;
  while (sibling) {
    const following = sibling.nextSibling;
    sibling.remove();
    sibling = following;
  }

  const before = document.createDocumentFragment();
  sibling = nextParent.firstChild;
  while (sibling && sibling !== nextChild) {
    before.append(sibling.cloneNode(true));
    sibling = sibling.nextSibling;
  }
  currentParent.insertBefore(before, currentChild);

  const after = document.createDocumentFragment();
  sibling = nextChild.nextSibling;
  while (sibling) {
    after.append(sibling.cloneNode(true));
    sibling = sibling.nextSibling;
  }
  currentParent.append(after);
}

function reconcileCorrectionEditorDomV15(input, markup = renderCorrectionSheetV10().trim()) {
  if (state.modal?.type !== "correction-v10" || input !== modalRoot.querySelector("#correction-draft-v10")) return;
  const nextMarkup = document.createElement("template");
  nextMarkup.innerHTML = markup.trim();
  const nextInput = nextMarkup.content.querySelector("#correction-draft-v10");
  const currentLabel = input.closest(".correction-editor-field-v15");
  const nextLabel = nextInput?.closest(".correction-editor-field-v15");
  const currentBody = currentLabel?.parentElement;
  const nextBody = nextLabel?.parentElement;
  const currentCard = currentBody?.closest(".correction-sheet-v15");
  const nextCard = nextBody?.closest(".correction-sheet-v15");
  const currentBackdrop = currentCard?.closest(".correction-sheet-backdrop-v15");
  const nextBackdrop = nextCard?.closest(".correction-sheet-backdrop-v15");
  if (!nextInput || !currentLabel || !nextLabel || !currentBody || !nextBody || !currentCard || !nextCard || !currentBackdrop || !nextBackdrop) return false;

  const selection = { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection };
  const editorScrollTop = input.scrollTop;
  syncElementAttributesV15(input, nextInput);
  syncElementAttributesV15(currentLabel, nextLabel);
  replaceSiblingsAroundPreservedChildV15(currentLabel, input, nextLabel, nextInput);
  syncElementAttributesV15(currentBody, nextBody);
  replaceSiblingsAroundPreservedChildV15(currentBody, currentLabel, nextBody, nextLabel);
  syncElementAttributesV15(currentCard, nextCard);
  replaceSiblingsAroundPreservedChildV15(currentCard, currentBody, nextCard, nextBody);
  syncElementAttributesV15(currentBackdrop, nextBackdrop);
  replaceSiblingsAroundPreservedChildV15(currentBackdrop, currentCard, nextBackdrop, nextCard);

  correctionEditorIncarnationsV15.set(input, state.shell.correction.editorIncarnation);
  input.setSelectionRange(selection.start, selection.end, selection.direction);
  input.scrollTop = editorScrollTop;
  return true;
}

let correctionInputReconcileFrameV15 = 0;
let correctionInputReconcileOwnerV15 = null;
const correctionPendingInputSnapshotV15 = new WeakMap();
const correctionCompositionStartV15 = new WeakMap();
const correctionCompositionActiveV15 = new WeakSet();
const correctionCompositionInputAcceptedV15 = new WeakSet();
const correctionCompositionCanceledV15 = new WeakSet();
const correctionCompositionCommitPendingV15 = new WeakSet();
const correctionCompositionFinalizeV15 = new WeakMap();
const correctionCompositionFinalizeTimerV15 = new WeakMap();
const correctionCompositionTailV15 = new WeakSet();
const correctionCanceledRestorationExpectedV15 = new WeakMap();
const correctionCanceledRestorationTaskV15 = new WeakMap();
const correctionCanceledRestorationTailV15 = new WeakSet();
const correctionCompositionTailInputTypesV15 = new Set([
  "insertCompositionText",
  "insertFromComposition",
  "deleteCompositionText",
]);
let correctionCompositionTransactionSequenceV15 = 0;

function clearCanceledCompositionRestorationV15(input) {
  if (!input) return;
  correctionCanceledRestorationTaskV15.delete(input);
  correctionCanceledRestorationExpectedV15.delete(input);
  correctionCanceledRestorationTailV15.delete(input);
}

function armCanceledCompositionRestorationV15(input, expectedSnapshot) {
  clearCanceledCompositionRestorationV15(input);
  correctionCanceledRestorationExpectedV15.set(input, {
    value: expectedSnapshot.value,
    scrollTop: expectedSnapshot.scrollTop,
    selection: { ...expectedSnapshot.selection },
  });
  const task = {};
  correctionCanceledRestorationTaskV15.set(input, task);
  queueMicrotask(() => {
    if (correctionCanceledRestorationTaskV15.get(input) === task) clearCanceledCompositionRestorationV15(input);
  });
}

function correctionInputSnapshotV15(input) {
  return {
    value: input.value,
    scrollTop: input.scrollTop,
    selection: {
      start: input.selectionStart,
      end: input.selectionEnd,
      direction: input.selectionDirection,
    },
  };
}

function correctionInputHistoryV15(input) {
  const editorIncarnation = correctionEditorIncarnationsV15.get(input);
  if (!editorIncarnation
    || state.modal?.type !== "correction-v10"
    || input !== modalRoot.querySelector("#correction-draft-v10")
    || editorIncarnation !== state.shell.correction.editorIncarnation) return null;
  if (!correctionInputUndoV15.has(editorIncarnation)) correctionInputUndoV15.set(editorIncarnation, { undo: [], redo: [] });
  return correctionInputUndoV15.get(editorIncarnation);
}

function recordCorrectionInputUndoV15(input, snapshot, currentValue = input.value) {
  if (!snapshot) return;
  const history = correctionInputHistoryV15(input);
  if (!history) return;
  history.redo.length = 0;
  if (snapshot.value === currentValue) return;
  const prior = history.undo.at(-1);
  if (!prior
    || prior.value !== snapshot.value
    || prior.selection.start !== snapshot.selection.start
    || prior.selection.end !== snapshot.selection.end
    || prior.selection.direction !== snapshot.selection.direction
    || prior.scrollTop !== snapshot.scrollTop) {
    history.undo.push(snapshot);
    if (history.undo.length > 64) history.undo.shift();
  }
}

function applyCorrectionInputHistoryV15(input, direction) {
  if (state.modal?.type !== "correction-v10"
    || input !== modalRoot.querySelector("#correction-draft-v10")
    || input.disabled
    || correctionHasUnresolvedSourceRaceV15(state.shell.correction)
    || !["clean", "dirty", "failed"].includes(state.shell.correction.status)) return false;
  const history = correctionInputHistoryV15(input);
  if (!history) return false;
  const from = direction === "redo" ? history.redo : history.undo;
  const to = direction === "redo" ? history.undo : history.redo;
  const target = from.pop();
  if (!target) return false;
  to.push(correctionInputSnapshotV15(input));
  input.value = target.value;
  input.setSelectionRange(target.selection.start, target.selection.end, target.selection.direction);
  const priorStatus = state.shell.correction.status;
  dispatchShell("CORRECTION_INPUT", {
    draft: target.value,
    selection: target.selection,
    editorIncarnation: correctionEditorIncarnationsV15.get(input),
  });
  if (priorStatus === "failed") reconcileCorrectionEditorDomV15(input);
  else reconcileCorrectionInputDerivedDomV15(input);
  input.focus({ preventScroll: true });
  if (Number.isFinite(target.scrollTop)) input.scrollTop = target.scrollTop;
  return true;
}

function syncCorrectionDirtyResetVisibilityV15() {
  const reset = modalRoot.querySelector('[data-action="reset-dirty-correction-fixture"]');
  if (!reset) return;
  const hidden = !(state.shell.correctionBranch === "reset-while-dirty" && state.shell.correction.dirty);
  if (hidden && !reset.hidden && document.activeElement === reset) {
    modalRoot.querySelector('[data-action="cancel-shell-correction"]')?.focus({ preventScroll: true });
  }
  reset.hidden = hidden;
}

function reconcileCorrectionInputDerivedDomV15(input) {
  if (state.modal?.type !== "correction-v10" || input !== modalRoot.querySelector("#correction-draft-v10")) return false;
  const correction = state.shell.correction;
  const validationVisible = correction.validationAttempted
    && ["whitespace", "unchanged"].includes(correction.validation.kind);
  const describedBy = `correction-editor-help-v15${validationVisible ? " correction-validation-v15" : ""}`;
  const invalid = String(validationVisible);
  if (input.getAttribute("aria-describedby") !== describedBy) input.setAttribute("aria-describedby", describedBy);
  if (input.getAttribute("aria-invalid") !== invalid) input.setAttribute("aria-invalid", invalid);
  const validation = modalRoot.querySelector("#correction-validation-v15");
  if (validation && !validationVisible) validation.remove();
  const status = modalRoot.querySelector(".correction-status-v15");
  if (status) {
    status.dataset.state = correction.status;
    status.hidden = !correction.dirty;
  }
  syncCorrectionDirtyResetVisibilityV15();
  const save = modalRoot.querySelector('[data-action="save-shell-correction"]');
  if (save) {
    const unavailable = !correction.dirty
      || correction.validation.kind !== "valid"
      || state.shell.connection !== "connected";
    save.setAttribute("aria-disabled", String(unavailable));
  }
  return true;
}

function scheduleCorrectionInputDomReconcileV15(input) {
  cancelAnimationFrame(correctionInputReconcileFrameV15);
  correctionInputReconcileOwnerV15 = input;
  const editorIncarnation = correctionEditorIncarnationsV15.get(input);
  correctionInputReconcileFrameV15 = requestAnimationFrame(() => {
    correctionInputReconcileFrameV15 = 0;
    correctionInputReconcileOwnerV15 = null;
    if (input !== modalRoot.querySelector("#correction-draft-v10")
      || editorIncarnation !== state.shell.correction.editorIncarnation) return;
    reconcileCorrectionInputDerivedDomV15(input);
  });
}

function handleShellInputV10(event) {
  if (!event.target.matches("#correction-draft-v10")) return;
  const input = event.target;
  const pendingInputSnapshot = correctionPendingInputSnapshotV15.get(input) || null;
  const canceledRestoration = correctionCanceledRestorationExpectedV15.get(input) || null;
  const canceledRestorationTail = Boolean(canceledRestoration)
    && (correctionCanceledRestorationTailV15.has(input)
      || correctionCompositionTailInputTypesV15.has(event.inputType)
      || !pendingInputSnapshot)
    && canceledRestoration.value === input.value;
  if (canceledRestoration) clearCanceledCompositionRestorationV15(input);
  const priorCorrection = state.shell.correction;
  const composing = event.isComposing || correctionCompositionActiveV15.has(input);
  const compositionTransaction = correctionCompositionFinalizeV15.get(input);
  let compositionCommit = correctionCompositionCommitPendingV15.has(input);
  const compositionTail = compositionCommit
    && (compositionTransaction?.canceled
      || correctionCompositionTailV15.has(input)
      || correctionCompositionTailInputTypesV15.has(event.inputType));
  if (compositionTail && compositionTransaction && !compositionTransaction.canceled
    && (event.inputType === "insertFromComposition" || Boolean(event.data))) {
    compositionTransaction.committed = true;
  }
  let priorSnapshot = pendingInputSnapshot || canceledRestoration || {
    value: priorCorrection.draft,
    scrollTop: input.scrollTop,
    selection: priorCorrection.selection || {
      start: input.selectionStart,
      end: input.selectionEnd,
      direction: input.selectionDirection,
    },
  };
  if (compositionCommit && !compositionTail) {
    priorSnapshot = compositionTransaction?.end || priorSnapshot;
    finalizeShellCompositionHistoryV15(input, compositionTransaction, compositionTransaction?.end);
    compositionCommit = false;
  }
  correctionCompositionTailV15.delete(input);
  correctionPendingInputSnapshotV15.delete(input);
  dispatchShell("CORRECTION_INPUT", {
    draft: input.value,
    selection: { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection },
    editorIncarnation: correctionEditorIncarnationsV15.get(input),
  });
  if (state.shell.correction === priorCorrection) return;
  syncCorrectionDirtyResetVisibilityV15();
  if (composing) correctionCompositionInputAcceptedV15.add(input);
  if (!composing && !compositionCommit && !canceledRestorationTail) recordCorrectionInputUndoV15(input, priorSnapshot);
  if (compositionCommit) finalizeShellCompositionHistoryV15(input, correctionCompositionFinalizeV15.get(input));
  if (priorCorrection.status === "failed") {
    cancelAnimationFrame(correctionInputReconcileFrameV15);
    correctionInputReconcileFrameV15 = 0;
    correctionInputReconcileOwnerV15 = null;
    reconcileCorrectionEditorDomV15(input);
  } else scheduleCorrectionInputDomReconcileV15(input);
}

function handleShellBeforeInputV15(event) {
  if (!event.target.matches("#correction-draft-v10") || event.target.disabled) return;
  if (event.isComposing || correctionCompositionActiveV15.has(event.target)) return;
  if (["historyUndo", "historyRedo"].includes(event.inputType)) {
    event.preventDefault();
    flushShellCompositionHistoryV15(event.target);
    applyCorrectionInputHistoryV15(event.target, event.inputType === "historyRedo" ? "redo" : "undo");
    return;
  }
  if (correctionCanceledRestorationExpectedV15.has(event.target)) {
    const input = event.target;
    if (correctionCompositionTailInputTypesV15.has(event.inputType)) {
      correctionCanceledRestorationTailV15.add(input);
      correctionPendingInputSnapshotV15.set(input, correctionInputSnapshotV15(input));
      return;
    }
    clearCanceledCompositionRestorationV15(input);
  }
  if (correctionCompositionCommitPendingV15.has(event.target)) {
    const transaction = correctionCompositionFinalizeV15.get(event.target);
    if (transaction?.canceled) {
      correctionCompositionTailV15.add(event.target);
      return;
    }
    if (correctionCompositionTailInputTypesV15.has(event.inputType)) {
      if (transaction && !transaction.canceled
        && (event.inputType === "insertFromComposition" || Boolean(event.data))) {
        transaction.committed = true;
      }
      correctionCompositionTailV15.add(event.target);
      return;
    }
    flushShellCompositionHistoryV15(event.target);
  }
  correctionPendingInputSnapshotV15.set(event.target, correctionInputSnapshotV15(event.target));
}

function handleShellCompositionStartV15(event) {
  if (!event.target.matches("#correction-draft-v10") || event.target.disabled) return;
  clearCanceledCompositionRestorationV15(event.target);
  flushShellCompositionHistoryV15(event.target);
  correctionPendingInputSnapshotV15.delete(event.target);
  correctionCompositionActiveV15.add(event.target);
  correctionCompositionInputAcceptedV15.delete(event.target);
  correctionCompositionCanceledV15.delete(event.target);
  correctionCompositionStartV15.set(event.target, correctionInputSnapshotV15(event.target));
}

function finalizeShellCompositionHistoryV15(
  input,
  transaction = correctionCompositionFinalizeV15.get(input),
  finalSnapshot = correctionInputSnapshotV15(input),
) {
  if (!transaction || correctionCompositionFinalizeV15.get(input) !== transaction) return false;
  const timer = correctionCompositionFinalizeTimerV15.get(input);
  if (timer) window.clearTimeout(timer);
  correctionCompositionFinalizeTimerV15.delete(input);
  correctionCompositionFinalizeV15.delete(input);
  correctionCompositionCommitPendingV15.delete(input);
  correctionCompositionTailV15.delete(input);
  if (!transaction.canceled
    && transaction.editorIncarnation === correctionEditorIncarnationsV15.get(input)
    && transaction.start.value !== finalSnapshot.value) {
    recordCorrectionInputUndoV15(input, transaction.start, finalSnapshot.value);
  } else if (!transaction.canceled
    && transaction.editorIncarnation === correctionEditorIncarnationsV15.get(input)
    && transaction.committed) {
    const history = correctionInputHistoryV15(input);
    if (history) history.redo.length = 0;
  }
  scheduleCorrectionInputDomReconcileV15(input);
  return true;
}

function finalizeActiveShellCompositionHistoryV15(input) {
  if (!input || !correctionCompositionActiveV15.has(input)) return false;
  const start = correctionCompositionStartV15.get(input);
  const accepted = correctionCompositionInputAcceptedV15.has(input);
  const canceled = correctionCompositionCanceledV15.has(input);
  correctionCompositionActiveV15.delete(input);
  correctionCompositionInputAcceptedV15.delete(input);
  correctionCompositionCanceledV15.delete(input);
  correctionCompositionStartV15.delete(input);
  correctionPendingInputSnapshotV15.delete(input);
  if (!start || !accepted) return false;
  const end = correctionInputSnapshotV15(input);
  const transaction = {
    id: ++correctionCompositionTransactionSequenceV15,
    editorIncarnation: correctionEditorIncarnationsV15.get(input),
    start,
    end,
    canceled,
    committed: !canceled,
  };
  correctionCompositionFinalizeV15.set(input, transaction);
  correctionCompositionCommitPendingV15.add(input);
  return finalizeShellCompositionHistoryV15(input, transaction, end);
}

function flushShellCompositionHistoryV15(input) {
  if (!input) return;
  if (finalizeActiveShellCompositionHistoryV15(input)) return;
  finalizeShellCompositionHistoryV15(input, correctionCompositionFinalizeV15.get(input));
}

function invalidateShellCompositionHistoryV15(input) {
  if (!input) return;
  clearCanceledCompositionRestorationV15(input);
  const timer = correctionCompositionFinalizeTimerV15.get(input);
  if (timer) window.clearTimeout(timer);
  correctionCompositionFinalizeTimerV15.delete(input);
  if (correctionInputReconcileOwnerV15 === input) {
    cancelAnimationFrame(correctionInputReconcileFrameV15);
    correctionInputReconcileFrameV15 = 0;
    correctionInputReconcileOwnerV15 = null;
  }
  correctionCompositionFinalizeV15.delete(input);
  correctionCompositionCommitPendingV15.delete(input);
  correctionCompositionTailV15.delete(input);
  correctionCompositionActiveV15.delete(input);
  correctionCompositionInputAcceptedV15.delete(input);
  correctionCompositionCanceledV15.delete(input);
  correctionCompositionStartV15.delete(input);
  correctionPendingInputSnapshotV15.delete(input);
}

function handleShellCompositionEndV15(event) {
  if (!event.target.matches("#correction-draft-v10")) return;
  const input = event.target;
  const start = correctionCompositionStartV15.get(input);
  const accepted = correctionCompositionInputAcceptedV15.has(input);
  const canceled = correctionCompositionCanceledV15.has(input);
  correctionCompositionActiveV15.delete(input);
  correctionCompositionInputAcceptedV15.delete(input);
  correctionCompositionCanceledV15.delete(input);
  correctionCompositionStartV15.delete(input);
  correctionPendingInputSnapshotV15.delete(input);
  if (!start || !accepted) return;
  const transaction = {
    id: ++correctionCompositionTransactionSequenceV15,
    editorIncarnation: correctionEditorIncarnationsV15.get(input),
    start,
    end: correctionInputSnapshotV15(input),
    canceled,
    committed: !canceled && Boolean(event.data),
  };
  correctionCompositionFinalizeV15.set(input, transaction);
  correctionCompositionCommitPendingV15.add(input);
  if (transaction.canceled && transaction.end.value === transaction.start.value) {
    finalizeShellCompositionHistoryV15(input, transaction, transaction.end);
    armCanceledCompositionRestorationV15(input, transaction.end);
    return;
  }
  const timer = window.setTimeout(() => finalizeShellCompositionHistoryV15(input, transaction), 0);
  correctionCompositionFinalizeTimerV15.set(input, timer);
}

function handleCalendarKeyboard(event) {
  const cell = event.target.closest("[data-calendar-date]");
  if (!cell) return false;
  const key = event.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(key)) return false;
  event.preventDefault();
  const currentDate = resolveUploadDayDomTokenV14(cell.dataset.calendarDate);
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
  const targetDomDate = uploadDayDomTokenV14(targetDate);
  const target = dateCells.find((dateCell) => dateCell.dataset.calendarDate === targetDomDate);
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
  if (pendingCorrectionCloseTraversalV15) {
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && state.modal?.type === "source-conflict-preview-v16") {
    event.preventDefault();
    closeSourceConflictPreviewV16();
    return;
  }
  if (event.key === "Escape" && state.modal?.type === "leave-source-conflict-v16") {
    event.preventDefault();
    keepSourceConflictEditingV16();
    return;
  }
  if (event.key === "Escape" && !state.modal && state.view === "source-conflict" && ["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(state.sourceConflict.stage)) {
    event.preventDefault();
    requestSourceConflictWorkspaceLeaveV16({ kind: "review" });
    return;
  }
  const sourceConflictTab = event.target.closest?.('[role="tab"][data-action="select-source-conflict-document"]');
  if (sourceConflictTab && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    const nextDocument = event.key === "ArrowLeft" || event.key === "Home" ? "c1" : "r2";
    dispatchSourceConflictV16("COMPACT_DOCUMENT_SET", { document: nextDocument });
    state.focusAfterRender = `[data-action="select-source-conflict-document"][data-conflict-document="${nextDocument === "c1" ? "correction" : "revision"}"]`;
    render();
    return;
  }
  if (event.key === "Tab" && pendingNavigationFocusV13) invalidateNavigationFocusV13();
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
  if (sessionGate) {
    const activatesSessionAction = event.target.closest?.('button[data-action]')
      && ["Enter", " "].includes(event.key);
    if (!activatesSessionAction) event.preventDefault();
    return;
  }
  if (event.target.matches("#correction-draft-v10")
    && correctionCanceledRestorationExpectedV15.has(event.target)
    && !event.isComposing
    && event.keyCode !== 229) clearCanceledCompositionRestorationV15(event.target);
  if (event.target.matches("#correction-draft-v10")
    && correctionCompositionCommitPendingV15.has(event.target)
    && !event.isComposing
    && event.keyCode !== 229
    && !correctionCompositionActiveV15.has(event.target)) flushShellCompositionHistoryV15(event.target);
  const correctionHistoryKey = event.key.toLocaleLowerCase("en-IN");
  if ((event.metaKey || event.ctrlKey)
    && !event.altKey
    && !event.isComposing
    && event.keyCode !== 229
    && (correctionHistoryKey === "z" || (event.ctrlKey && !event.metaKey && correctionHistoryKey === "y"))
    && event.target.matches("#correction-draft-v10")
    && !correctionCompositionActiveV15.has(event.target)) {
    const direction = correctionHistoryKey === "y" || event.shiftKey ? "redo" : "undo";
    event.preventDefault();
    flushShellCompositionHistoryV15(event.target);
    applyCorrectionInputHistoryV15(event.target, direction);
    return;
  }
  if (event.key === "Escape"
    && event.target.matches("#correction-draft-v10")
    && (event.isComposing || event.keyCode === 229 || correctionCompositionActiveV15.has(event.target))) {
    correctionCompositionCanceledV15.add(event.target);
    return;
  }
  if (event.key === "Escape" && state.modal?.type === "leave-correction-v10") {
    event.preventDefault();
    if (pendingPopGuard || pendingCorrectionPopstateReboundV15) {
      announceCorrectionV15("Return to the Correction dialog is still in progress. Try again after it is restored.", { assertive: true });
      return;
    }
    const leaveModal = state.modal;
    pendingLeaveNavigation = null;
    dispatchShell("LEAVE_KEEP");
    state.modal = { type: "correction-v10", focusSelector: "#correction-draft-v10", sourceHandle: leaveModal.sourceHandle, scrollY: leaveModal.scrollY, historyEntryId: leaveModal.historyEntryId || null, originHistoryEntryId: leaveModal.originHistoryEntryId || null, cardScrollTop: leaveModal.returnCardScrollTop || 0, bodyScrollTop: leaveModal.returnBodyScrollTop || 0, editorScrollTop: leaveModal.returnEditorScrollTop || 0, restoreCardScrollAfterFocus: true, restoreBodyScrollAfterFocus: true, restoreEditorScrollAfterFocus: true, restoredLeaveFocusSelector: leaveModal.returnEditorFocusSelector || null };
    render();
    return;
  }
  if (event.key === "Escape" && state.modal?.type === "correction-v10") {
    event.preventDefault();
    if (pendingPopGuard || pendingCorrectionPopstateReboundV15) {
      announceCorrectionV15("Return to the Correction dialog is still in progress. Try again after it is restored.", { assertive: true });
      return;
    }
    if (correctionHasUnresolvedSourceRaceV15(state.shell.correction)
      || ["saving", "reconciling", "unknown"].includes(state.shell.correction.status)) {
      toast("Resolve the current Correction result before leaving.");
      return;
    }
    if (state.shell.correction.dirty) requestCorrectionLeaveV10("escape", { kind: "close" });
    else closeCorrectionModalEntryV15();
    return;
  }
  if (event.key === "Escape" && !state.modal && state.view === "date-review" && state.dateReview.detailKey) {
    event.preventDefault();
    closeDateReviewItemV11();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("en-IN") === "k" && !state.modal) {
    event.preventDefault();
    if (state.view !== "search") {
      if (guardSourceConflictNavigationV16({ kind: "view", view: "search" }, { event })) return;
      cancelShellOpsForNavigationV10();
      setView("search");
    }
    else root.querySelector("#archive-search-input-v9")?.focus();
    return;
  }
  if (event.key === "Enter" && !event.isComposing && event.target.matches("#archive-search-input-v9")) {
    event.preventDefault();
    submitSearchValue(event.target.value);
    return;
  }
  if (event.key === "Escape" && state.modal) {
    event.preventDefault();
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
  const nextDomDate = activeArticle?.dataset.chapterDate || null;
  const nextDate = resolveUploadDayDomTokenV14(nextDomDate);
  const nextMonth = nextDate?.slice(0, 7) || activeVolume?.dataset.almanacMonth || state.almanacMonth;
  if (nextDate === state.almanacVisibleDate && nextMonth === state.almanacVisibleMonth) return;
  state.almanacVisibleDate = nextDate;
  state.almanacVisibleMonth = nextMonth;
  root.querySelectorAll("[data-index-month]").forEach((group) => group.classList.toggle("is-current", group.dataset.indexMonth === nextMonth));
  root.querySelectorAll('[data-action="select-almanac-chapter"]').forEach((button) => {
    if (button.dataset.date === nextDomDate) button.setAttribute("aria-current", "location");
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
    const fields = ["date", "monthKey", "delta", "view", "section", "photoId", "journalId", "reviewIndex", "pickerDate", "captureGroup", "captureKey", "captureBranch", "uploadFixture", "uploadBranch", "correctionHandle", "correctionKind", "correctionBranch", "callbackKind", "fixture", "branch", "conflictView", "conflictDocument", "conflictOutcome", "conflictFixture", "conflictBranch"];
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
    const fields = ["date", "monthKey", "delta", "view", "section", "photoId", "journalId", "reviewIndex", "pickerDate", "captureGroup", "captureKey", "captureBranch", "uploadFixture", "uploadBranch", "correctionHandle", "correctionKind", "correctionBranch", "callbackKind", "fixture", "branch", "conflictView", "conflictDocument", "conflictOutcome", "conflictFixture", "conflictBranch"];
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

function setResponsiveModalFocusSelectorV15(selector) {
  if (!state.modal) return;
  const correctionModalIsOpen = ["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal.type);
  const active = document.activeElement;
  const focusIsUnclaimed = !active
    || !active.isConnected
    || active === document.body
    || active === document.documentElement
    || active === root
    || active === modalRoot;
  if (correctionModalIsOpen && state.modal.pendingFocusSelectorV15 && focusIsUnclaimed) return;
  state.modal.focusSelector = selector;
}

function handlePopState(event) {
  const targetPosition = historyPositions.get(event?.state?.entryId);
  if (pendingSourceConflictPopReboundV16) {
    const rebound = pendingSourceConflictPopReboundV16;
    const reachedExactWorkbenchEntry = event?.state?.entryId === rebound.originEntryId
      && Number.isFinite(targetPosition)
      && targetPosition === rebound.originPosition;
    if (reachedExactWorkbenchEntry) {
      pendingSourceConflictPopReboundV16 = null;
      currentHistoryPosition = targetPosition;
      sourceConflictWorkbenchHistoryEntryIdV16 = rebound.originEntryId;
      const flushedActions = flushSourceConflictReboundActionsV16(rebound);
      const sourceConflictStillDirty = state.view === "source-conflict"
        && rebound.generation === state.sourceConflict.generation
        && rebound.editorIncarnation === state.sourceConflict.editorIncarnation
        && state.sourceConflict.dirty
        && ["workspace-invalid", "workspace-dirty"].includes(state.sourceConflict.stage);
      const sourceConflictStillLocked = state.view === "source-conflict"
        && rebound.generation === state.sourceConflict.generation
        && sourceConflictNavigationIsLockedV16(state.sourceConflict.stage);
      if (rebound.kind === "dirty" && sourceConflictStillDirty) requestSourceConflictWorkspaceLeaveV16({ kind: "history", delta: rebound.delta });
      else if (rebound.kind === "locked" && sourceConflictStillLocked && flushedActions === 0) announceSourceConflictV16(sourceConflictNavigationLockCopyV16(state.sourceConflict.stage), { assertive: true });
      else if (state.view === "source-conflict" && state.sourceConflict.stage === "stale-r3") {
        state.focusAfterRender = "#source-conflict-stale-title-v16";
        render();
      }
      if (rebound.kind === "locked"
        && !state.modal
        && state.view === "source-conflict"
        && rebound.generation === state.sourceConflict.generation
        && state.sourceConflict.stage === rebound.stage) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (window.history.state?.entryId !== rebound.originEntryId || state.view !== "source-conflict") return;
          const target = resolveSourceConflictFocusTargetV16(rebound.focusSelector);
          target?.focus({ preventScroll: true });
          withInstantScroll(() => window.scrollTo({ top: rebound.scrollY, behavior: "auto" }));
        }));
      }
      return;
    }
    const reachedPosition = Number.isFinite(targetPosition) ? targetPosition : rebound.targetPosition;
    window.history.go((rebound.originPosition - reachedPosition) || 1);
    return;
  }
  if (state.view === "source-conflict") {
    const locked = sourceConflictNavigationIsLockedV16(state.sourceConflict.stage);
    const dirty = state.sourceConflict.dirty && ["workspace-invalid", "workspace-dirty"].includes(state.sourceConflict.stage);
    if (locked || dirty) {
      const resolvedTarget = Number.isFinite(targetPosition) ? targetPosition : currentHistoryPosition - 1;
      const delta = resolvedTarget - currentHistoryPosition;
      const fallbackOriginEntryId = [...historyPositions.entries()]
        .filter(([, position]) => position === currentHistoryPosition)
        .at(-1)?.[0] || null;
      pendingSourceConflictPopReboundV16 = {
        kind: dirty ? "dirty" : "locked",
        originEntryId: sourceConflictWorkbenchHistoryEntryIdV16 || fallbackOriginEntryId,
        originPosition: currentHistoryPosition,
        targetPosition: resolvedTarget,
        delta,
        generation: state.sourceConflict.generation,
        stage: state.sourceConflict.stage,
        editorIncarnation: dirty ? state.sourceConflict.editorIncarnation : null,
        focusSelector: selectorForLogicalFocus(document.activeElement)
          || sourceConflictFallbackFocusSelectorsV16(state.sourceConflict)[0]
          || "#prototype-main",
        scrollY: window.scrollY,
        deferredActions: [],
        flushing: false,
      };
      window.history.go(currentHistoryPosition - resolvedTarget || 1);
      return;
    }
    if (state.modal?.type === "source-conflict-preview-v16") {
      state.modal = null;
      dispatchSourceConflictV16("PREVIEW_CLOSE");
    }
    if (state.sourceConflict.stage === "workspace-clean") dispatchSourceConflictV16("WORKSPACE_CANCEL");
  }
  if (pendingCorrectionCloseTraversalV15) {
    const pendingClose = pendingCorrectionCloseTraversalV15;
    if (event?.state?.entryId === pendingClose.originEntryId) {
      currentHistoryPosition = Number.isFinite(targetPosition) ? targetPosition : pendingClose.originPosition;
      if (!pendingClose.settleScheduled) {
        pendingClose.settleScheduled = true;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (pendingCorrectionCloseTraversalV15 !== pendingClose) return;
          pendingClose.settleScheduled = false;
          if (window.history.state?.entryId !== pendingClose.originEntryId) return;
          const focusSelector = pendingClose.focusSelector;
          const scrollY = pendingClose.scrollY;
          clearPendingCorrectionCloseTraversalV15();
          state.focusAfterRender = null;
          render();
          const returnTarget = resolveLogicalSelector(focusSelector)
            || resolveLogicalSelector("#journal-day-title-v14")
            || root.querySelector(".day-detail-header .back-button")
            || root.querySelector("#prototype-main");
          returnTarget?.focus({ preventScroll: true });
          withInstantScroll(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
        }));
      }
      return;
    }
    if (event?.state?.entryId === pendingClose.modalEntryId) window.history.back();
    else window.history.forward();
    return;
  }
  if (pendingUploadPopstateReboundV14) {
    const rebound = pendingUploadPopstateReboundV14;
    if (event?.state?.entryId === rebound.entryId) {
      pendingUploadPopstateReboundV14 = null;
      currentHistoryPosition = Number.isFinite(targetPosition) ? targetPosition : rebound.position;
      const renderEpoch = uploadFocusEpochV14;
      flushDeferredUploadCallbacksV14();
      if (state.modal?.type === "upload" && uploadFocusEpochV14 === renderEpoch) {
        renderUploadWithGuardedFocusV14(null);
      }
      return;
    }
    const returnDelta = Number.isFinite(targetPosition) ? rebound.position - targetPosition : 1;
    window.history.go(returnDelta || 1);
    return;
  }
  if (uploadDismissalLockedV14()) {
    const originPosition = currentHistoryPosition;
    const resolvedTarget = Number.isFinite(targetPosition) ? targetPosition : originPosition - 1;
    const returnDelta = originPosition - resolvedTarget;
    pendingUploadPopstateReboundV14 = {
      entryId: state.modal?.historyEntryId || null,
      position: originPosition,
    };
    renderUploadWithGuardedFocusV14(null);
    window.history.go(returnDelta || 1);
    announceUploadV14(uploadLockedExplanationV14("Upload in progress. Browser navigation is available after the represented result settles."));
    return;
  }
  if (pendingCorrectionPopstateReboundV15) {
    const rebound = pendingCorrectionPopstateReboundV15;
    if (event?.state?.entryId === rebound.entryId) {
      pendingCorrectionPopstateReboundV15 = null;
      currentHistoryPosition = Number.isFinite(targetPosition) ? targetPosition : rebound.position;
      const flushedCallbacks = flushDeferredCorrectionCallbacksV15();
      if (!flushedCallbacks && ["correction-v10", "leave-correction-v10", "remove-correction-v15"].includes(state.modal?.type)) {
        renderCorrectionPreservingFocusV15();
      }
      return;
    }
    const returnDelta = Number.isFinite(targetPosition) ? rebound.position - targetPosition : 1;
    window.history.go(returnDelta || 1);
    return;
  }
  const correctionDismissalLocked = correctionHasUnresolvedSourceRaceV15(state.shell.correction)
    || ["saving", "reconciling", "unknown", "removing", "remove-reconciling", "remove-unknown"].includes(state.shell.correction.status);
  if (["correction-v10", "remove-correction-v15"].includes(state.modal?.type) && correctionDismissalLocked) {
    const originPosition = currentHistoryPosition;
    const resolvedTarget = Number.isFinite(targetPosition) ? targetPosition : originPosition - 1;
    pendingCorrectionPopstateReboundV15 = {
      entryId: state.modal.historyEntryId || window.history.state?.entryId || null,
      position: originPosition,
    };
    renderCorrectionPreservingFocusV15();
    window.history.go(originPosition - resolvedTarget || 1);
    announceCorrectionV15("Resolve the current Correction result before browser navigation.", { assertive: true });
    return;
  }
  if (state.modal?.type === "remove-correction-v15") {
    dispatchShell("CORRECTION_CLOSE");
    state.modal = null;
    announceCorrectionV15("Correction kept. Browser navigation did not change display state.");
  } else if (state.modal?.type === "correction-v10" && !state.shell.correction.dirty) {
    dispatchShell("CORRECTION_CLOSE");
    state.modal = null;
  }
  const traversesSettledUploadHandoff = state.modal?.type === "upload"
    && ["success", "already-completed"].includes(state.upload.stage)
    && uploadDayHistoryTargetsV14.get(event?.state?.entryId) === state.upload.result?.journalId;
  if (traversesSettledUploadHandoff) state.modal = null;
  else if (state.modal?.type === "upload") discardUploadDraftForNavigationV14();
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
    const reachedGuardOrigin = pendingPopGuard.originEntryId
      ? event?.state?.entryId === pendingPopGuard.originEntryId
      : Number.isFinite(targetPosition) && targetPosition === pendingPopGuard.originPosition;
    if (!reachedGuardOrigin) {
      const returnDelta = Number.isFinite(targetPosition)
        ? pendingPopGuard.originPosition - targetPosition
        : 1;
      window.history.go(returnDelta || 1);
      return;
    }
    suppressGuardedPopstate = false;
    currentHistoryPosition = Number.isFinite(targetPosition) ? targetPosition : pendingPopGuard.originPosition;
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
    pendingPopGuard = {
      originEntryId: state.modal?.historyEntryId || null,
      originPosition: currentHistoryPosition,
      targetPosition: resolvedTarget,
    };
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
  const opaqueCaptureDayDate = captureDayHistoryTargetsV13.get(event?.state?.entryId);
  const validOpaqueCaptureDay = isDateKey(opaqueCaptureDayDate) && Boolean(days[opaqueCaptureDayDate]);
  let opaqueSourceConflictReturnTarget = sourceConflictReturnTargetsV16.get(event?.state?.entryId);
  const params = stripLegacySearchQueryFromUrl().searchParams;
  const nextView = params.get("view");
  let resolvedNextView = nextView === "telegram-capture" && !snapshot
    ? "calendar"
    : allowedViews.has(nextView) ? nextView : "calendar";
  const rejectedSourceConflictRoute = resolvedNextView === "source-conflict"
    && !sourceConflictReviewModelIsCompleteV16(state.sourceConflict);
  if (rejectedSourceConflictRoute) {
    resolvedNextView = "calendar";
    state.sourceConflict = sourceConflictHistoryCardStateV16(state.sourceConflict);
    if (state.sourceConflict.active && state.sourceConflict.eligibility === "no-current-correction") {
      opaqueSourceConflictReturnTarget = Object.freeze({ view: "calendar", date: SOURCE_CONFLICT_ITEM_V16.date, screen: "day" });
      sourceConflictReturnTargetsV16.set(event?.state?.entryId, opaqueSourceConflictReturnTarget);
    }
  }
  if (resolvedNextView === "source-conflict"
    && state.sourceConflict.terminal
    && state.sourceConflict.newestRevision !== "r3") resolvedNextView = "calendar";
  const validOpaqueSourceConflictReturn = Boolean(opaqueSourceConflictReturnTarget)
    && opaqueSourceConflictReturnTarget.view === resolvedNextView
    && isDateKey(opaqueSourceConflictReturnTarget.date)
    && Boolean(days[opaqueSourceConflictReturnTarget.date]);
  const opaqueReturnDate = validOpaqueSourceConflictReturn
    ? opaqueSourceConflictReturnTarget.date
    : validOpaqueCaptureDay ? opaqueCaptureDayDate : null;
  if (previousView === "date-review" && resolvedNextView !== previousView && !dateReviewHadPendingOperation) {
    clearDateReviewAnnouncementV11();
  }
  if (previousView === "date-review" && resolvedNextView === "telegram-capture" && state.capture.reviewHandoffKey) {
    const handoffKey = state.capture.reviewHandoffKey;
    if (Object.hasOwn(state.dateReview.resolved, handoffKey) || !state.dateReview.unresolved.includes(handoffKey)) {
      if (state.capture.fixtureIdentity) captureResolvedReviewIdentitiesV13.add(state.capture.fixtureIdentity);
      dispatchCaptureV13("REVIEW_RESOLVED");
    }
  }
  if (previousView === "source-conflict" && resolvedNextView !== "source-conflict") {
    state.sourceConflict = sourceConflictHistoryCardStateV16(state.sourceConflict);
  }
  state.view = resolvedNextView;
  if (state.view === "source-conflict") {
    sourceConflictWorkbenchHistoryEntryIdV16 = event?.state?.entryId || sourceConflictWorkbenchHistoryEntryIdV16;
    state.sourceConflict = sourceConflictHistoryReviewStateV16(state.sourceConflict);
    state.modal = null;
  } else sourceConflictWorkbenchHistoryEntryIdV16 = null;
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
    const almanacDestinationDate = opaqueReturnDate || (validLiveDate ? nextDate : null);
    const newest = isMonthKey(nextMonth) ? nextMonth : almanacDestinationDate ? almanacDestinationDate.slice(0, 7) : prototypeNewestMonth;
    const oldest = isMonthKey(nextThrough) && monthOrdinal(nextThrough) <= monthOrdinal(newest) ? nextThrough : newest;
    const normalized = normalizeAlmanacRange(newest, oldest, almanacDestinationDate);
    state.almanacMonth = normalized.newest;
    state.almanacThrough = normalized.oldest;
    state.month = normalized.newest;
    state.selectedDate = almanacDestinationDate;
    state.almanacVisibleMonth = snapshot?.almanacVisibleMonth || state.selectedDate?.slice(0, 7) || normalized.newest;
    state.almanacVisibleDate = snapshot?.almanacVisibleDate && days[snapshot.almanacVisibleDate]
      ? snapshot.almanacVisibleDate
      : state.selectedDate;
    state.almanacReturnFocusDate = snapshot?.almanacReturnFocusDate && days[snapshot.almanacReturnFocusDate]
      ? snapshot.almanacReturnFocusDate
      : null;
  } else {
    state.month = opaqueReturnDate ? opaqueReturnDate.slice(0, 7) : isMonthKey(nextMonth) ? nextMonth : validLiveDate ? nextDate.slice(0, 7) : snapshot?.calendarMonth || prototypeNewestMonth;
    if (state.view === "calendar") state.calendarMonth = state.month;
    state.selectedDate = state.view === "calendar" && opaqueReturnDate
      ? opaqueReturnDate
      : state.view === "calendar" && validLiveDate && nextDate.startsWith(`${state.month}-`) ? nextDate : null;
    if (state.view === "calendar" && validOpaqueCaptureDay) {
      const photoId = captureDayPhotoTargetsV13.get(event?.state?.entryId);
      const photoIndex = photoId ? days[opaqueCaptureDayDate]?.photos?.findIndex((photo) => photo.id === photoId) : -1;
      if (photoIndex >= 0) state.galleryIndex[opaqueCaptureDayDate] = photoIndex;
    }
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
  const opaqueCaptureSelection = validOpaqueCaptureDay
    && snapshot?.selectionOpenedInApp
    && !snapshot?.fullDayOpenedInApp;
  state.screen = validOpaqueSourceConflictReturn && ["calendar", "almanac"].includes(state.view)
    ? opaqueSourceConflictReturnTarget.screen
    : validOpaqueCaptureDay && ["calendar", "almanac"].includes(state.view)
    ? opaqueCaptureSelection ? "month" : snapshot?.fullDayOpenedInApp ? "day" : state.view === "calendar" ? "day" : "month"
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
  if (!dateReviewMoreOrigin && snapshot?.uploadModalSnapshotV14 && state.shell.phase === "ready") {
    let restoredUpload = structuredClone(snapshot.uploadModalSnapshotV14);
    if (["checking", "reconciling", "uploading", "saving"].includes(restoredUpload.stage)) {
      restoredUpload = transitionUploadV14(restoredUpload, "INTERRUPT", {
        token: restoredUpload.active,
        retryTarget: ["checking", "reconciling"].includes(restoredUpload.stage) ? "check" : "commit",
        error: "Upload interrupted. Nothing was added. Your file and Journal Date remain selected in this tab. Retry.",
      });
    }
    state.upload = restoredUpload;
    state.modal = {
      type: "upload",
      returnFocusSelector: snapshot.uploadModalEnvelopeV14?.returnFocusSelector || null,
      scrollY: Number(snapshot.uploadModalEnvelopeV14?.scrollY) || 0,
      cardScrollTop: Number(snapshot.uploadModalEnvelopeV14?.cardScrollTop) || 0,
      focusSelector: null,
      historyEntryId: event?.state?.entryId || null,
    };
  }
  state.monthAnnouncement = `Showing ${monthLabel(state.month)}`;

  const defaultFocus = state.view === "calendar" && isFirstUseFixture() ? "#first-use-title-v9"
    : state.view === "search" ? "#archive-search-input-v9"
    : state.view === "settings" ? "#settings-section-heading"
      : state.view === "telegram-capture" ? state.capture.surface === "change-date" ? "#capture-change-title-v14" : "#capture-title-v14"
      : state.view === "source-conflict" ? "#source-conflict-title-v16"
      : state.view === "date-review" && state.dateReview.detailKey ? "#date-review-detail-title-v11"
        : state.view === "date-review" ? "#date-review-title-v11"
      : state.view === "calendar" && state.screen === "day" ? ".day-detail-header .back-button"
        : state.view === "calendar" && state.selectedDate ? ".calendar-selection"
          : state.view === "calendar" ? `[data-calendar-date="${uploadDayDomTokenV14(state.focusDate)}"]`
            : state.view === "almanac" && state.screen === "day" ? ".day-detail-header .back-button"
              : state.view === "almanac" && state.selectedDate ? `#chapter-${uploadDayDomTokenV14(state.selectedDate)}`
                : `[data-action="set-view"][data-view="${state.view}"]`;
  let focusSelector = snapshot?.focusSelector || defaultFocus;
  if (rejectedSourceConflictRoute && state.sourceConflict.eligibility === "no-current-correction") {
    focusSelector = "#source-conflict-no-correction-v16";
  }
  if (dateReviewMoreOrigin) focusSelector = moreReturnFocus;
  const resolvedCaptureFocusFallback = state.view === "telegram-capture"
    && state.capture.reviewResolved
    && (focusSelector?.includes('data-action="capture-review-date"')
      || focusSelector?.includes("date-review"));
  if (resolvedCaptureFocusFallback) focusSelector = "#capture-outcome-title-v14";
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
  const restoresUploadHistoryTruth = Boolean(snapshot?.uploadModalSnapshotV14)
    || uploadDayHistoryTargetsV14.has(event?.state?.entryId);
  if (!["date-review", "telegram-capture"].includes(state.view) && !restoresUploadHistoryTruth) {
    queueLiveAnnouncementV10(calendarStatusLive, state.monthAnnouncement);
  }
  restoreViewScroll(state.view, historyScrollY, restoredFocusSelector, restoredFocusTop);
}

root.addEventListener("click", handleClick);
root.addEventListener("submit", handleSubmit);
root.addEventListener("change", handleChange);
document.addEventListener("click", handleCaptureSkipLinkV13);
root.addEventListener("input", (event) => {
  handleShellInputV10(event);
  if (event.target.matches("#source-conflict-draft-v16")) {
    const input = event.target;
    const editorIncarnation = sourceConflictEditorIncarnationsV16.get(input);
    if (!editorIncarnation
      || editorIncarnation !== state.sourceConflict.editorIncarnation
      || !["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(state.sourceConflict.stage)) return;
    dispatchSourceConflictV16("DRAFT_INPUT", {
      draft: input.value,
      selection: { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection },
      scrollTop: input.scrollTop,
      editorIncarnation,
    });
    const validation = sourceConflictValidationV16(input.value);
    const validationNode = root.querySelector("#source-conflict-validation-v16");
    if (validationNode) {
      validationNode.textContent = validation.message;
      validationNode.dataset.kind = validation.kind;
    }
    input.setAttribute("aria-invalid", String(!validation.valid));
    const save = root.querySelector('[data-action="save-source-conflict-correction"]');
    if (save) save.disabled = !validation.valid || state.sourceConflict.branch === "workspace-connection";
    return;
  }
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
  const pendingNavigationFocus = pendingNavigationFocusV13;
  if (pendingNavigationFocus) {
    const intendedTarget = resolveLogicalSelector(pendingNavigationFocus.selector);
    if (event.target !== intendedTarget) invalidateNavigationFocusV13();
  }
  const selector = selectorForLogicalFocus(event.target);
  if (selector) state.transientFocusSelector = selector;
  if (state.modal?.pendingFocusSelectorV15 && modalRoot.contains(event.target)) {
    state.modal.pendingFocusSelectorV15 = null;
  }
});
document.addEventListener("selectionchange", () => {
  const input = document.activeElement;
  if (input?.id === "archive-search-input-v9") {
    state.searchSelection = { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection };
  }
  if (input?.id === "correction-draft-v10") {
    dispatchShell("CORRECTION_SELECTION", {
      selection: { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection },
      editorIncarnation: correctionEditorIncarnationsV15.get(input),
    });
  }
  if (input?.id === "source-conflict-draft-v16") {
    const editorIncarnation = sourceConflictEditorIncarnationsV16.get(input);
    if (!editorIncarnation
      || editorIncarnation !== state.sourceConflict.editorIncarnation
      || !["workspace-clean", "workspace-invalid", "workspace-dirty"].includes(state.sourceConflict.stage)) return;
    dispatchSourceConflictV16("SELECTION", {
      selection: { start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection },
      scrollTop: input.scrollTop,
      editorIncarnation,
    });
  }
});
modalRoot.addEventListener("click", handleClick);
modalRoot.addEventListener("change", handleChange);
modalRoot.addEventListener("beforeinput", handleShellBeforeInputV15);
modalRoot.addEventListener("compositionstart", handleShellCompositionStartV15);
modalRoot.addEventListener("compositionend", handleShellCompositionEndV15);
modalRoot.addEventListener("input", handleShellInputV10);
document.addEventListener("keydown", handleKeydown);
window.addEventListener("popstate", handlePopState);
window.addEventListener("beforeunload", (event) => {
  if (!state.shell.correction.dirty && !state.sourceConflict.dirty) return;
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
    if (state.modal) setResponsiveModalFocusSelectorV15(selector);
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
  if (state.modal) setResponsiveModalFocusSelectorV15(selector);
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
      if (state.modal) setResponsiveModalFocusSelectorV15(responsiveSelector);
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

sourceConflictCompactQueryV16.addEventListener("change", (event) => {
  if (state.view !== "source-conflict") return;
  const scrollY = window.scrollY;
  const selector = sourceConflictResponsiveFocusSelectorV16(document.activeElement, event.matches);
  if (["source-conflict-preview-v16", "leave-source-conflict-v16"].includes(state.modal?.type)) {
    state.modal.focusSelector = selector || "[data-modal-card]";
  } else state.focusAfterRender = selector;
  render();
  withInstantScroll(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
});

initializeSourceConflictColdRouteV16();
syncUrl();
render();
