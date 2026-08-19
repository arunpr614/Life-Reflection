(function initializeAtomicRedatingV17() {
  "use strict";

  const runtime = window.__LID_RUNTIME__;
  if (!runtime || runtime.version !== 17) throw new Error("Atomic Redating requires the v17 compatibility runtime.");

  const AUTHORITY = Object.freeze({
    version: 17,
    feature: "PVA-012 Atomic Redating",
    fixedClock: "2026-08-19T10:00:00+05:30",
    today: "2026-08-19",
    timezone: "Asia/Kolkata",
    sourceId: "src-journal-monsoon-walk",
    sourceLabel: "Monsoon walk note",
    currentDate: "2026-08-18",
    destinationDate: "2026-08-17",
    originalTimestamp: "17 Aug 2026, 11:42 pm IST",
    oldCoverBefore: "Rain-lit window",
    oldCoverAfter: "Window reflection",
    destinationCover: "Tea beside the blue notebook",
  });
  const REQUIRED_FIXTURES = Object.freeze([
    "ready",
    "future-rejected",
    "same-day-rejected",
    "pending",
    "failure",
    "unknown",
    "interrupted",
    "competing-revision",
    "success",
    "rapid-repeat",
  ]);
  const MONTHS = Object.freeze([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]);

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[character]);
  }

  function shortDate(value) {
    const parts = String(value).split("-").map(Number);
    if (parts.length !== 3 || !parts.every(Number.isInteger)) return "Unselected";
    return `${parts[2]} ${MONTHS[parts[1] - 1]?.slice(0, 3) || ""} ${parts[0]}`;
  }

  function longDate(value) {
    const parts = String(value).split("-").map(Number);
    if (parts.length !== 3 || !parts.every(Number.isInteger)) return "Unselected Journal Day";
    return `${parts[2]} ${MONTHS[parts[1] - 1] || ""} ${parts[0]}`;
  }

  function isCalendarDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (year < 1 || month < 1 || month > 12 || day < 1) return false;
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day <= monthDays[month - 1];
  }

  function previousCalendarDate(value) {
    if (!isCalendarDate(value)) return null;
    let [year, month, day] = value.split("-").map(Number);
    day -= 1;
    if (day < 1) {
      month -= 1;
      if (month < 1) {
        year -= 1;
        month = 12;
      }
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      day = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }
    if (year < 1) return null;
    return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function boundedContextText(value, fallback) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text ? text.slice(0, 240) : fallback;
  }

  function contextReference(context, currentDate) {
    const explicit = boundedContextText(context.sourceId, "");
    if (explicit) return explicit;
    const labelToken = boundedContextText(context.sourceLabel, "selected-source")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64) || "selected-source";
    return `derived-v16-context-${currentDate}-${labelToken}`;
  }

  function fixedSourceContext() {
    const fixed = {
      origin: "fixed-v17",
      kind: "journal",
      sourceId: AUTHORITY.sourceId,
      sourceLabel: AUTHORITY.sourceLabel,
      sourceType: "Voice Journal",
      sourceRevision: "Source Revision R1 · fixed synthetic authority",
      currentDate: AUTHORITY.currentDate,
      destinationDate: AUTHORITY.destinationDate,
      originalTimestamp: AUTHORITY.originalTimestamp,
      currentDateWasVisible: false,
      originalTimestampWasVisible: false,
      currentDateBasis: "Fixed synthetic authority",
      originalTimestampBasis: "Fixed synthetic authority · immutable",
    };
    fixed.beforeSnapshot = {
      sourceReference: fixed.sourceId,
      sourceLabel: fixed.sourceLabel,
      sourceType: fixed.sourceType,
      currentDate: fixed.currentDate,
      originalTimestamp: fixed.originalTimestamp,
      sourceRevision: fixed.sourceRevision,
    };
    return fixed;
  }

  function normalizeSourceContext(context) {
    if (!context || context.origin !== "inherited-v16") return fixedSourceContext();
    const currentDateIsVisible = context.currentDateWasVisible === false ? false : isCalendarDate(context.currentDate);
    const currentDate = currentDateIsVisible ? context.currentDate : AUTHORITY.currentDate;
    const visibleTimestamp = context.originalTimestampWasVisible === false ? "" : boundedContextText(context.originalTimestamp, "");
    return {
      origin: "inherited-v16",
      kind: boundedContextText(context.kind, "unresolved-source"),
      sourceId: contextReference(context, currentDate),
      sourceLabel: boundedContextText(context.sourceLabel, "Selected v16 Source Item"),
      sourceType: boundedContextText(context.sourceType, "Inherited archive action"),
      sourceRevision: boundedContextText(context.sourceRevision, "No revision label exposed by v16"),
      currentDate,
      destinationDate: previousCalendarDate(currentDate) || AUTHORITY.destinationDate,
      originalTimestamp: visibleTimestamp || AUTHORITY.originalTimestamp,
      currentDateWasVisible: currentDateIsVisible,
      originalTimestampWasVisible: Boolean(visibleTimestamp),
      currentDateBasis: currentDateIsVisible
        ? "Copied read-only from the invoking v16 action"
        : "Fixed synthetic fallback · invoking action exposed no valid Journal Date",
      originalTimestampBasis: visibleTimestamp
        ? "Copied read-only from the invoking v16 Source Item · immutable"
        : "Fixed synthetic fallback · invoking context exposed no Original Timestamp",
      beforeSnapshot: {
        sourceReference: contextReference(context, currentDate),
        sourceLabel: boundedContextText(context.beforeSnapshot?.sourceLabel, boundedContextText(context.sourceLabel, "Selected v16 Source Item")),
        sourceType: boundedContextText(context.beforeSnapshot?.sourceType, boundedContextText(context.sourceType, "Inherited archive action")),
        currentDate,
        originalTimestamp: visibleTimestamp || AUTHORITY.originalTimestamp,
        sourceRevision: boundedContextText(context.sourceRevision, "No revision label exposed by v16"),
        selectedCover: Boolean(context.beforeSnapshot?.selectedCover),
      },
    };
  }

  function validateDestination(value, context) {
    if (!isCalendarDate(value)) {
      return { kind: "invalid", valid: false, message: "Enter a complete calendar date." };
    }
    if (value === context.currentDate) {
      return { kind: "same-day", valid: false, message: "Choose a different Journal Date. This Source Item is already on the selected day." };
    }
    if (value > AUTHORITY.today) {
      return { kind: "future", valid: false, message: "Future dates are not allowed. Choose today or an earlier Journal Date." };
    }
    return { kind: "valid", valid: true, message: "Destination accepted for consequence review." };
  }

  function beforeProjection(destination, context) {
    return {
      sourceDate: context.currentDate,
      originalTimestamp: context.originalTimestamp,
      currentDay: {
        date: context.currentDate,
        visible: true,
        sources: [context.sourceId, "retained-synthetic-source"],
        cover: { label: AUTHORITY.oldCoverBefore, type: "AI artwork", active: true },
        generatedFields: "Current",
        artwork: "Active AI artwork",
        artworkHistoryCount: 0,
      },
      destinationDay: {
        date: destination,
        visible: true,
        sources: ["src-notebook-tea", "photo-blue-notebook"],
        cover: { label: AUTHORITY.destinationCover, type: "real Daily Photo", active: true },
        generatedFields: "Current",
        artwork: "No AI artwork",
        artworkHistoryCount: 0,
      },
    };
  }

  function afterProjection(destination, context) {
    return {
      sourceDate: destination,
      originalTimestamp: context.originalTimestamp,
      currentDay: {
        date: context.currentDate,
        visible: true,
        sources: ["retained-synthetic-source"],
        cover: { label: AUTHORITY.oldCoverAfter, type: "real Daily Photo", active: true },
        generatedFields: "Stale · source set changed",
        artwork: "Historical · retained, no longer active",
        artworkHistoryCount: 1,
      },
      destinationDay: {
        date: destination,
        visible: true,
        sources: ["src-notebook-tea", "photo-blue-notebook", context.sourceId],
        cover: { label: AUTHORITY.destinationCover, type: "real Daily Photo", active: true },
        generatedFields: "Stale · source set changed",
        artwork: "No AI artwork · no request queued",
        artworkHistoryCount: 0,
      },
    };
  }

  function neutralProjection(context) {
    const current = beforeProjection(context.destinationDate, context);
    return {
      sourceDate: context.currentDate,
      originalTimestamp: context.originalTimestamp,
      currentDay: current.currentDay,
      destinationDay: null,
      destinationStatus: "Awaiting a valid destination",
    };
  }

  function historyEvent(destination, context) {
    return {
      type: "Journal Date changed",
      source: context.sourceId,
      from: context.currentDate,
      to: destination,
      originalTimestamp: context.originalTimestamp,
    };
  }

  function baseState(launchContext) {
    const context = normalizeSourceContext(launchContext);
    return {
      context,
      fixture: "ready",
      phase: "ready",
      destination: context.destinationDate,
      validation: validateDestination(context.destinationDate, context),
      currentRevision: "R1",
      previewAuthority: "Current",
      intentCount: 0,
      effectCount: 0,
      historyEvents: [],
      providerRequests: 0,
      deliveredResults: 0,
      dayView: null,
      theme: "light",
      announcement: "Atomic Redating is ready for review.",
      announcementAssertive: false,
      focusSelector: "#lid-v17-title",
    };
  }

  function prepareOpen(_freshState, launchContext) {
    return baseState(launchContext);
  }

  function validateLaunchContext(launchContext) {
    if (!launchContext) return true;
    return launchContext.origin === "inherited-v16"
      && isCalendarDate(launchContext.currentDate)
      && Boolean(boundedContextText(launchContext.sourceId, ""))
      && Boolean(boundedContextText(launchContext.sourceLabel, ""))
      && Boolean(boundedContextText(launchContext.sourceType, ""))
      && Boolean(boundedContextText(launchContext.originalTimestamp, ""))
      && Boolean(boundedContextText(launchContext.sourceRevision, ""))
      && Boolean(launchContext.beforeSnapshot && typeof launchContext.beforeSnapshot === "object")
      && launchContext.beforeSnapshot.sourceId === launchContext.sourceId
      && launchContext.beforeSnapshot.currentDate === launchContext.currentDate
      && launchContext.beforeSnapshot.originalTimestamp === launchContext.originalTimestamp;
  }

  function canClose(state) {
    return !["pending", "unknown", "interrupted"].includes(state.phase);
  }

  function fixtureState(key, currentState) {
    if (!REQUIRED_FIXTURES.includes(key)) return null;
    const state = baseState(currentState?.context);
    state.theme = currentState?.theme === "dark" ? "dark" : "light";
    state.fixture = key;
    state.focusSelector = `[data-lid-fixture="${key}"]`;
    state.announcement = "Prototype state changed.";
    if (key === "future-rejected") {
      state.phase = "future-rejected";
      state.destination = "2026-08-20";
      state.validation = validateDestination(state.destination, state.context);
      state.announcement = "Future destination rejected. Nothing changed.";
      state.announcementAssertive = true;
    } else if (key === "same-day-rejected") {
      state.phase = "same-day-rejected";
      state.destination = state.context.currentDate;
      state.validation = validateDestination(state.destination, state.context);
      state.announcement = "Same-day destination rejected. Nothing changed.";
      state.announcementAssertive = true;
    } else if (["pending", "failure", "unknown", "interrupted"].includes(key)) {
      state.phase = key;
      state.intentCount = 1;
      state.announcement = key === "pending" ? "One date-change intent is pending." : "No archive effect was applied.";
      state.announcementAssertive = key !== "pending";
    } else if (key === "competing-revision") {
      state.phase = key;
      state.currentRevision = "R2";
      state.previewAuthority = "Stale";
      state.announcement = "A newer source revision invalidated the preview. Nothing changed.";
      state.announcementAssertive = true;
    } else if (["success", "rapid-repeat"].includes(key)) {
      state.phase = key;
      state.intentCount = 1;
      state.effectCount = 1;
      state.historyEvents = [historyEvent(state.destination, state.context)];
      state.deliveredResults = key === "rapid-repeat" ? 2 : 1;
      state.announcement = key === "success" ? "Journal Date changed exactly once." : "Duplicate result ignored. The one completed change is unchanged.";
    }
    return state;
  }

  function stateWithAnnouncement(state, message, options) {
    state.announcement = message;
    state.announcementAssertive = Boolean(options?.assertive);
    if (options?.focus) state.focusSelector = options.focus;
    return state;
  }

  function reduce(state, action) {
    const type = action.type;
    const payload = action.payload || {};
    if (type === "set-destination") {
      if (!["ready", "date-required", "future-rejected", "same-day-rejected"].includes(state.phase)) return state;
      state.destination = String(payload.value || "");
      state.validation = validateDestination(state.destination, state.context);
      state.fixture = state.validation.kind === "invalid" ? "date-required" : null;
      state.phase = state.validation.valid ? "ready" : state.validation.kind === "invalid" ? "date-required" : `${state.validation.kind}-rejected`;
      state.intentCount = 0;
      state.effectCount = 0;
      state.historyEvents = [];
      state.deliveredResults = 0;
      return stateWithAnnouncement(
        state,
        state.validation.valid ? "Destination updated. Review the consequences before confirming." : state.validation.message,
        { assertive: !state.validation.valid, focus: "#lid-new-date-v17" },
      );
    }
    if (type === "confirm") {
      if (state.phase !== "ready" || !state.validation.valid || state.intentCount !== 0 || state.effectCount !== 0) return state;
      state.phase = "pending";
      state.fixture = "pending";
      state.intentCount = 1;
      return stateWithAnnouncement(state, "One date-change intent is pending. No archive effect has been applied.", { focus: "#lid-operation-state-v17" });
    }
    if (type === "retry") {
      if (state.phase !== "failure" || state.intentCount !== 1 || state.effectCount !== 0) return state;
      state.phase = "pending";
      state.fixture = "pending";
      return stateWithAnnouncement(state, "Retrying the existing intent. No new intent was created.", { focus: "#lid-operation-state-v17" });
    }
    if (type === "check-status") {
      if (!["unknown", "interrupted"].includes(state.phase) || state.effectCount !== 0) return state;
      state.phase = "pending";
      state.fixture = "pending";
      return stateWithAnnouncement(state, "Checking the existing intent. No new intent was created.", { focus: "#lid-operation-state-v17" });
    }
    if (type === "review-latest") {
      if (state.phase !== "competing-revision") return state;
      state.phase = "ready";
      state.fixture = "ready";
      state.previewAuthority = "Refreshed for R2";
      state.intentCount = 0;
      return stateWithAnnouncement(state, "Preview refreshed for the latest source revision. Review before confirming.", { focus: "#lid-new-date-v17" });
    }
    if (type === "settle") {
      const outcome = payload.outcome;
      if (outcome === "success" && state.effectCount === 1) {
        state.phase = "rapid-repeat";
        state.fixture = "rapid-repeat";
        state.deliveredResults += 1;
        return stateWithAnnouncement(state, "Duplicate result ignored. The one completed change is unchanged.", { focus: "#lid-operation-state-v17" });
      }
      if (state.phase !== "pending" || state.intentCount !== 1 || state.effectCount !== 0) return state;
      if (["failure", "unknown", "interrupted"].includes(outcome)) {
        state.phase = outcome;
        state.fixture = outcome;
        return stateWithAnnouncement(
          state,
          outcome === "failure" ? "The change failed. Nothing changed. Retry will reuse the same intent."
            : outcome === "unknown" ? "The result is unknown. Check status before trying anything else."
              : "Connection interrupted before a result. Check the existing intent after reconnecting.",
          { assertive: true, focus: "#lid-operation-state-v17" },
        );
      }
      if (outcome === "competing-revision") {
        state.phase = "competing-revision";
        state.fixture = "competing-revision";
        state.currentRevision = "R2";
        state.previewAuthority = "Stale";
        return stateWithAnnouncement(state, "A newer source revision invalidated the preview. Nothing changed.", { assertive: true, focus: "#lid-operation-state-v17" });
      }
      if (outcome === "success") {
        state.phase = "success";
        state.fixture = "success";
        state.effectCount = 1;
        state.deliveredResults = 1;
        state.historyEvents = [historyEvent(state.destination, state.context)];
        return stateWithAnnouncement(state, "Journal Date changed exactly once.", { focus: "#lid-operation-state-v17" });
      }
      return state;
    }
    if (type === "cancel") {
      return state;
    }
    if (type === "reset") {
      const resetState = baseState(state.context);
      resetState.theme = state.theme;
      return stateWithAnnouncement(resetState, "Atomic Redating reset for the current Source Item context.", { focus: "#lid-v17-title" });
    }
    if (type === "view-day") {
      if (state.effectCount !== 1 || !["current", "destination"].includes(payload.day)) return state;
      state.dayView = payload.day;
      return stateWithAnnouncement(state, "Resulting Journal Day opened.", { focus: "#lid-resulting-day-title-v17" });
    }
    if (type === "back-summary") {
      state.dayView = null;
      return stateWithAnnouncement(state, "Returned to the completed change summary.", { focus: "#lid-operation-state-v17" });
    }
    if (type === "toggle-theme") {
      state.theme = state.theme === "light" ? "dark" : "light";
      return stateWithAnnouncement(state, `${state.theme === "dark" ? "Dark" : "Light"} prototype theme applied.`, { focus: '[data-lid-action="toggle-theme"]' });
    }
    return state;
  }

  function phaseContent(state) {
    const content = {
      ready: ["Ready for review", "Review both Journal Days, then confirm one deliberate change.", "ready"],
      "date-required": ["Destination required", "Enter a complete calendar date. No intent was created and nothing changed.", "error"],
      "future-rejected": ["Destination rejected", "Future dates cannot create a date-change intent. Nothing changed.", "error"],
      "same-day-rejected": ["Destination rejected", "The Source Item is already on that Journal Day. Nothing changed.", "error"],
      pending: ["Change pending", "One intent is represented. Controls are locked and the archive is still unchanged.", "pending"],
      failure: ["Nothing changed", "A known failure applied zero effects. Retry reuses the existing intent.", "error"],
      unknown: ["Result unknown", "Do not create another intent. Check the existing intent's status.", "attention"],
      interrupted: ["Connection interrupted", "No result is represented. The before-state remains exact until status is checked.", "attention"],
      "competing-revision": ["Preview is out of date", "A newer source revision invalidated this preview. Review the latest source before trying again.", "attention"],
      success: ["Journal Date changed", "One Source Item moved exactly once and one typed history event was added.", "success"],
      "rapid-repeat": ["Duplicate result ignored", "A late duplicate delivery produced no second effect and no second history event.", "success"],
    };
    return content[state.phase] || content.ready;
  }

  function renderBeforeAfter(label, before, after, emphasis) {
    return `<div class="lid-consequence-row-v17">
      <dt>${escapeHtml(label)}</dt>
      <dd><span><small>Before</small>${escapeHtml(before)}</span><span class="lid-arrow-v17" aria-hidden="true">→</span><strong class="${emphasis ? "is-emphasis" : ""}"><small>After</small>${escapeHtml(after)}</strong></dd>
    </div>`;
  }

  function consequenceCards(state) {
    const context = state.context;
    const destinationLabel = isCalendarDate(state.destination) ? longDate(state.destination) : "Choose a destination";
    const afterState = state.effectCount === 1 ? "Applied" : "If changed";
    if (!state.validation.valid) {
      return `<section class="lid-section-v17 lid-preview-needed-v17" aria-labelledby="lid-consequences-title-v17">
        <div class="lid-section-heading-v17">
          <div><p class="lid-eyebrow-v17">Step 3 · Review consequences</p><h2 id="lid-consequences-title-v17">Valid destination required</h2></div>
          <span class="lid-preview-badge-v17">Preview unavailable</span>
        </div>
        <p class="lid-section-intro-v17">No destination consequence is represented until the New Journal Date is complete, different from the current day, and not in the future.</p>
        <div class="lid-neutral-preview-v17"><strong>Nothing changed</strong><span>0 intents · 0 archive effects · 0 history events · 0 provider requests</span></div>
      </section>`;
    }
    return `<section class="lid-section-v17" aria-labelledby="lid-consequences-title-v17">
      <div class="lid-section-heading-v17">
        <div><p class="lid-eyebrow-v17">Step 3 · Review consequences</p><h2 id="lid-consequences-title-v17">Two Journal Days change together</h2></div>
        <span class="lid-preview-badge-v17">${escapeHtml(state.previewAuthority)} preview</span>
      </div>
      <p class="lid-section-intro-v17">The represented outcome is zero-or-one: every row below remains in the Before state, or every After value applies together.</p>
      ${context.origin === "inherited-v16" ? '<p class="lid-projection-boundary-v17"><strong>Context boundary:</strong> Source identity, date, timestamp, and revision were copied read-only from the invoking v16 item. Cover, retained-source, generated-field, and destination-day rows remain fixed synthetic consequence fixtures; they are not a read of that archive day.</p>' : ""}
      <div class="lid-day-grid-v17">
        <article class="lid-day-card-v17" aria-labelledby="lid-current-day-title-v17">
          <header><div><span class="lid-card-kicker-v17">Current day</span><h3 id="lid-current-day-title-v17">${longDate(context.currentDate)}</h3></div><span class="lid-day-state-v17">${afterState}</span></header>
          <dl>
            ${renderBeforeAfter("Source set", `${context.sourceLabel} + one retained synthetic Source Item`, "One retained synthetic Source Item", true)}
            ${renderBeforeAfter("Visibility", "Visible", "Visible · one synthetic Source Item remains")}
            ${renderBeforeAfter("Cover", `${AUTHORITY.oldCoverBefore} · AI artwork`, `${AUTHORITY.oldCoverAfter} · real Daily Photo`, true)}
            ${renderBeforeAfter("Generated fields", "Current", "Stale · source set changed")}
            ${renderBeforeAfter("Artwork", "Active AI artwork", "Historical · retained", true)}
            ${renderBeforeAfter("Artwork History", "0 retained versions", "1 retained version")}
          </dl>
        </article>
        <article class="lid-day-card-v17" aria-labelledby="lid-destination-day-title-v17">
          <header><div><span class="lid-card-kicker-v17">Destination day</span><h3 id="lid-destination-day-title-v17">${escapeHtml(destinationLabel)}</h3></div><span class="lid-day-state-v17">${afterState}</span></header>
          <dl>
            ${renderBeforeAfter("Source set", "Two synthetic Source Items", `Adds ${context.sourceLabel}`, true)}
            ${renderBeforeAfter("Visibility", "Visible", "Visible")}
            ${renderBeforeAfter("Cover", `${AUTHORITY.destinationCover} · real Daily Photo`, "Unchanged · real-photo precedence", true)}
            ${renderBeforeAfter("Generated fields", "Current", "Stale · source set changed")}
            ${renderBeforeAfter("Artwork", "No AI artwork", "No request queued")}
            ${renderBeforeAfter("Source binding", "Two Source Items", "Three Source Items · exact set")}
          </dl>
        </article>
      </div>
    </section>`;
  }

  function operationActions(state) {
    if (state.phase === "failure") {
      return `<button class="lid-primary-v17" type="button" data-lid-action="retry">Retry same intent</button><button class="lid-secondary-v17" type="button" data-lid-action="reset">Reset fixture</button>`;
    }
    if (["unknown", "interrupted"].includes(state.phase)) {
      return `<button class="lid-primary-v17" type="button" data-lid-action="check-status">Check existing intent</button>`;
    }
    if (state.phase === "competing-revision") {
      return `<button class="lid-primary-v17" type="button" data-lid-action="review-latest">Review latest source</button><button class="lid-secondary-v17" type="button" data-lid-action="reset">Restart review</button>`;
    }
    if (["success", "rapid-repeat"].includes(state.phase)) {
      return `<div class="lid-result-links-v17" aria-label="Resulting Journal Days">
        <a href="#lid-main-v17" data-lid-action="view-day" data-lid-day="current">View resulting ${shortDate(state.context.currentDate)} Journal Day</a>
        <a href="#lid-main-v17" data-lid-action="view-day" data-lid-day="destination">View resulting ${shortDate(state.destination)} Journal Day</a>
      </div>${state.phase === "success" ? `<div class="lid-synthetic-controls-v17 is-duplicate">
        <p id="lid-duplicate-delivery-title-v17">Prototype-only replay check</p>
        <button class="lid-secondary-v17" type="button" data-lid-action="settle" data-lid-outcome="success" aria-describedby="lid-duplicate-delivery-title-v17">Deliver duplicate result</button>
      </div>` : ""}<button class="lid-secondary-v17" type="button" data-lid-action="reset">Run another synthetic review</button>`;
    }
    if (state.phase === "pending") {
      return `<button class="lid-primary-v17" type="button" aria-disabled="true" disabled>Change pending…</button>
        <div class="lid-synthetic-controls-v17">
          <p id="lid-pending-outcome-title-v17"><strong>Prototype-only outcome delivery</strong><span>Choose one deterministic result for this accepted intent.</span></p>
          <div class="lid-synthetic-outcomes-v17" role="group" aria-labelledby="lid-pending-outcome-title-v17">
            <button type="button" data-lid-action="settle" data-lid-outcome="success">Deliver success</button>
            <button type="button" data-lid-action="settle" data-lid-outcome="failure">Deliver known failure</button>
            <button type="button" data-lid-action="settle" data-lid-outcome="unknown">Deliver result unknown</button>
            <button type="button" data-lid-action="settle" data-lid-outcome="interrupted">Deliver interruption</button>
            <button type="button" data-lid-action="settle" data-lid-outcome="competing-revision">Deliver competing revision</button>
          </div>
        </div>`;
    }
    return `<button class="lid-secondary-v17" type="button" data-lid-action="cancel-feature">Cancel · return to Source Item</button>
      <button class="lid-primary-v17" type="button" data-lid-action="confirm" ${state.validation.valid && state.phase === "ready" ? "" : "disabled"}>Change Journal Date</button>`;
  }

  function operationPanel(state) {
    const phase = phaseContent(state);
    return `<section class="lid-operation-v17 is-${phase[2]}" aria-labelledby="lid-operation-state-v17">
      <div class="lid-operation-icon-v17" aria-hidden="true">${phase[2] === "success" ? "✓" : phase[2] === "error" ? "!" : phase[2] === "attention" ? "?" : phase[2] === "pending" ? "…" : "→"}</div>
      <div class="lid-operation-copy-v17"><p class="lid-eyebrow-v17">Step 4 · Resolve</p><h2 id="lid-operation-state-v17" tabindex="-1">${phase[0]}</h2><p>${phase[1]}</p>
        <ul class="lid-operation-facts-v17" aria-label="Operation cardinality">
          <li><strong>${state.intentCount}</strong><span>Intent${state.intentCount === 1 ? "" : "s"}</span></li>
          <li><strong>${state.effectCount}</strong><span>Archive effect${state.effectCount === 1 ? "" : "s"}</span></li>
          <li><strong>${state.historyEvents.length}</strong><span>History event${state.historyEvents.length === 1 ? "" : "s"}</span></li>
          <li><strong>${state.providerRequests}</strong><span>Provider requests</span></li>
        </ul>
      </div>
      <div class="lid-operation-actions-v17">${operationActions(state)}</div>
    </section>`;
  }

  function sourceAndDestination(state) {
    const context = state.context;
    const locked = !["ready", "date-required", "future-rejected", "same-day-rejected"].includes(state.phase);
    return `<div class="lid-input-grid-v17">
      <section class="lid-source-card-v17" aria-labelledby="lid-source-title-v17">
        <p class="lid-eyebrow-v17">Step 1 · Source Item</p>
        <div class="lid-source-heading-v17"><span class="lid-source-mark-v17" aria-hidden="true">${escapeHtml(context.kind === "daily-photo" ? "P" : "J")}</span><div><h2 id="lid-source-title-v17">${escapeHtml(context.sourceLabel)}</h2><p>${escapeHtml(context.sourceType)} · Review ${state.currentRevision}</p></div></div>
        <p class="lid-context-note-v17">${context.origin === "inherited-v16"
          ? "<strong>Selected from frozen v16</strong> · Visible item context is copied read-only into this browser-memory review. No archive value is changed."
          : "<strong>Fixed synthetic demo</strong> · This labelled v17 fixture is not an imported archive item. No archive value is changed."}</p>
        <dl>
          <div><dt>Source reference</dt><dd>${escapeHtml(context.sourceId)}</dd></div>
          <div><dt>Source revision</dt><dd>${escapeHtml(context.sourceRevision)}</dd></div>
          <div><dt>Current Journal Date</dt><dd>${longDate(context.currentDate)}<span class="lid-context-basis-v17">${escapeHtml(context.currentDateBasis)}</span></dd></div>
          <div class="lid-immutable-v17"><dt>Original Timestamp</dt><dd>${escapeHtml(context.originalTimestamp)}<span>${escapeHtml(context.originalTimestampBasis)}</span></dd></div>
          <div><dt>Timezone</dt><dd>${AUTHORITY.timezone}</dd></div>
        </dl>
      </section>
      <section class="lid-destination-card-v17" aria-labelledby="lid-destination-title-v17">
        <p class="lid-eyebrow-v17">Step 2 · Destination</p>
        <h2 id="lid-destination-title-v17">Choose the new Journal Date</h2>
        <label for="lid-new-date-v17">New Journal Date</label>
        <input id="lid-new-date-v17" type="date" value="${escapeHtml(state.destination)}" max="${AUTHORITY.today}" data-lid-action="set-destination" required aria-describedby="lid-date-help-v17" ${state.validation.valid ? 'aria-invalid="false"' : 'aria-invalid="true" aria-errormessage="lid-date-validation-v17"'} ${locked ? "disabled" : ""} />
        <p id="lid-date-help-v17" class="lid-field-help-v17">Interpreted in ${AUTHORITY.timezone}. Fixed prototype clock: 19 Aug 2026, 10:00 am IST.</p>
        <p id="lid-date-validation-v17" class="lid-validation-v17 is-${state.validation.valid ? "valid" : "invalid"}"><span aria-hidden="true">${state.validation.valid ? "✓" : "!"}</span>${escapeHtml(state.validation.message)}</p>
        <p class="lid-no-effect-v17">Choosing a date only updates this preview. It does not create an intent.</p>
      </section>
    </div>`;
  }

  function historyCard(state) {
    if (!state.historyEvents.length) return "";
    const event = state.historyEvents[0];
    return `<section class="lid-history-event-v17" aria-labelledby="lid-history-event-title-v17">
      <div><p class="lid-eyebrow-v17">Typed history · represented in this tab</p><h2 id="lid-history-event-title-v17">${event.type}</h2></div>
      <dl><div><dt>Source Item</dt><dd>${escapeHtml(state.context.sourceLabel)}</dd></div><div><dt>From</dt><dd>${longDate(event.from)}</dd></div><div><dt>To</dt><dd>${longDate(event.to)}</dd></div><div><dt>Events</dt><dd>1 · no duplicate</dd></div></dl>
    </section>`;
  }

  function resultingDay(state) {
    const projection = afterProjection(state.destination, state.context);
    const current = state.dayView === "current";
    const day = current ? projection.currentDay : projection.destinationDay;
    const title = current ? "Current-day result" : "Destination-day result";
    const sourceLabels = day.sources.map((source) => source === state.context.sourceId
      ? state.context.sourceLabel
      : source === "retained-synthetic-source" ? "Retained synthetic Source Item" : source.includes("photo") ? "Synthetic Daily Photo" : "Blue notebook note");
    return `<section class="lid-resulting-day-v17" aria-labelledby="lid-resulting-day-title-v17">
      <button class="lid-back-v17" type="button" data-lid-action="back-summary"><span aria-hidden="true">←</span> Back to completed change</button>
      <p class="lid-eyebrow-v17">${title} · ${AUTHORITY.timezone}</p>
      <h2 id="lid-resulting-day-title-v17" tabindex="-1">${longDate(day.date)}</h2>
      <p class="lid-resulting-summary-v17">The completed-change summary remains in browser memory while this synthetic Journal Day projection is open.</p>
      <div class="lid-resulting-grid-v17">
        <article><span class="lid-card-kicker-v17">Visibility</span><strong>Visible</strong><p>${current ? "A synthetic Daily Photo remains after the note moves." : "The existing day remains visible and receives the moved note."}</p></article>
        <article><span class="lid-card-kicker-v17">Selected cover</span><strong>${escapeHtml(day.cover.label)}</strong><p>${day.cover.type}. ${current ? "The invalidated AI cover is retained in Artwork History." : "Real-photo precedence is unchanged."}</p></article>
        <article><span class="lid-card-kicker-v17">Generated fields</span><strong>Stale</strong><p>Source-set change is visible. No automatic provider request was queued.</p></article>
        <article><span class="lid-card-kicker-v17">Source Items</span><strong>${day.sources.length}</strong><ul>${sourceLabels.map((source) => `<li>${escapeHtml(source)}</li>`).join("")}</ul></article>
      </div>
      <aside class="lid-timestamp-proof-v17"><span>Original Timestamp</span><strong>${escapeHtml(state.context.originalTimestamp)}</strong><small>${escapeHtml(state.context.originalTimestampBasis)}</small></aside>
    </section>`;
  }

  function fixtureConsole(state) {
    const labels = {
      ready: "Ready",
      "future-rejected": "Future rejected",
      "same-day-rejected": "Same-day rejected",
      pending: "Pending",
      failure: "Known failure",
      unknown: "Unknown result",
      interrupted: "Interrupted",
      "competing-revision": "Competing revision",
      success: "Success",
      "rapid-repeat": "Rapid repeat",
    };
    return `<aside class="lid-fixture-console-v17" aria-labelledby="lid-fixture-title-v17">
      <details open>
        <summary id="lid-fixture-title-v17"><span>Prototype states</span><small>Deterministic · browser memory</small></summary>
        <p>Switching a state resets this synthetic fixture to its exact named authority.</p>
        <div class="lid-fixture-buttons-v17" role="group" aria-label="Atomic Redating prototype states">
          ${REQUIRED_FIXTURES.map((key) => `<button type="button" data-lid-action="set-fixture" data-lid-fixture="${key}" aria-pressed="${String(state.fixture === key)}"><span aria-hidden="true">${state.fixture === key ? "●" : "○"}</span>${labels[key]}</button>`).join("")}
        </div>
        <button class="lid-reset-v17" type="button" data-lid-action="reset">Reset current Source Item</button>
      </details>
      <section class="lid-proof-card-v17" aria-labelledby="lid-proof-title-v17">
        <p class="lid-eyebrow-v17">Invariant monitor</p><h2 id="lid-proof-title-v17">Zero or one complete effect</h2>
        <dl><div><dt>Intent count</dt><dd>${state.intentCount}</dd></div><div><dt>Effect count</dt><dd>${state.effectCount}</dd></div><div><dt>Typed events</dt><dd>${state.historyEvents.length}</dd></div><div><dt>Provider requests</dt><dd>${state.providerRequests}</dd></div></dl>
        <p>Original Timestamp remains <strong>${escapeHtml(state.context.originalTimestamp)}</strong>.</p>
      </section>
    </aside>`;
  }

  function render(state) {
    return `<div class="lid-v17-shell" data-lid-phase="${escapeHtml(state.phase)}" data-lid-theme="${escapeHtml(state.theme)}">
      <header class="lid-topbar-v17">
        <a class="lid-brand-v17" href="index-v16.html" aria-label="Open the frozen Life in Days v16 archive directly"><span aria-hidden="true">L</span><strong>Life in Days</strong></a>
        <div class="lid-topbar-actions-v17"><span class="lid-version-v17">Prototype v17 · synthetic</span><button type="button" data-lid-action="toggle-theme" aria-label="Use ${state.theme === "light" ? "dark" : "light"} prototype theme">${state.theme === "light" ? "Dark" : "Light"} theme</button><button type="button" data-lid-action="close-feature">Back to v16 archive</button></div>
      </header>
      <main id="lid-main-v17" class="lid-main-v17" tabindex="-1">
        <header class="lid-page-header-v17">
          <div><p class="lid-eyebrow-v17">Management / Atomic Redating</p><h1 id="lid-v17-title" tabindex="-1">Change Journal Date</h1><p class="lid-lede-v17">Move one Source Item deliberately. Review both days before one zero-or-one represented outcome.</p></div>
          <aside class="lid-boundary-badge-v17"><span aria-hidden="true">◇</span><div><strong>Frontend representation</strong><small>No backend, persistence, provider, or production claim</small></div></aside>
        </header>
        <div class="lid-workspace-layout-v17">
          <div class="lid-workspace-v17">
            ${state.dayView ? resultingDay(state) : `${sourceAndDestination(state)}${consequenceCards(state)}${operationPanel(state)}${historyCard(state)}`}
          </div>
          ${fixtureConsole(state)}
        </div>
        <footer class="lid-boundary-v17">
          <strong>Prototype boundary</strong>
          <p>Fictional deterministic browser-memory state only. This workspace does not verify durable atomicity, concurrency, idempotency across processes, VoiceNotes behavior, provider access, authentication, encryption, deployment, or production readiness.</p>
          <a href="index-v16.html">Open the frozen v16 archive directly</a>
        </footer>
      </main>
    </div>`;
  }

  function snapshot(state) {
    const projection = !state.validation.valid
      ? neutralProjection(state.context)
      : state.effectCount === 1
        ? afterProjection(state.destination, state.context)
        : beforeProjection(state.destination, state.context);
    return {
      version: AUTHORITY.version,
      feature: AUTHORITY.feature,
      fixture: state.fixture,
      phase: state.phase,
      fixedClock: AUTHORITY.fixedClock,
      timezone: AUTHORITY.timezone,
      sourceItem: {
        id: state.context.sourceId,
        label: state.context.sourceLabel,
        type: state.context.sourceType,
        origin: state.context.origin,
        originalTimestamp: state.context.originalTimestamp,
        originalTimestampBasis: state.context.originalTimestampBasis,
        sourceRevision: state.context.sourceRevision,
        beforeSnapshot: state.context.beforeSnapshot || null,
        currentJournalDate: state.context.currentDate,
        currentRevision: state.currentRevision,
      },
      selectedDestination: state.destination,
      destinationValidation: state.validation,
      intentCount: state.intentCount,
      effectCount: state.effectCount,
      providerRequests: state.providerRequests,
      deliveredResults: state.deliveredResults,
      projection,
      historyEvents: state.historyEvents,
      dayView: state.dayView,
      theme: state.theme,
    };
  }

  function invariants(state) {
    const current = snapshot(state);
    const untouched = beforeProjection(state.destination, state.context);
    const applied = afterProjection(state.destination, state.context);
    const urlText = window.location.href;
    const liveText = `${document.querySelector("#lid-status-v17")?.textContent || ""} ${document.querySelector("#lid-alert-v17")?.textContent || ""}`;
    const assertions = [
      { name: "Original Timestamp is immutable", pass: current.projection.originalTimestamp === state.context.originalTimestamp && current.sourceItem.originalTimestamp === state.context.originalTimestamp },
      { name: "At most one intent exists", pass: Number.isInteger(current.intentCount) && current.intentCount >= 0 && current.intentCount <= 1 },
      { name: "At most one archive effect exists", pass: Number.isInteger(current.effectCount) && current.effectCount >= 0 && current.effectCount <= 1 },
      { name: "Typed-event cardinality equals effect cardinality", pass: current.historyEvents.length === current.effectCount },
      { name: "No provider request is queued", pass: current.providerRequests === 0 },
      { name: "Source launch context is complete", pass: Boolean(current.sourceItem.id && current.sourceItem.label && current.sourceItem.type && current.sourceItem.sourceRevision && current.sourceItem.originalTimestamp && current.sourceItem.currentJournalDate && current.sourceItem.beforeSnapshot) },
      { name: "Invalid destinations cannot create an intent", pass: current.destinationValidation.valid || (current.intentCount === 0 && current.effectCount === 0) },
      { name: "Date-required state is coherent and unpressed", pass: current.phase !== "date-required" || (current.fixture === "date-required" && current.destinationValidation.kind === "invalid" && current.intentCount === 0 && current.effectCount === 0 && current.projection.destinationDay === null && !document.querySelector('[data-lid-fixture][aria-pressed="true"]')) },
      { name: "No-effect states retain the exact source date", pass: current.effectCount === 1 || current.projection.sourceDate === untouched.sourceDate },
      { name: "No-effect states retain the exact current-day source set", pass: current.effectCount === 1 || JSON.stringify(current.projection.currentDay.sources) === JSON.stringify(untouched.currentDay.sources) },
      { name: "Success moves the Source Item to the destination exactly once", pass: current.effectCount === 0 || (current.projection.sourceDate === state.destination && !current.projection.currentDay.sources.includes(state.context.sourceId) && current.projection.destinationDay.sources.filter((item) => item === state.context.sourceId).length === 1) },
      { name: "Success retains one historical artwork version", pass: current.effectCount === 0 || current.projection.currentDay.artworkHistoryCount === applied.currentDay.artworkHistoryCount },
      { name: "Success keeps real-photo precedence on both resulting days", pass: current.effectCount === 0 || (current.projection.currentDay.cover.type === "real Daily Photo" && current.projection.destinationDay.cover.type === "real Daily Photo") },
      { name: "Success appends the exact typed history event", pass: current.effectCount === 0 || (current.historyEvents[0]?.type === "Journal Date changed" && current.historyEvents[0]?.from === state.context.currentDate && current.historyEvents[0]?.to === state.destination) },
      { name: "Fixture state is absent from the URL", pass: ![state.context.sourceId, state.context.currentDate, state.destination, state.fixture].some((value) => value && urlText.includes(value)) },
      { name: "Page title is generic", pass: document.title === "Life in Days" },
      { name: "Live regions omit fixture identity and dates", pass: ![state.context.sourceId, state.context.currentDate, state.destination].some((value) => value && liveText.includes(value)) },
      { name: "Active workspace exposes one feature heading", pass: !runtime.isActive("v17") || document.querySelectorAll("#lid-feature-host-v17 h1").length === 1 },
      { name: "Task workspace precedes prototype console", pass: !runtime.isActive("v17") || Boolean(document.querySelector(".lid-workspace-v17")?.compareDocumentPosition(document.querySelector(".lid-fixture-console-v17")) & Node.DOCUMENT_POSITION_FOLLOWING) },
      { name: "Active workspace has no horizontal page overflow", pass: !runtime.isActive("v17") || document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1 },
    ];
    return { pass: assertions.every((assertion) => assertion.pass), assertions };
  }

  runtime.registerFeature("v17", {
    version: 17,
    title: "Atomic Redating",
    launcherTitle: "Atomic Redating · fixed synthetic demo",
    createState: baseState,
    prepareOpen,
    validateLaunchContext,
    canClose,
    blockedCloseFocus: "#lid-operation-state-v17",
    blockedCloseMessage: "Resolve or check the existing date-change intent before leaving this task.",
    fixtureState,
    reduce,
    render,
    snapshot,
    invariants,
    defaultFocus: "#lid-v17-title",
    qaManifest: () => ({
      version: 17,
      feature: AUTHORITY.feature,
      requirements: ["LID-SCP-002", "LID-SRC-003", "LID-SRC-004 redating portion"],
      authority: {
        fixedClock: AUTHORITY.fixedClock,
        timezone: AUTHORITY.timezone,
        sourceItem: AUTHORITY.sourceId,
        currentDate: AUTHORITY.currentDate,
        validDestination: AUTHORITY.destinationDate,
        originalTimestamp: AUTHORITY.originalTimestamp,
      },
      fixtures: [...REQUIRED_FIXTURES],
      files: ["index-v17.html", "runtime-v17.js", "app-v17.js", "styles-v17.css", "README-v17.md", "check-v17.mjs", "capture-phase2-evidence-v17.mjs"],
      boundary: "Synthetic deterministic frontend representation in browser memory only.",
    }),
  });

  if (document.body.dataset.lidVersion === "17") runtime.openFeature("v17");
})();
