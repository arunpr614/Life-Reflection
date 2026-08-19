(function initializeLifeInDaysRuntimeV17() {
  "use strict";

  if (window.__LID_RUNTIME__) return;

  const capsules = new Map();
  const hiddenLegacy = new Map();
  let activeKey = null;
  let returnFocus = null;
  let archiveScrollY = 0;

  const runtimeRoot = document.createElement("div");
  runtimeRoot.id = "lid-runtime-v17";
  runtimeRoot.className = "lid-runtime-v17";
  runtimeRoot.innerHTML = `
    <a class="lid-skip-v17" href="#lid-feature-host-v17">Skip to prototype feature</a>
    <button class="lid-launcher-v17" type="button" data-lid-action="open-latest" aria-label="Open the latest compatible prototype feature">
      <span aria-hidden="true">↔</span><span data-lid-launcher-title>Prototype feature</span><small data-lid-launcher-version>Loading…</small>
    </button>
    <div id="lid-feature-host-v17" tabindex="-1" hidden></div>
    <p id="lid-status-v17" class="lid-sr-only-v17" aria-live="polite" aria-atomic="true"></p>
    <p id="lid-alert-v17" class="lid-sr-only-v17" role="alert" aria-atomic="true"></p>`;
  document.body.prepend(runtimeRoot);

  const featureHost = runtimeRoot.querySelector("#lid-feature-host-v17");
  const launcher = runtimeRoot.querySelector(".lid-launcher-v17");
  const skipLink = runtimeRoot.querySelector(".lid-skip-v17");
  const politeRegion = runtimeRoot.querySelector("#lid-status-v17");
  const alertRegion = runtimeRoot.querySelector("#lid-alert-v17");
  const launcherTitle = runtimeRoot.querySelector("[data-lid-launcher-title]");
  const launcherVersion = runtimeRoot.querySelector("[data-lid-launcher-version]");
  const legacySelectors = [
    "body > .skip-link",
    "#prototype-root",
    "#modal-root",
    "#calendar-status-live-v9",
    "#almanac-status-live-v9",
    "#shell-status-live-v10",
    "#date-review-status-live-v11",
    "#capture-status-live-v14",
    "#upload-status-live-v14",
    "#correction-status-live-v15",
    "#source-conflict-status-live-v16",
    "#toast-region",
  ];

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function cleanVisibleText(element, fallback = "") {
    if (!(element instanceof HTMLElement)) return fallback;
    const value = element.textContent.replace(/\s+/g, " ").trim();
    return value ? value.slice(0, 240) : fallback;
  }

  function inheritedCalendarDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= monthDays[month - 1]
      ? `${match[1]}-${match[2]}-${match[3]}`
      : null;
  }

  function visibleOriginalTimestamp(scope) {
    if (!(scope instanceof HTMLElement)) return null;
    const candidate = [...scope.querySelectorAll("footer span, .gallery-caption span")]
      .map((element) => cleanVisibleText(element))
      .find((value) => /^Original Timestamp\s*[·:]\s*/i.test(value));
    return candidate ? candidate.replace(/^Original Timestamp\s*[·:]\s*/i, "").trim() || null : null;
  }

  function visibleDefinitionValue(scope, label) {
    if (!(scope instanceof HTMLElement)) return null;
    const term = [...scope.querySelectorAll("dt")]
      .find((element) => cleanVisibleText(element).toLowerCase() === label.toLowerCase());
    return term ? cleanVisibleText(term.nextElementSibling) || null : null;
  }

  function calendarDateFromVisibleText(value) {
    const match = /\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\b/i.exec(String(value || ""));
    if (!match) return null;
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = months.indexOf(match[2].slice(0, 3).toLowerCase()) + 1;
    return inheritedCalendarDate(`${match[3]}-${String(month).padStart(2, "0")}-${String(Number(match[1])).padStart(2, "0")}`);
  }

  function extractInheritedLaunchContext(trigger) {
    if (!(trigger instanceof HTMLElement)) return null;
    const currentDate = inheritedCalendarDate(trigger.dataset.date);
    const journalCard = trigger.closest(".journal-card");
    if (journalCard) {
      const footerFacts = [...journalCard.querySelectorAll("footer span")].map((element) => cleanVisibleText(element));
      const sourceId = journalCard.id || null;
      const sourceLabel = cleanVisibleText(journalCard.querySelector("h3"), "Selected v16 journal");
      const sourceType = cleanVisibleText(journalCard.querySelector(".badge-source"), "Journal");
      const originalTimestamp = visibleOriginalTimestamp(journalCard);
      const sourceRevision = footerFacts[1]
        ? `Displayed v16 source state · ${footerFacts[1]}`
        : cleanVisibleText(journalCard.querySelector(".badge-correction, .badge-prototype-v15"), "No revision label exposed by v16");
      return {
        origin: "inherited-v16",
        kind: "journal",
        currentDate,
        sourceId,
        sourceLabel,
        sourceType,
        originalTimestamp,
        sourceRevision,
        beforeSnapshot: { sourceId, sourceLabel, sourceType, currentDate, originalTimestamp, sourceRevision },
      };
    }

    const gallery = trigger.closest(".gallery-section");
    if (gallery) {
      const photoButton = gallery.querySelector(".gallery-image-button");
      const providerLabel = cleanVisibleText(gallery.querySelector(".gallery-caption .badge-source"), "Photo source");
      const sourceId = photoButton?.dataset.photoId || null;
      const sourceLabel = cleanVisibleText(gallery.querySelector(".gallery-caption strong"), "Selected v16 Daily Photo");
      const sourceType = `Daily Photo · ${providerLabel}`;
      const originalTimestamp = visibleOriginalTimestamp(gallery);
      const sourceRevision = "No revision label exposed by v16";
      return {
        origin: "inherited-v16",
        kind: "daily-photo",
        currentDate,
        sourceId,
        sourceLabel,
        sourceType,
        originalTimestamp,
        sourceRevision,
        beforeSnapshot: {
          sourceId,
          sourceLabel,
          sourceType,
          currentDate,
          originalTimestamp,
          sourceRevision,
          selectedCover: Boolean(gallery.querySelector(".badge-cover")),
        },
      };
    }

    const captureScope = trigger.closest(".telegram-outcome, .telegram-capture-page, .telegram-handoff-page");
    if (captureScope) {
      const caption = visibleDefinitionValue(captureScope, "Photo Caption state");
      const sourceType = visibleDefinitionValue(captureScope, "Source form") || visibleDefinitionValue(captureScope, "Source type");
      const visibleDate = visibleDefinitionValue(captureScope, "Journal Date") || visibleDefinitionValue(captureScope, "Current Journal Date");
      const originalTimestamp = visibleDefinitionValue(captureScope, "Original Timestamp");
      const parsedDate = calendarDateFromVisibleText(visibleDate);
      const sourceLabel = caption || "Selected v16 Daily Photo";
      const sourceId = parsedDate ? `derived-v16-capture-${parsedDate}-${sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || "daily-photo"}` : null;
      const normalizedType = sourceType ? `Daily Photo · ${sourceType}` : "Daily Photo";
      const normalizedTimestamp = originalTimestamp?.replace(/\s*·\s*Immutable\s*$/i, "") || null;
      const sourceRevision = "No revision label exposed by v16";
      return {
        origin: "inherited-v16",
        kind: "daily-photo",
        currentDate: parsedDate,
        sourceId,
        sourceLabel,
        sourceType: normalizedType,
        originalTimestamp: normalizedTimestamp,
        sourceRevision,
        beforeSnapshot: { sourceId, sourceLabel, sourceType: normalizedType, currentDate: parsedDate, originalTimestamp: normalizedTimestamp, sourceRevision },
      };
    }
    return null;
  }

  function completeInheritedLaunchContext(context) {
    return Boolean(
      context
      && context.origin === "inherited-v16"
      && inheritedCalendarDate(context.currentDate)
      && cleanVisibleTextValue(context.sourceId)
      && cleanVisibleTextValue(context.sourceLabel)
      && cleanVisibleTextValue(context.sourceType)
      && cleanVisibleTextValue(context.originalTimestamp)
      && cleanVisibleTextValue(context.sourceRevision)
      && context.beforeSnapshot
      && typeof context.beforeSnapshot === "object"
      && context.beforeSnapshot.sourceId === context.sourceId
      && context.beforeSnapshot.currentDate === context.currentDate
      && context.beforeSnapshot.originalTimestamp === context.originalTimestamp,
    );
  }

  function cleanVisibleTextValue(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function registeredFeatures() {
    return [...capsules.entries()]
      .map(([key, capsule]) => ({
        key,
        version: Number(capsule.descriptor.version) || 0,
        title: capsule.descriptor.title || key,
        launcherTitle: capsule.descriptor.launcherTitle || capsule.descriptor.title || key,
      }))
      .sort((left, right) => left.version - right.version || left.key.localeCompare(right.key));
  }

  function latestCompatibleFeature() {
    const pageVersion = Number(document.body.dataset.lidVersion) || Number.POSITIVE_INFINITY;
    return registeredFeatures().filter((feature) => feature.version <= pageVersion).at(-1) || null;
  }

  function updateLauncher() {
    const latest = latestCompatibleFeature();
    launcher.disabled = !latest;
    launcherTitle.textContent = latest?.launcherTitle || latest?.title || "Prototype feature";
    launcherVersion.textContent = latest ? `Prototype v${latest.version}` : "Unavailable";
    launcher.setAttribute("aria-label", latest ? `Open ${latest.launcherTitle || latest.title} prototype v${latest.version}` : "No compatible prototype feature is registered");
    skipLink.textContent = latest ? `Skip to ${latest.title}` : "Skip to prototype feature";
  }

  function isEligibleReturnFocus(element) {
    if (!(element instanceof HTMLElement) || !element.isConnected) return false;
    if (element === document.body || element === document.documentElement) return false;
    if (!element.matches('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')) return false;
    return !element.hidden && !element.inert;
  }

  function rememberAndHideLegacy() {
    legacySelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (runtimeRoot.contains(element) || hiddenLegacy.has(element)) return;
        hiddenLegacy.set(element, {
          hidden: element.hidden,
          inert: element.inert,
          ariaHidden: element.getAttribute("aria-hidden"),
        });
        element.hidden = true;
        element.inert = true;
        element.setAttribute("aria-hidden", "true");
      });
    });
  }

  function restoreLegacy() {
    hiddenLegacy.forEach((prior, element) => {
      if (!element.isConnected) return;
      element.hidden = prior.hidden;
      element.inert = prior.inert;
      if (prior.ariaHidden === null) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", prior.ariaHidden);
    });
    hiddenLegacy.clear();
  }

  function announce(message, assertive) {
    const region = assertive ? alertRegion : politeRegion;
    const other = assertive ? politeRegion : alertRegion;
    other.textContent = "";
    region.textContent = "";
    if (message) region.textContent = message;
  }

  function stableFocusSelector(element) {
    if (!(element instanceof HTMLElement) || !featureHost.contains(element)) return null;
    if (element.id) return `#${CSS.escape(element.id)}`;
    if (element.dataset.lidFocusKey) return `[data-lid-focus-key="${CSS.escape(element.dataset.lidFocusKey)}"]`;
    if (!element.dataset.lidAction) return null;
    const selectorParts = [`[data-lid-action="${CSS.escape(element.dataset.lidAction)}"]`];
    ["lidFixture", "lidOutcome", "lidDay", "lidFeature", "lidTheme"].forEach((key) => {
      if (element.dataset[key]) {
        const attribute = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        selectorParts.push(`[data-${attribute}="${CSS.escape(element.dataset[key])}"]`);
      }
    });
    return selectorParts.join("");
  }

  function captureFocusToken() {
    const element = document.activeElement;
    const selector = stableFocusSelector(element);
    if (!selector) return null;
    let selection = null;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      try {
        if (Number.isInteger(element.selectionStart) && Number.isInteger(element.selectionEnd)) {
          selection = {
            start: element.selectionStart,
            end: element.selectionEnd,
            direction: element.selectionDirection || "none",
          };
        }
      } catch {
        selection = null;
      }
    }
    return { selector, selection };
  }

  function restoreFocusToken(token) {
    if (!token) return false;
    const target = featureHost.querySelector(token.selector);
    if (!(target instanceof HTMLElement)) return false;
    target.focus({ preventScroll: true });
    if (token.selection && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      try {
        target.setSelectionRange(token.selection.start, token.selection.end, token.selection.direction);
      } catch {
        // Date and other non-text inputs retain focus but do not expose a text selection.
      }
    }
    return document.activeElement === target;
  }

  function focusAfterRender(capsule) {
    const selector = capsule.state.focusSelector || capsule.descriptor.defaultFocus || "#lid-main-v17";
    const target = featureHost.querySelector(selector);
    if (target instanceof HTMLElement) target.focus({ preventScroll: true });
  }

  function renderActive(options) {
    if (!activeKey) return;
    const capsule = capsules.get(activeKey);
    if (!capsule) return;
    const preservedFocus = options?.preserveFocus ? captureFocusToken() : null;
    featureHost.innerHTML = capsule.descriptor.render(clone(capsule.state));
    featureHost.hidden = false;
    runtimeRoot.dataset.activeFeature = activeKey;
    runtimeRoot.dataset.theme = capsule.state.theme || "light";
    const focusWasRestored = restoreFocusToken(preservedFocus);
    if (!focusWasRestored && options?.focus !== false) focusAfterRender(capsule);
    if (capsule.state.announcement) {
      announce(capsule.state.announcement, Boolean(capsule.state.announcementAssertive));
    }
  }

  function registerFeature(key, descriptor) {
    if (!key || capsules.has(key)) throw new Error("A unique feature key is required.");
    if (!descriptor || typeof descriptor.createState !== "function" || typeof descriptor.reduce !== "function" || typeof descriptor.render !== "function") {
      throw new Error("Feature capsules require createState, reduce, and render functions.");
    }
    capsules.set(key, { descriptor, state: descriptor.createState() });
    updateLauncher();
    return key;
  }

  function openLatest(options) {
    const latest = latestCompatibleFeature();
    return latest ? openFeature(latest.key, options) : false;
  }

  function openFeature(key, options) {
    const capsule = capsules.get(key);
    if (!capsule) return false;
    const launchContext = clone(options?.launchContext || null);
    if (typeof capsule.descriptor.validateLaunchContext === "function"
      && !capsule.descriptor.validateLaunchContext(clone(launchContext))) return false;
    if (!activeKey) {
      archiveScrollY = window.scrollY;
      returnFocus = isEligibleReturnFocus(options?.trigger)
        ? options.trigger
        : isEligibleReturnFocus(document.activeElement) ? document.activeElement : null;
    }
    const freshState = capsule.descriptor.createState();
    capsule.state = typeof capsule.descriptor.prepareOpen === "function"
      ? capsule.descriptor.prepareOpen(clone(freshState), launchContext)
      : freshState;
    activeKey = key;
    window.history.replaceState(null, "", window.location.pathname);
    rememberAndHideLegacy();
    document.body.classList.add("lid-v17-active");
    launcher.hidden = true;
    renderActive({ focus: true });
    window.scrollTo({ top: 0, behavior: "auto" });
    return true;
  }

  function closeFeature(reason = "programmatic") {
    if (!activeKey) return false;
    const capsule = capsules.get(activeKey);
    if (capsule && typeof capsule.descriptor.canClose === "function"
      && !capsule.descriptor.canClose(clone(capsule.state), reason)) {
      announce(capsule.descriptor.blockedCloseMessage || "Resolve the current operation before leaving this task.", true);
      const blockedTarget = featureHost.querySelector(capsule.descriptor.blockedCloseFocus || capsule.descriptor.defaultFocus || "") || featureHost;
      if (blockedTarget instanceof HTMLElement) blockedTarget.focus({ preventScroll: true });
      return false;
    }
    activeKey = null;
    featureHost.hidden = true;
    featureHost.replaceChildren();
    runtimeRoot.removeAttribute("data-active-feature");
    runtimeRoot.removeAttribute("data-theme");
    document.body.classList.remove("lid-v17-active");
    launcher.hidden = false;
    restoreLegacy();
    announce("", false);
    window.scrollTo({ top: archiveScrollY, behavior: "auto" });
    const target = isEligibleReturnFocus(returnFocus) ? returnFocus : launcher;
    target.focus({ preventScroll: true });
    window.scrollTo({ top: archiveScrollY, behavior: "auto" });
    returnFocus = null;
    return true;
  }

  function dispatch(key, type, payload, options) {
    const capsule = capsules.get(key);
    if (!capsule) return false;
    const next = capsule.descriptor.reduce(clone(capsule.state), { type, payload: clone(payload) });
    if (!next) return false;
    capsule.state = next;
    if (activeKey === key) renderActive({
      focus: options?.focus !== false,
      preserveFocus: options?.preserveFocus === true,
    });
    return true;
  }

  function setFixture(key, fixture) {
    const capsule = capsules.get(key);
    if (!capsule || typeof capsule.descriptor.fixtureState !== "function") return false;
    const next = capsule.descriptor.fixtureState(fixture, clone(capsule.state));
    if (!next) return false;
    capsule.state = next;
    if (activeKey === key) renderActive();
    return true;
  }

  function reset(key) {
    const capsule = capsules.get(key);
    if (!capsule) return false;
    capsule.state = capsule.descriptor.createState();
    if (activeKey === key) renderActive();
    return true;
  }

  function snapshot(key) {
    const capsule = capsules.get(key);
    if (!capsule) return null;
    return clone(typeof capsule.descriptor.snapshot === "function"
      ? capsule.descriptor.snapshot(clone(capsule.state))
      : capsule.state);
  }

  function runInvariants(key) {
    const capsule = capsules.get(key);
    if (!capsule || typeof capsule.descriptor.invariants !== "function") {
      return { pass: false, assertions: [{ name: "feature registered", pass: false }] };
    }
    return clone(capsule.descriptor.invariants(clone(capsule.state)));
  }

  function handleRuntimeClick(event) {
    const inheritedDateAction = event.target.closest('[data-action="change-date"], [data-action="capture-change-date"]');
    if (inheritedDateAction && !runtimeRoot.contains(inheritedDateAction)) {
      const launchContext = extractInheritedLaunchContext(inheritedDateAction);
      if (!completeInheritedLaunchContext(launchContext)) {
        announce("This action does not expose enough visible source context for Atomic Redating. The original v16 action will continue; no v17 state changed.", true);
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      openFeature("v17", {
        trigger: inheritedDateAction,
        launchContext,
      });
      announce("Atomic Redating workspace opened.", false);
      return;
    }

    const control = event.target.closest("[data-lid-action]");
    if (!control) return;
    const action = control.dataset.lidAction;
    if (action === "open-latest") {
      event.preventDefault();
      openLatest({ trigger: control });
      return;
    }
    if (action === "open-feature") {
      event.preventDefault();
      const requestedKey = control.dataset.lidFeature;
      if (capsules.has(requestedKey)) openFeature(requestedKey, { trigger: control });
      return;
    }
    if (!activeKey || !runtimeRoot.contains(control)) return;
    event.preventDefault();
    if (action === "cancel-feature") {
      closeFeature("cancel");
      return;
    }
    if (action === "close-feature") {
      closeFeature("back");
      return;
    }
    if (action === "set-fixture") {
      setFixture(activeKey, control.dataset.lidFixture);
      return;
    }
    dispatch(activeKey, action, {
      outcome: control.dataset.lidOutcome,
      day: control.dataset.lidDay,
      theme: control.dataset.lidTheme,
      value: control.value,
    });
  }

  function handleRuntimeChange(event) {
    const control = event.target.closest("[data-lid-action]");
    if (!activeKey || !control || !runtimeRoot.contains(control)) return;
    dispatch(activeKey, control.dataset.lidAction, { value: control.value }, { focus: false, preserveFocus: true });
  }

  function handleRuntimeKeydown(event) {
    if (event.key !== "Escape" || !activeKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closeFeature("escape");
  }

  function patchInheritedVersionCopy() {
    document.querySelectorAll("#prototype-root p").forEach((paragraph) => {
      if (paragraph.textContent === "A newer upstream revision is represented. V15 does not compare, select, or merge source text.") {
        paragraph.textContent = "A newer upstream revision is represented. Open Review source update to compare complete text and choose one deliberate outcome. Nothing is merged automatically.";
      }
    });
  }

  document.addEventListener("click", handleRuntimeClick, true);
  document.addEventListener("input", handleRuntimeChange, true);
  document.addEventListener("change", handleRuntimeChange, true);
  document.addEventListener("keydown", handleRuntimeKeydown, true);
  patchInheritedVersionCopy();
  const copyObserver = new MutationObserver(patchInheritedVersionCopy);
  const prototypeRoot = document.querySelector("#prototype-root");
  if (prototypeRoot) copyObserver.observe(prototypeRoot, { childList: true, subtree: true });

  const runtimeApi = Object.freeze({
    version: 17,
    registerFeature,
    openFeature,
    openLatest,
    closeFeature,
    dispatch,
    setFixture,
    reset,
    snapshot,
    runInvariants,
    listFeatures: () => clone(registeredFeatures()),
    manifest: () => ({ runtimeVersion: 17, loadedVersions: registeredFeatures().map((feature) => feature.version), features: clone(registeredFeatures()) }),
    isActive: (key) => activeKey === key,
  });
  Object.defineProperty(window, "__LID_RUNTIME__", {
    value: runtimeApi,
    configurable: false,
    enumerable: false,
    writable: false,
  });

  function qaTarget() {
    const latest = latestCompatibleFeature();
    return latest ? { ...latest, capsule: capsules.get(latest.key) } : null;
  }

  function qaSnapshot() {
    const target = qaTarget();
    return target ? snapshot(target.key) : null;
  }

  const qaApi = Object.freeze({
    manifest() {
      const target = qaTarget();
      const supplied = target && typeof target.capsule.descriptor.qaManifest === "function"
        ? target.capsule.descriptor.qaManifest()
        : target?.capsule.descriptor.qaManifest || {};
      return clone({
        ...supplied,
        qaFeature: target?.key || null,
        loadedVersions: registeredFeatures().map((feature) => feature.version),
        features: registeredFeatures(),
      });
    },
    reset() {
      const target = qaTarget();
      if (target) reset(target.key);
      return qaSnapshot();
    },
    setFixture(fixture) {
      const target = qaTarget();
      if (target) setFixture(target.key, fixture);
      return qaSnapshot();
    },
    dispatch(type, payload) {
      const target = qaTarget();
      if (target) dispatch(target.key, type, payload || {});
      return qaSnapshot();
    },
    settle(outcome) {
      const target = qaTarget();
      if (target) dispatch(target.key, "settle", { outcome });
      return qaSnapshot();
    },
    snapshot: qaSnapshot,
    runInvariants() {
      const target = qaTarget();
      return target ? runInvariants(target.key) : { pass: false, assertions: [{ name: "compatible QA feature registered", pass: false }] };
    },
  });
  Object.defineProperty(window, "__LID_QA__", {
    value: qaApi,
    configurable: false,
    enumerable: false,
    writable: false,
  });
})();
