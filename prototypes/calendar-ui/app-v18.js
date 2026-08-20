(function initializeHistoryAndProvenanceV18() {
  "use strict";

  const runtime = window.__LID_RUNTIME__;
  if (!runtime || runtime.version !== 17) throw new Error("History and Provenance requires the v17 compatibility runtime.");

  const AUTHORITY = Object.freeze({
    version: 18,
    feature: "PVA-013 History and Provenance",
    fixedClock: "2026-08-19T10:00:00+05:30",
    timezone: "Asia/Kolkata",
    sourceLabel: "Monsoon walk note",
    originalTimestamp: "17 Aug 2026, 11:42 pm IST",
    currentDate: "17 Aug 2026",
    currentDateIso: "2026-08-17",
    displayedRecord: "Correction 1",
    currentUpstreamRecord: "Revision 3",
    domainFingerprint: "v18|source:monsoon-walk-note|displayed:correction-1|upstream:revision-3-deleted|date:2026-08-17|summary:v2-protected-stale|artwork:v2-historical-stale|hidden:2026-08-11",
  });

  const REQUIRED_FIXTURES = Object.freeze([
    "global-ready",
    "day-ready",
    "item-ready",
    "field-ready",
    "artwork-ready",
    "hidden-day",
    "upstream-revised",
    "upstream-conflict",
    "upstream-untagged",
    "upstream-deleted",
    "empty",
    "loading",
    "failure",
    "interrupted",
  ]);
  const CAPTURE_SCENARIOS = Object.freeze(["compact-filtered-open", "pagination-both-success"]);
  const CORRECTION_BASE_FACT = Object.freeze(["Based on", "Revision 2"]);

  const CANONICAL_TOTAL_ORDER = Object.freeze(["E10", "E14", "E13", "E12", "E11", "E09", "E08", "E07", "E06", "E05", "E04", "E03", "E02", "E01", "E17", "E16", "E15"]);
  const SOURCE_ORDER = Object.freeze(["E10", "E14", "E13", "E12", "E11", "E05", "E04", "E01", "E17", "E15"]);
  const DERIVED_ORDER = Object.freeze(["E09", "E08", "E07", "E06", "E03", "E02", "E16"]);
  const CURRENT_SOURCE_ORDER = Object.freeze(["E10", "E14", "E13", "E12", "E11", "E05", "E04", "E01"]);
  const CURRENT_DERIVED_ORDER = Object.freeze(["E09", "E08", "E07", "E06", "E03", "E02"]);
  const SOURCE_FIRST_PAGE = Object.freeze(["E10", "E14", "E13", "E12", "E11", "E05", "E04"]);
  const DERIVED_FIRST_PAGE = Object.freeze(["E09", "E08", "E07", "E06"]);

  const SOURCE_CONTEXT_PROSE = "Fictional Correction 1 — A rain-washed path curved past paper lanterns; the synthetic narrator paused beside three quiet puddles before heading home.";
  const SOURCE_CONTEXT_PROSE_REVISION_2 = "Fictional Revision 2 — Rain softened the path beneath the paper lanterns; the synthetic narrator counted three quiet puddles before walking home.";
  const paginationAnchorBaselines = { source: null, derived: null };
  const paginationAnchorEvidence = { source: null, derived: null };
  const paginationRequestSerial = { source: 0, derived: 0 };
  const CANONICAL_ENTRY_ORDER = Object.freeze(["day", "item", "field", "artwork"]);
  const CANONICAL_ENTRY_MAP = Object.freeze({
    day: Object.freeze({ scope: "day", origin: "day", fixture: "day-ready", field: null }),
    item: Object.freeze({ scope: "item", origin: "item", fixture: "item-ready", field: null }),
    field: Object.freeze({ scope: "field", origin: "field", fixture: "field-ready", field: "summary" }),
    artwork: Object.freeze({ scope: "artwork", origin: "artwork", fixture: "artwork-ready", field: null }),
  });
  let canonicalEntryPanel = null;
  let canonicalPanelPlacementQueued = false;
  let canonicalPanelPlacementFailed = false;
  let entryReturnAnchor = null;
  let entryReturnEvidence = null;
  let entryReturnGeneration = 0;

  const EVENTS = Object.freeze({
    E01: event({ lane: "Source", time: "18 Aug 2026, 12:02 am IST", iso: "2026-08-18T00:02:00+05:30", heading: "Source Item captured", actor: "VoiceNotes upstream · simulated", states: ["Historical"], entityType: "Source Item", entity: "Monsoon walk note · Revision 1", recordType: "source", eventType: "source-items", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Monsoon walk note was represented as a local Voice Journal. Original Timestamp remains retained; no VoiceNotes operation is claimed.", binding: ["Revision 1"], record: "Revision 1" }),
    E02: event({ lane: "Derived", time: "18 Aug 2026, 12:15 am IST", iso: "2026-08-18T00:15:00+05:30", heading: "Generated field version created", actor: "Text generation lane · simulated", states: ["Historical"], entityType: "Derived Artifact · Summary", entity: "Summary version 1", recordType: "generated", eventType: "generated", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Summary version 1 was linked to its represented source set. The source remained unchanged.", binding: ["Revision 1"], record: "Summary version 1", provider: "Text Provider A — synthetic fixture" }),
    E03: event({ lane: "Derived", time: "18 Aug 2026, 12:18 am IST", iso: "2026-08-18T00:18:00+05:30", heading: "Generated Artwork version created", actor: "Artwork generation lane · simulated", states: ["Historical", "AI-generated artwork"], entityType: "Generated Artwork", entity: "Artwork version 1", recordType: "artwork", eventType: "artwork", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Artwork version 1 was represented as AI-generated artwork and linked to Revision 1. No real photo or provider execution is claimed.", binding: ["Revision 1"], record: "Artwork version 1", provider: "Artwork Provider A — synthetic fixture" }),
    E04: event({ lane: "Source", time: "18 Aug 2026, 8:15 am IST", iso: "2026-08-18T08:15:00+05:30", heading: "Source Revision received", actor: "VoiceNotes upstream · simulated", states: ["Historical", "Revised upstream"], entityType: "Source Revision", entity: "Revision 2", recordType: "source", eventType: "source-revisions", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "A newer VoiceNotes revision was represented. The prior Source Revision remains Historical. Nothing was overwritten.", binding: ["Revision 1", "Revision 2"], record: "Revision 2", attention: false, external: true }),
    E05: event({ lane: "Source", time: "18 Aug 2026, 8:24 am IST", iso: "2026-08-18T08:24:00+05:30", heading: "Correction created", actor: "Archive owner · simulated", states: ["Displayed Correction"], entityType: "Correction", entity: "Correction 1", recordType: "source", eventType: "corrections", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Correction 1 became displayed against Revision 2. Source Revisions remain unchanged.", binding: ["Revision 2", "Correction 1"], record: "Correction 1" }),
    E06: event({ lane: "Derived", time: "18 Aug 2026, 8:30 am IST", iso: "2026-08-18T08:30:00+05:30", heading: "Generated field version created", actor: "Text generation lane · simulated", states: ["Current", "Protected Field", "Stale"], entityType: "Derived Artifact · Summary", entity: "Summary version 2", recordType: "generated", eventType: "generated", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Summary version 2 was linked to Revision 2 and Correction 1. Source records remained unchanged.", binding: ["Revision 2", "Correction 1"], record: "Summary version 2", provider: "Text Provider A — synthetic fixture" }),
    E07: event({ lane: "Derived", time: "18 Aug 2026, 8:31 am IST", iso: "2026-08-18T08:31:00+05:30", heading: "Protected field version selected", actor: "Archive owner · simulated", states: ["Current", "Protected Field", "Stale"], entityType: "Derived Artifact · Summary", entity: "Summary version 2", recordType: "generated", eventType: "generated", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Summary version 2 became the displayed protected field; Summary version 1 remains Historical. This read-only fact exposes no selection action.", binding: ["Revision 2", "Correction 1"], record: "Summary version 2", attention: true }),
    E08: event({ lane: "Derived", time: "18 Aug 2026, 8:35 am IST", iso: "2026-08-18T08:35:00+05:30", heading: "Generated Artwork version created", actor: "Artwork generation lane · simulated", states: ["Historical", "Stale", "AI-generated artwork"], entityType: "Generated Artwork", entity: "Artwork version 2", recordType: "artwork", eventType: "artwork", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Artwork version 2 was represented as AI-generated artwork and linked to Revision 2 and Correction 1. No provider execution is claimed.", binding: ["Revision 2", "Correction 1"], record: "Artwork version 2", provider: "Artwork Provider A — synthetic fixture" }),
    E09: event({ lane: "Derived", time: "18 Aug 2026, 8:36 am IST", iso: "2026-08-18T08:36:00+05:30", heading: "Artwork version selected", actor: "Archive owner · simulated", states: ["Historical", "Stale", "AI-generated artwork"], eventTimeFact: "Active Artwork at this event", entityType: "Generated Artwork", entity: "Artwork version 2", recordType: "artwork", eventType: "artwork", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Artwork version 2 became Active Artwork at this event. After E10 it is retained as Historical and Stale; Artwork version 1 remains Historical.", binding: ["Revision 2", "Correction 1"], record: "Artwork version 2", attention: true }),
    E10: event({ lane: "Source", time: "19 Aug 2026, 10:00 am IST", iso: "2026-08-19T10:00:00+05:30", heading: "Journal Date changed", actor: "Archive owner · simulated", states: ["Current"], entityType: "Journal Day relationship", entity: "Monsoon walk note", recordType: "journal", eventType: "journal-date", journalDates: ["2026-08-18", "2026-08-17"], journalDateFact: "18 Aug 2026 → 17 Aug 2026", consequence: "The Source Item moved from 18 Aug to 17 Aug in the represented v17 result. Original Timestamp stayed unchanged; Artwork version 2 remains Historical and Stale.", binding: ["Revision 2", "Correction 1", "Artwork version 2"], record: "Monsoon walk note" }),
    E11: event({ lane: "Source", time: "19 Aug 2026, 9:12 am IST", iso: "2026-08-19T09:12:00+05:30", heading: "Source Revision received", actor: "VoiceNotes upstream · simulated", states: ["Current upstream", "Revised upstream"], entityType: "Source Revision", entity: "Revision 3", recordType: "source", eventType: "source-revisions", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Revision 3 became the current upstream revision. Earlier revisions and the displayed Correction remain retained.", binding: ["Revision 2", "Revision 3"], record: "Revision 3", external: true }),
    E12: event({ lane: "Source", time: "19 Aug 2026, 9:13 am IST", iso: "2026-08-19T09:13:00+05:30", heading: "Source conflict detected", actor: "Life in Days rule · simulated", states: ["Conflict", "Displayed Correction"], entityType: "Correction and Source Revision", entity: "Correction 1 versus Revision 3", recordType: "source", eventType: "corrections", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "Correction 1 remains displayed and Revision 3 remains retained. Nothing was merged automatically.", binding: ["Correction 1", "Revision 3"], record: "Correction 1", attention: true, external: true }),
    E13: event({ lane: "Source", time: "19 Aug 2026, 9:20 am IST", iso: "2026-08-19T09:20:00+05:30", heading: "Upstream status changed", actor: "VoiceNotes upstream · simulated", states: ["Untagged upstream", "Retained locally"], entityType: "Source Item lifecycle", entity: "Monsoon walk note", recordType: "source", eventType: "upstream", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "VoiceNotes no longer showed the required tag in this synthetic state. The local Voice Journal and every retained Source Revision remain in Life in Days.", binding: ["Revision 1", "Revision 2", "Revision 3", "Correction 1"], record: "Monsoon walk note", attention: true, external: true }),
    E14: event({ lane: "Source", time: "19 Aug 2026, 9:28 am IST", iso: "2026-08-19T09:28:00+05:30", heading: "Upstream status changed", actor: "VoiceNotes upstream · simulated", states: ["Deleted upstream", "Retained locally"], entityType: "Source Item lifecycle", entity: "Monsoon walk note", recordType: "source", eventType: "upstream", journalDates: ["2026-08-18"], journalDateFact: "18 Aug 2026", consequence: "VoiceNotes showed this note as deleted upstream in this synthetic state. The local Voice Journal and every retained Source Revision remain unchanged.", binding: ["Revision 1", "Revision 2", "Revision 3", "Correction 1"], record: "Monsoon walk note", attention: true, external: true }),
    E15: event({ lane: "Source", time: "11 Aug 2026, 7:10 pm IST", iso: "2026-08-11T19:10:00+05:30", heading: "Source Item captured", actor: "Archive owner · simulated", states: ["Historical"], entityType: "Source Item", entity: "Station light note", recordType: "source", eventType: "source-items", journalDates: ["2026-08-11"], journalDateFact: "11 Aug 2026", consequence: "Station light note was represented as an Uploaded Journal. Its historical Source record remains retained.", binding: ["Station light note · captured source"], record: "Station light note" }),
    E16: event({ lane: "Derived", time: "11 Aug 2026, 7:25 pm IST", iso: "2026-08-11T19:25:00+05:30", heading: "Generated Artwork version created", actor: "Artwork generation lane · simulated", states: ["Historical", "AI-generated artwork"], entityType: "Generated Artwork", entity: "Station light illustration", recordType: "artwork", eventType: "artwork", journalDates: ["2026-08-11"], journalDateFact: "11 Aug 2026", consequence: "Station light illustration remains Historical and linked to the captured source. Viewing does not activate it.", binding: ["Station light note · captured source"], record: "Station light illustration", provider: "Artwork Provider A — synthetic fixture" }),
    E17: event({ lane: "Source", time: "12 Aug 2026, 7:30 am IST", iso: "2026-08-12T07:30:00+05:30", heading: "Journal Date changed", actor: "Archive owner · simulated", states: ["Historical"], entityType: "Journal Day relationship", entity: "Station light note", recordType: "journal", eventType: "journal-date", journalDates: ["2026-08-11", "2026-08-10"], journalDateFact: "11 Aug 2026 → 10 Aug 2026", consequence: "Station light note moved to 10 Aug. The 11 Aug day became hidden while Source and Derived history remained retained.", binding: ["Station light note · captured source", "Station light illustration"], record: "Station light note" }),
  });

  function event(value) {
    return Object.freeze({ attention: false, external: false, provider: null, eventTimeFact: null, ...value });
  }

  const DEFAULT_FILTERS = Object.freeze({ lane: "all", recordType: "all", eventType: "all", attention: "all", journalDate: "" });

  const SCOPE_DEFINITIONS = Object.freeze({
    global: { h1: "History & provenance", lede: "Review represented changes across the archive. Source and Derived histories stay separate, and viewing never changes what is current." },
    day: { h1: "History for 17 August 2026", lede: "Read the current fictional source alongside separate Source and Derived history for this Journal Day." },
    item: { h1: "History for Monsoon walk note", lede: "Inspect retained Source Revisions, the displayed Correction, conflict, upstream lifecycle, and linked Derived Artifacts." },
    field: { h1: "Summary history", lede: "Compare read-only Summary versions and exact represented source bindings. Nothing here selects or edits a version." },
    artwork: { h1: "Artwork history", lede: "Inspect retained AI-generated artwork versions and their represented provenance without activating one." },
    hidden: { h1: "History for 11 August 2026", lede: "Inspect a historical Journal Day that has no live Source Items in the represented state." },
  });

  const CURRENT_SOURCE_STATES = Object.freeze({
    terminal: Object.freeze({
      revisionLineage: ["Revision 1", "Revision 2", "Revision 3"], displayedRecord: "Correction 1", correction: { label: "Correction 1", basedOn: "Revision 2", displayed: true }, currentUpstream: "Revision 3", upstreamState: ["Deleted upstream", "Retained locally"], conflict: "Correction 1 versus Revision 3 · Unresolved", sourceContextProse: SOURCE_CONTEXT_PROSE,
    }),
    "upstream-revised": Object.freeze({
      revisionLineage: ["Revision 1", "Revision 2"], displayedRecord: "Revision 2", correction: null, currentUpstream: "Revision 2", upstreamState: ["Revised upstream"], conflict: null, sourceContextProse: SOURCE_CONTEXT_PROSE_REVISION_2,
    }),
    "upstream-conflict": Object.freeze({
      revisionLineage: ["Revision 1", "Revision 2", "Revision 3"], displayedRecord: "Correction 1", correction: { label: "Correction 1", basedOn: "Revision 2", displayed: true }, currentUpstream: "Revision 3", upstreamState: ["Revised upstream", "Conflict represented"], conflict: "Correction 1 versus Revision 3 · Unresolved", sourceContextProse: SOURCE_CONTEXT_PROSE,
    }),
    "upstream-untagged": Object.freeze({
      revisionLineage: ["Revision 1", "Revision 2", "Revision 3"], displayedRecord: "Correction 1", correction: { label: "Correction 1", basedOn: "Revision 2", displayed: true }, currentUpstream: "Revision 3", upstreamState: ["Untagged upstream", "Retained locally"], conflict: "Correction 1 versus Revision 3 · Unresolved", sourceContextProse: SOURCE_CONTEXT_PROSE,
    }),
    "upstream-deleted": Object.freeze({
      revisionLineage: ["Revision 1", "Revision 2", "Revision 3"], displayedRecord: "Correction 1", correction: { label: "Correction 1", basedOn: "Revision 2", displayed: true }, currentUpstream: "Revision 3", upstreamState: ["Deleted upstream", "Retained locally"], conflict: "Correction 1 versus Revision 3 · Unresolved", sourceContextProse: SOURCE_CONTEXT_PROSE,
    }),
  });

  function representedCurrentSource(state) {
    return CURRENT_SOURCE_STATES[state.fixture] || CURRENT_SOURCE_STATES.terminal;
  }

  function sourceContextVariant(state) {
    if (!["day", "item"].includes(state.scope)) return "none";
    return state.fixture === "upstream-revised" ? "revision-2" : "correction-1";
  }

  const FIXTURE_CONFIG = Object.freeze({
    "global-ready": { scope: "global", source: SOURCE_ORDER, derived: DERIVED_ORDER, origin: "settings", back: "Back to Settings", branch: "ready" },
    "day-ready": { scope: "day", source: CURRENT_SOURCE_ORDER, derived: CURRENT_DERIVED_ORDER, origin: "day", back: "Back to Journal Day", branch: "ready" },
    "item-ready": { scope: "item", source: CURRENT_SOURCE_ORDER, derived: CURRENT_DERIVED_ORDER, origin: "item", back: "Back to Source Item", branch: "ready" },
    "field-ready": { scope: "field", source: [], derived: ["E07", "E06", "E02"], origin: "field", back: "Back to Summary", branch: "ready" },
    "artwork-ready": { scope: "artwork", source: [], derived: ["E09", "E08", "E03"], origin: "artwork", back: "Back to Generated Artwork", branch: "ready" },
    "hidden-day": { scope: "hidden", source: ["E17", "E15"], derived: ["E16"], origin: "history", back: "Back to History", branch: "ready" },
    "upstream-revised": { scope: "item", source: ["E04", "E01"], derived: [], origin: "item", back: "Back to Source Item", branch: "ready" },
    "upstream-conflict": { scope: "item", source: ["E12", "E11", "E05", "E04", "E01"], derived: [], origin: "item", back: "Back to Source Item", branch: "ready" },
    "upstream-untagged": { scope: "item", source: ["E13", "E12", "E11", "E05", "E04", "E01"], derived: [], origin: "item", back: "Back to Source Item", branch: "ready" },
    "upstream-deleted": { scope: "item", source: ["E14", "E13", "E12", "E11", "E05", "E04", "E01"], derived: [], origin: "item", back: "Back to Source Item", branch: "ready" },
    empty: { scope: "global", source: [], derived: [], origin: "settings", back: "Back to Settings", branch: "empty" },
    loading: { scope: "global", source: [], derived: [], origin: "settings", back: "Back to Settings", branch: "loading" },
    failure: { scope: "global", source: [], derived: [], origin: "settings", back: "Back to Settings", branch: "failure" },
    interrupted: { scope: "global", source: SOURCE_ORDER, derived: DERIVED_ORDER, origin: "settings", back: "Back to Settings", branch: "interrupted" },
  });

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[character]);
  }

  function freshPagination() {
    return {
      source: { stage: "complete", added: 0, duplicateIgnored: false, requestGeneration: 0, terminalGeneration: null },
      derived: { stage: "complete", added: 0, duplicateIgnored: false, requestGeneration: 0, terminalGeneration: null },
    };
  }

  function initialDisclosureKeys(fixture) {
    return fixture === "item-ready" ? ["E12"] : [];
  }

  function stateForFixture(fixture, theme = "light") {
    const selected = Object.hasOwn(FIXTURE_CONFIG, fixture) ? fixture : "global-ready";
    const config = FIXTURE_CONFIG[selected];
    clearPaginationAnchorState({ resetGeneration: true });
    const focusSelector = config.branch === "empty" ? "#lid-v18-empty-title"
      : config.branch === "failure" ? "#lid-v18-failure-title"
        : config.branch === "interrupted" ? "#lid-v18-interrupted-title"
        : `#lid-v18-title`;
    return {
      fixture: selected,
      transitionBranch: config.branch,
      scope: config.scope,
      fieldLabel: "Summary",
      canonicalContextToken: null,
      sourceKeys: [...config.source],
      derivedKeys: [...config.derived],
      theme,
      origin: config.origin,
      expectedBackLabel: config.back,
      focusSelector,
      stableFocusKey: focusSelector,
      draftFilters: { ...DEFAULT_FILTERS },
      appliedFilters: { ...DEFAULT_FILTERS },
      filterOpen: false,
      consoleOpen: false,
      openDisclosureKeys: initialDisclosureKeys(selected),
      disclosureDefaultIntact: true,
      initialPresentation: true,
      selectedRelationTarget: null,
      pagination: freshPagination(),
      metadataStress: false,
      statusUnavailable: false,
      internalReturn: null,
      returnScroll: { pending: null, lastRestored: null },
      announcement: config.branch === "failure"
        ? "History could not be loaded. Retry loading history."
        : config.branch === "interrupted" ? "Connection interrupted. Retry loading history." : "",
      announcementAssertive: ["failure", "interrupted"].includes(config.branch),
      mutationIntents: 0,
      mutationEffects: 0,
      providerRequests: 0,
      preOpenDomainFingerprint: AUTHORITY.domainFingerprint,
      currentDomainFingerprint: AUTHORITY.domainFingerprint,
    };
  }

  function baseState() {
    return stateForFixture("global-ready", "light");
  }

  function launchFixtureForScope(scope) {
    return ({ global: "global-ready", day: "day-ready", item: "item-ready", field: "field-ready", artwork: "artwork-ready", hidden: "hidden-day" })[scope] || "global-ready";
  }

  function recoveredScopeKeys(state) {
    if (state.sourceKeys.length || state.derivedKeys.length) {
      return { source: [...state.sourceKeys], derived: [...state.derivedKeys] };
    }
    const config = FIXTURE_CONFIG[launchFixtureForScope(state.scope)];
    return { source: [...config.source], derived: [...config.derived] };
  }

  function prepareOpen(state, launchContext) {
    const canonicalContextToken = Object.hasOwn(CANONICAL_ENTRY_MAP, launchContext?.canonicalContextToken)
      ? launchContext.canonicalContextToken
      : null;
    const canonicalEntry = canonicalContextToken ? CANONICAL_ENTRY_MAP[canonicalContextToken] : null;
    const scope = canonicalEntry?.scope || "global";
    const next = stateForFixture(launchFixtureForScope(scope), state.theme);
    const origins = {
      settings: ["settings", "Back to Settings"],
      more: ["more", "Back to More"],
      day: ["day", "Back to Journal Day"],
      item: ["item", "Back to Source Item"],
      field: ["field", "Back to Summary"],
      artwork: ["artwork", "Back to Generated Artwork"],
    };
    const [origin, back] = origins[launchContext?.origin] || origins.settings;
    next.origin = origin;
    next.canonicalContextToken = canonicalContextToken;
    if (scope === "field") {
      next.fieldLabel = "Summary";
      next.expectedBackLabel = "Back to Summary";
    } else next.expectedBackLabel = back;
    return next;
  }

  function validateLaunchContext(launchContext) {
    if (!launchContext || typeof launchContext !== "object") return false;
    if (["settings", "more"].includes(launchContext.origin)) {
      return launchContext.scope === "global"
        && !launchContext.canonicalContextToken
        && !launchContext.field;
    }
    const token = launchContext.canonicalContextToken;
    const entry = Object.hasOwn(CANONICAL_ENTRY_MAP, token) ? CANONICAL_ENTRY_MAP[token] : null;
    if (!entry || launchContext.scope !== entry.scope || launchContext.origin !== entry.origin) return false;
    return entry.field ? launchContext.field === entry.field : !launchContext.field;
  }

  function fixtureState(fixture, current) {
    if (!REQUIRED_FIXTURES.includes(fixture)) return null;
    return stateForFixture(fixture, current?.theme === "dark" ? "dark" : "light");
  }

  function baseLaneKeys(state, lane) {
    if (state.transitionBranch === "loading" || state.transitionBranch === "failure" || state.transitionBranch === "empty") return [];
    const configured = lane === "source" ? state.sourceKeys : state.derivedKeys;
    const page = state.pagination[lane];
    if (state.scope === "global" && ["ready", "pending", "failed", "interrupted"].includes(page.stage)) {
      return [...(lane === "source" ? SOURCE_FIRST_PAGE : DERIVED_FIRST_PAGE)];
    }
    return [...configured];
  }

  function eventMatches(eventRecord, filters) {
    if (filters.lane !== "all" && filters.lane !== eventRecord.lane.toLowerCase()) return false;
    if (filters.recordType !== "all" && filters.recordType !== eventRecord.recordType) return false;
    if (filters.eventType !== "all" && filters.eventType !== eventRecord.eventType) return false;
    if (filters.attention === "needs" && !eventRecord.attention) return false;
    if (filters.journalDate && !eventRecord.journalDates.includes(filters.journalDate)) return false;
    return true;
  }

  function visibleKeys(state, lane) {
    return baseLaneKeys(state, lane).filter((key) => eventMatches(EVENTS[key], state.appliedFilters));
  }

  function representedCount(state) {
    return visibleKeys(state, "source").length + visibleKeys(state, "derived").length;
  }

  function activeFilterCount(filters) {
    return Object.entries(filters).filter(([key, value]) => value !== DEFAULT_FILTERS[key]).length;
  }

  function setFocus(next, selector) {
    next.focusSelector = selector;
    next.stableFocusKey = selector;
    return next;
  }

  function normalizedLane(value) {
    return value === "source" || value === "derived" ? value : null;
  }

  function payloadGeneration(payload) {
    if (!payload || typeof payload !== "object") return null;
    const hasRequestGeneration = Object.hasOwn(payload, "requestGeneration");
    const hasGenerationAlias = Object.hasOwn(payload, "generation");
    if (!hasRequestGeneration && !hasGenerationAlias) return null;
    if (hasRequestGeneration && hasGenerationAlias && payload.requestGeneration !== payload.generation) return NaN;
    const generation = hasRequestGeneration ? payload.requestGeneration : payload.generation;
    return typeof generation === "number" && Number.isInteger(generation) && generation > 0 ? generation : NaN;
  }

  function reduce(state, action) {
    const next = copy(state);
    next.initialPresentation = false;
    next.announcement = "";
    next.announcementAssertive = false;

    if (action.type === "toggle-theme") {
      next.theme = state.theme === "light" ? "dark" : "light";
      return setFocus(next, "#lid-v18-theme");
    }
    if (action.type === "set-console-open") {
      next.consoleOpen = Boolean(action.payload?.value ?? action.payload?.open);
      return next;
    }
    if (action.type === "focus-fixture-control") {
      const fixture = String(action.payload?.fixture || "");
      if (!REQUIRED_FIXTURES.includes(fixture)) return next;
      next.consoleOpen = true;
      return setFocus(next, `[data-lid-fixture="${fixture}"]`);
    }
    if (action.type === "focus-console-control") {
      const consoleAction = String(action.payload?.action || "");
      if (!["metadata-stress"].includes(consoleAction)) return next;
      next.consoleOpen = true;
      return setFocus(next, `[data-lid-action="${consoleAction}"]`);
    }
    if (action.type === "reset") return stateForFixture("global-ready", state.theme);

    const draftActions = { "draft-lane": "lane", "draft-record-type": "recordType", "draft-event-type": "eventType", "draft-attention": "attention", "draft-journal-date": "journalDate" };
    if (draftActions[action.type]) {
      next.draftFilters[draftActions[action.type]] = String(action.payload?.value || "");
      return next;
    }
    if (action.type === "set-filter") {
      const name = String(action.payload?.name || "");
      if (Object.hasOwn(DEFAULT_FILTERS, name)) next.draftFilters[name] = String(action.payload?.value ?? DEFAULT_FILTERS[name]);
      return next;
    }
    if (action.type === "set-filter-open" || action.type === "open-filter" || action.type === "close-filter") {
      next.filterOpen = action.type === "open-filter" ? true : action.type === "close-filter" ? false : Boolean(action.payload?.value ?? action.payload?.open);
      next.transitionBranch = next.filterOpen && activeFilterCount(next.appliedFilters) ? "filter-open-applied" : next.transitionBranch;
      return next;
    }
    if (action.type === "apply-filters") {
      next.appliedFilters = { ...next.draftFilters };
      if (next.scope !== "global") next.appliedFilters.journalDate = "";
      next.filterOpen = false;
      next.transitionBranch = "filtered";
      next.announcement = `${representedCount(next)} represented events`;
      return setFocus(next, "#lid-v18-results-title");
    }
    if (action.type === "clear-filters") {
      next.draftFilters = { ...DEFAULT_FILTERS };
      next.appliedFilters = { ...DEFAULT_FILTERS };
      next.filterOpen = false;
      next.transitionBranch = "ready";
      next.announcement = `${representedCount(next)} represented events`;
      return setFocus(next, "#lid-v18-results-title");
    }
    if (action.type === "set-disclosure" || action.type === "toggle-disclosure") {
      const key = String(action.payload?.key || action.payload?.value || "");
      if (!Object.hasOwn(EVENTS, key)) return next;
      const isOpen = action.type === "toggle-disclosure" ? !next.openDisclosureKeys.includes(key) : Boolean(action.payload?.open ?? action.payload?.value);
      next.openDisclosureKeys = isOpen
        ? [...new Set([...next.openDisclosureKeys, key])]
        : next.openDisclosureKeys.filter((item) => item !== key);
      next.disclosureDefaultIntact = false;
      return setFocus(next, `#lid-v18-provenance-${key}`);
    }
    if (action.type === "focus-relation") {
      const key = String(action.payload?.key || action.payload?.target || action.payload?.value || "");
      if (!Object.hasOwn(EVENTS, key)) return next;
      next.selectedRelationTarget = key;
      return setFocus(next, `#lid-v18-event-${key}`);
    }
    if (action.type === "open-hidden-day") {
      next.internalReturn = {
        fixture: state.fixture,
        scope: state.scope,
        sourceKeys: [...state.sourceKeys],
        derivedKeys: [...state.derivedKeys],
        transitionBranch: state.transitionBranch,
        draftFilters: { ...state.draftFilters },
        appliedFilters: { ...state.appliedFilters },
        filterOpen: state.filterOpen,
        openDisclosureKeys: [...state.openDisclosureKeys],
        disclosureDefaultIntact: state.disclosureDefaultIntact,
        selectedRelationTarget: state.selectedRelationTarget,
        pagination: copy(state.pagination),
        origin: state.origin,
        expectedBackLabel: state.expectedBackLabel,
        scrollY: Number(action.payload?.scrollY) || 0,
        focusSelector: "#lid-v18-open-hidden-E17",
      };
      next.scope = "hidden";
      next.sourceKeys = ["E17", "E15"];
      next.derivedKeys = ["E16"];
      next.transitionBranch = "hidden-day-navigation";
      next.origin = "history";
      next.expectedBackLabel = "Back to History";
      next.draftFilters = { ...DEFAULT_FILTERS };
      next.appliedFilters = { ...DEFAULT_FILTERS };
      next.filterOpen = false;
      next.openDisclosureKeys = [];
      next.disclosureDefaultIntact = false;
      next.pagination = freshPagination();
      clearPaginationAnchorState();
      return setFocus(next, "#lid-v18-title");
    }
    if (action.type === "back-history" && state.internalReturn) {
      const retained = state.internalReturn;
      next.fixture = retained.fixture;
      next.scope = retained.scope;
      next.sourceKeys = [...retained.sourceKeys];
      next.derivedKeys = [...retained.derivedKeys];
      next.transitionBranch = retained.transitionBranch;
      next.draftFilters = { ...retained.draftFilters };
      next.appliedFilters = { ...retained.appliedFilters };
      next.filterOpen = retained.filterOpen;
      next.openDisclosureKeys = [...retained.openDisclosureKeys];
      next.disclosureDefaultIntact = retained.disclosureDefaultIntact;
      next.selectedRelationTarget = retained.selectedRelationTarget;
      next.pagination = copy(retained.pagination);
      next.origin = retained.origin;
      next.expectedBackLabel = retained.expectedBackLabel;
      next.returnScroll.pending = retained.scrollY;
      next.internalReturn = null;
      return setFocus(next, retained.focusSelector);
    }
    if (action.type === "consume-return-scroll") {
      next.returnScroll.lastRestored = Number.isFinite(state.returnScroll.pending) ? state.returnScroll.pending : null;
      next.returnScroll.pending = null;
      return next;
    }
    if (action.type === "status-unavailable") {
      next.statusUnavailable = true;
      next.transitionBranch = "status-unavailable";
      return setFocus(next, "#lid-v18-status-unavailable-title");
    }
    if (action.type === "retry-status") {
      next.statusUnavailable = false;
      next.transitionBranch = "ready";
      next.announcement = "Represented upstream status restored.";
      return setFocus(next, "#lid-v18-results-title");
    }
    if (["enter-pagination", "start-pagination", "start-pagination-demo"].includes(action.type)) {
      if (next.scope !== "global") return next;
      clearPaginationAnchorState({ resetGeneration: true });
      next.pagination = {
        source: { stage: "ready", added: 0, duplicateIgnored: false, requestGeneration: 0, terminalGeneration: null },
        derived: { stage: "ready", added: 0, duplicateIgnored: false, requestGeneration: 0, terminalGeneration: null },
      };
      next.transitionBranch = "pagination-ready";
      return setFocus(next, "#lid-v18-load-source");
    }

    const laneAction = action.type === "load-source" ? ["source", "pending"]
      : action.type === "load-derived" ? ["derived", "pending"]
        : action.type === "retry-source" ? ["source", "pending"]
          : action.type === "retry-derived" ? ["derived", "pending"]
            : action.type === "deliver-source-success" ? ["source", "success"]
              : action.type === "deliver-derived-success" ? ["derived", "success"]
                : action.type === "deliver-source-failure" ? ["source", "failure"]
                  : action.type === "deliver-derived-failure" ? ["derived", "failure"]
                    : action.type === "deliver-source-interruption" ? ["source", "interruption"]
                      : action.type === "deliver-derived-interruption" ? ["derived", "interruption"]
                        : action.type === "duplicate-source" ? ["source", "duplicate"]
                          : action.type === "duplicate-derived" ? ["derived", "duplicate"]
                            : null;
    const qaPaginationAction = ["load-earlier", "pagination-pending", "pagination-failure", "pagination-interrupted", "pagination-retry", "pagination-success", "pagination-duplicate", "settle-pagination"].includes(action.type);
    if (laneAction || qaPaginationAction) {
      const lane = laneAction?.[0] || normalizedLane(action.payload?.lane);
      let outcome = laneAction?.[1];
      if (!outcome) {
        outcome = action.type === "load-earlier" || action.type === "pagination-pending" || action.type === "pagination-retry" ? "pending"
          : action.type === "pagination-failure" ? "failure"
            : action.type === "pagination-interrupted" ? "interruption"
              : action.type === "pagination-success" ? "success"
                : action.type === "pagination-duplicate" ? "duplicate"
                  : String(action.payload?.outcome || "");
      }
      if (!lane || next.scope !== "global" || !["pending", "failure", "interruption", "interrupted", "success", "duplicate"].includes(outcome)) return null;
      if (outcome === "interrupted") outcome = "interruption";
      const page = next.pagination[lane];
      const suppliedGeneration = payloadGeneration(action.payload);
      if (Number.isNaN(suppliedGeneration)) return null;
      const isRetryRequest = action.type === `retry-${lane}` || action.type === "pagination-retry";
      const isGenericInitialRequest = action.type === "load-earlier" || action.type === "pagination-pending";
      const terminalOutcome = outcome !== "pending";
      if (terminalOutcome && (!Number.isInteger(suppliedGeneration) || normalizedLane(action.payload?.lane) !== lane)) return null;

      if (outcome === "pending") {
        const validStage = isRetryRequest
          ? ["failed", "interrupted"].includes(page.stage)
          : page.stage === "ready" || (isGenericInitialRequest && page.stage === "complete");
        const requestGeneration = paginationRequestSerial[lane] + 1;
        if (!validStage || (suppliedGeneration !== null && suppliedGeneration !== requestGeneration)) {
          return null;
        }
        paginationRequestSerial[lane] = requestGeneration;
        page.stage = "pending";
        page.requestGeneration = requestGeneration;
        page.terminalGeneration = null;
        if (isGenericInitialRequest && state.pagination[lane].stage === "complete") {
          page.added = 0;
          page.duplicateIgnored = false;
        }
        if (isRetryRequest) next.announcement = `Retrying earlier ${lane === "source" ? "Source" : "Derived"} events.`;
        next.transitionBranch = `${lane}-pagination-pending`;
        return setFocus(next, `#lid-v18-load-${lane}`);
      }

      if (outcome === "duplicate") {
        if (page.stage !== "complete-delivered") return null;
        const requestGeneration = paginationRequestSerial[lane] + 1;
        if (suppliedGeneration !== requestGeneration) return null;
        paginationRequestSerial[lane] = requestGeneration;
        page.requestGeneration = requestGeneration;
      } else if (page.stage !== "pending" || suppliedGeneration !== page.requestGeneration) {
        return null;
      }

      page.terminalGeneration = page.requestGeneration;
      if (outcome === "failure") {
        page.stage = "failed";
        next.announcement = `Earlier ${lane === "source" ? "Source" : "Derived"} events could not be loaded. Retry loading earlier ${lane === "source" ? "Source" : "Derived"} events.`;
        next.announcementAssertive = true;
      }
      if (outcome === "interruption") {
        page.stage = "interrupted";
        next.announcement = `Connection interrupted. Retry loading earlier ${lane === "source" ? "Source" : "Derived"} events.`;
        next.announcementAssertive = true;
      }
      if (outcome === "success") {
        if (!page.added) {
          page.added = 3;
          next.announcement = `3 earlier ${lane === "source" ? "Source" : "Derived"} events added`;
        }
        page.stage = "complete-delivered";
      }
      if (outcome === "duplicate") {
        page.duplicateIgnored = true;
        page.stage = "complete-duplicate";
      }
      next.transitionBranch = `${lane}-pagination-${outcome}`;
      return setFocus(next, `#lid-v18-load-${lane}`);
    }
    if (action.type === "retry-history") {
      const recovered = recoveredScopeKeys(state);
      next.transitionBranch = "retry-ready";
      next.sourceKeys = recovered.source;
      next.derivedKeys = recovered.derived;
      next.announcement = `${representedCount(next)} represented events`;
      return setFocus(next, "#lid-v18-results-title");
    }
    if (action.type === "retry-interrupted") {
      next.transitionBranch = "ready";
      next.announcement = `${representedCount(next)} represented events`;
      return setFocus(next, "#lid-v18-results-title");
    }
    if (action.type === "set-initial-state" || action.type === "scope-empty") {
      const value = action.type === "scope-empty" ? "empty" : String(action.payload?.value || action.payload?.state || "ready");
      if (["loading", "failure", "interrupted", "empty", "ready"].includes(value)) next.transitionBranch = value;
      if (value === "failure") {
        next.announcement = "History could not be loaded. Retry loading history.";
        next.announcementAssertive = true;
      } else if (value === "interrupted") {
        next.announcement = "Connection interrupted. Retry loading history.";
        next.announcementAssertive = true;
      }
      return setFocus(next, value === "failure" ? "#lid-v18-failure-title" : value === "empty" ? "#lid-v18-empty-title" : "#lid-v18-title");
    }
    if (action.type === "metadata-stress" || action.type === "set-metadata-stress") {
      next.metadataStress = action.type === "metadata-stress" || action.payload?.value === "" ? true : Boolean(action.payload?.value ?? true);
      next.transitionBranch = next.metadataStress ? "long-safe-metadata" : "ready";
      return next;
    }
    if (action.type === "settle") {
      const outcome = String(action.payload?.outcome || "success");
      if (state.transitionBranch === "loading" && outcome === "success") {
        const recovered = recoveredScopeKeys(state);
        next.transitionBranch = "ready";
        next.sourceKeys = recovered.source;
        next.derivedKeys = recovered.derived;
        next.announcement = `${representedCount(next)} represented events`;
      } else if (state.transitionBranch === "failure" && outcome === "success") {
        const recovered = recoveredScopeKeys(state);
        next.transitionBranch = "retry-ready";
        next.sourceKeys = recovered.source;
        next.derivedKeys = recovered.derived;
        next.announcement = `${representedCount(next)} represented events`;
      }
      return next;
    }
    return next;
  }

  function scopeSummary(state) {
    const sourceCount = baseLaneKeys(state, "source").length;
    const derivedCount = baseLaneKeys(state, "derived").length;
    const currentSource = representedCurrentSource(state);
    const definitions = state.scope === "global" ? [
      ["Scope", "Entire represented archive"], ["Order", "Newest represented event first"], ["Timezone", AUTHORITY.timezone], ...(state.transitionBranch === "loading" ? [] : [["Lane counts", `${sourceCount} Source · ${derivedCount} Derived`]]),
    ] : state.scope === "day" ? [
      ["Journal Date", "17 Aug 2026"], ["Current source context", "Correction 1 · Displayed"], ["Latest event-time Journal Date", "18 Aug 2026 → 17 Aug 2026"], ["Ordinary visibility", "Visible"], ["Live Source Items", "1"], ["Calendar Cover", "Real Daily Photo · unchanged"], ["Scope", "This Journal Day"], ["Lane counts", `${sourceCount} Source · ${derivedCount} Derived`],
    ] : state.scope === "item" ? [
      ["Source type", "Voice Journal"], ["Source Item", AUTHORITY.sourceLabel], ["Original Timestamp", `${AUTHORITY.originalTimestamp} · Immutable`], ["Current Journal Date", AUTHORITY.currentDate], ["Displayed record", currentSource.displayedRecord], ["Current upstream", `${currentSource.currentUpstream} · ${currentSource.upstreamState.join(" · ")}`], ...(currentSource.conflict ? [["Conflict", currentSource.conflict]] : []),
    ] : state.scope === "field" ? [
      ["Journal Date", AUTHORITY.currentDate], ["Field", state.fieldLabel], ["Entity type", `Derived Artifact · ${state.fieldLabel}`], ["Current version", `${state.fieldLabel} version 2`], ["State", "Current · Protected Field · Stale"], ["Source binding", "Revision 2 · Correction 1"],
    ] : state.scope === "artwork" ? [
      ["Journal Date", AUTHORITY.currentDate], ["Entity type", "Generated Artwork"], ["Current fact", "Artwork version 2 · Historical · Stale"], ["Label", "AI-generated artwork"], ["Visual Brief", "Brief version 2 · synthetic fixture"], ["Source binding", "Revision 2 · Correction 1"], ["Calendar Cover effect", "Not active after redating"],
    ] : [
      ["Journal Date", "11 Aug 2026"], ["Ordinary visibility", "Hidden"], ["Live Source Items", "0"], ["Current synthetic location", "10 Aug 2026"], ["Source lane", "2 retained events"], ["Derived lane", "1 retained event"],
    ];
    return `<section class="lid-scope-summary-v18" aria-labelledby="lid-v18-scope-title"><div><p class="lid-eyebrow-v18">Current history scope</p><h2 id="lid-v18-scope-title">What this view represents</h2></div><dl>${definitions.map(([term, value]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl></section>`;
  }

  function sourceContext(state) {
    const variant = sourceContextVariant(state);
    if (variant === "none") return "";
    const currentSource = representedCurrentSource(state);
    const prose = variant === "revision-2" ? SOURCE_CONTEXT_PROSE_REVISION_2 : SOURCE_CONTEXT_PROSE;
    return `<section class="lid-source-context-v18" aria-labelledby="lid-v18-source-context-title"><p class="lid-eyebrow-v18">Authentic content stays available</p><h2 id="lid-v18-source-context-title">Current source context</h2><p><strong>${escapeHtml(prose)}</strong></p><dl><div><dt>Displayed</dt><dd>${escapeHtml(currentSource.displayedRecord)}</dd></div><div><dt>Current upstream</dt><dd>${escapeHtml(currentSource.currentUpstream)}</dd></div><div><dt>Represented state</dt><dd>${escapeHtml(currentSource.upstreamState.join(" · "))}</dd></div>${currentSource.conflict ? `<div><dt>Conflict</dt><dd>${escapeHtml(currentSource.conflict)}</dd></div>` : ""}</dl></section>`;
  }

  function displayRecord(state, key) {
    const record = EVENTS[key];
    if (state.fixture === "upstream-revised" && key === "E04") {
      return { ...record, states: ["Displayed", "Current upstream", "Revised upstream"] };
    }
    if (state.scope !== "field" || !["E02", "E06", "E07"].includes(key)) return record;
    const field = state.fieldLabel;
    const version = key === "E02" ? 1 : 2;
    const consequence = key === "E02"
      ? `${field} version 1 was linked to its represented source set. The source remained unchanged.`
      : key === "E06"
        ? `${field} version 2 was linked to Revision 2 and Correction 1. Source records remained unchanged.`
        : `${field} version 2 became the displayed protected field; ${field} version 1 remains Historical. This read-only fact exposes no selection action.`;
    return { ...record, entityType: `Derived Artifact · ${field}`, entity: `${field} version ${version}`, record: `${field} version ${version}`, consequence };
  }

  const FILTER_LABELS = Object.freeze({
    lane: { all: "All lanes", source: "Source history", derived: "Derived history" },
    recordType: { all: "All record types", journal: "Journal Days", source: "Source records", generated: "Generated fields", artwork: "Artwork" },
    eventType: { all: "All event types", "source-items": "Source Items", "source-revisions": "Source Revisions", corrections: "Corrections and conflicts", "journal-date": "Journal Date changes", upstream: "Upstream lifecycle", generated: "Generated fields", artwork: "Artwork" },
    attention: { all: "All attention", needs: "Needs attention" },
  });

  function filterSummary(state) {
    const filters = state.appliedFilters;
    const pieces = [
      state.transitionBranch === "loading" ? "History results loading" : `${representedCount(state)} represented events`,
      FILTER_LABELS.lane[filters.lane] || "All lanes",
      FILTER_LABELS.recordType[filters.recordType] || "All record types",
      FILTER_LABELS.eventType[filters.eventType] || "All event types",
      FILTER_LABELS.attention[filters.attention] || "All attention",
    ];
    if (filters.journalDate) pieces.push(filters.journalDate);
    return pieces.join(" · ");
  }

  function selectOptions(options, selected) {
    return Object.entries(options).map(([value, label]) => `<option value="${escapeHtml(value)}" ${selected === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("");
  }

  function filterFields(state) {
    const id = (name) => `lid-v18-filter-${name}`;
    return `<div class="lid-filter-fields-v18">
      <label for="${id("lane")}"><span>History lane</span><select id="${id("lane")}" data-lid-action="draft-lane" data-lid-filter-name="lane">${selectOptions(FILTER_LABELS.lane, state.draftFilters.lane)}</select></label>
      <label for="${id("record-type")}"><span>Record type</span><select id="${id("record-type")}" data-lid-action="draft-record-type" data-lid-filter-name="record-type">${selectOptions(FILTER_LABELS.recordType, state.draftFilters.recordType)}</select></label>
      <label for="${id("event-type")}"><span>Event type</span><select id="${id("event-type")}" data-lid-action="draft-event-type" data-lid-filter-name="event-type">${selectOptions(FILTER_LABELS.eventType, state.draftFilters.eventType)}</select></label>
      <label for="${id("attention")}"><span>Attention</span><select id="${id("attention")}" data-lid-action="draft-attention" data-lid-filter-name="attention">${selectOptions(FILTER_LABELS.attention, state.draftFilters.attention)}</select></label>
      ${state.scope === "global" ? `<label for="${id("journal-date")}"><span>Journal Date</span><input id="${id("journal-date")}" type="date" data-lid-action="draft-journal-date" data-lid-filter-name="journal-date" value="${escapeHtml(state.draftFilters.journalDate)}" /></label>` : ""}
    </div><div class="lid-filter-actions-v18"><button id="${id("apply")}" class="lid-primary-v18" type="button" data-lid-action="apply-filters" data-lid-filter-name="apply">Apply filters</button><button id="${id("clear")}" type="button" data-lid-action="clear-filters" data-lid-filter-name="clear" ${activeFilterCount(state.appliedFilters) ? "" : "disabled"}>Clear filters</button></div>`;
  }

  function filters(state) {
    const active = activeFilterCount(state.appliedFilters);
    const summary = `<div class="lid-filter-summary-v18"><div><p class="lid-eyebrow-v18">Current results</p><strong>${escapeHtml(filterSummary(state))}</strong></div><button type="button" data-lid-action="clear-filters" ${active ? "" : "disabled"}>Clear filters</button></div>`;
    const panelOpen = state.filterOpen || window.matchMedia("(min-width: 1024px)").matches;
    const panel = `<details class="lid-filter-details-v18" data-lid-v18-filter-details ${panelOpen ? "open" : ""}><summary data-lid-focus-key="filter-summary">Filter history${active ? ` · ${active} active` : ""}</summary><div class="lid-filter-wide-heading-v18"><p class="lid-eyebrow-v18">Refine the represented list</p><h2 id="lid-v18-filter-title" tabindex="-1">Filter history</h2></div><form onsubmit="return false">${filterFields(state)}</form></details>`;
    return `${summary}${panel}`;
  }

  function stateNotice(state) {
    if (state.statusUnavailable) {
      return `<section class="lid-state-panel-v18 is-warning" aria-labelledby="lid-v18-status-unavailable-title"><p class="lid-eyebrow-v18">Incomplete upstream evidence</p><h2 id="lid-v18-status-unavailable-title" tabindex="-1">Upstream status unavailable</h2><p>This prototype does not have a complete upstream result. No upstream-status event was added, and the local Voice Journal remains unchanged.</p><strong>Synthetic UI fixture · external evidence required</strong><button id="lid-v18-status-check-control" type="button" data-lid-action="retry-status">Retry represented status check</button></section>`;
    }
    if (state.transitionBranch === "failure") {
      return `<section class="lid-state-panel-v18 is-error" aria-labelledby="lid-v18-failure-title"><p class="lid-eyebrow-v18">Known-zero represented result</p><h2 id="lid-v18-failure-title" tabindex="-1">History could not be loaded</h2><p>The current archive view is unchanged. Try again.</p><button class="lid-primary-v18" type="button" data-lid-action="retry-history">Retry loading history</button></section>`;
    }
    if (state.transitionBranch === "interrupted") {
      return `<section class="lid-state-panel-v18 is-warning" aria-labelledby="lid-v18-interrupted-title"><p class="lid-eyebrow-v18">Freshness unknown</p><h2 id="lid-v18-interrupted-title" tabindex="-1">Connection interrupted</h2><p>The history already shown remains readable and may be out of date. Earlier events were not added.</p><button type="button" data-lid-action="retry-interrupted">Retry loading history</button></section>`;
    }
    return "";
  }

  function sequenceRelationship(state, key, direction) {
    const record = displayRecord(state, key);
    const lane = record.lane.toLowerCase();
    const complete = lane === "source" ? state.sourceKeys : state.derivedKeys;
    const index = complete.indexOf(key);
    const targetIndex = direction === "later" ? index - 1 : index + 1;
    const label = direction === "later" ? "Later represented event" : "Earlier represented event";
    if (targetIndex < 0 || targetIndex >= complete.length) return `<div><dt>${label}</dt><dd>No ${direction} ${record.lane} event</dd></div>`;
    const targetKey = complete[targetIndex];
    const target = displayRecord(state, targetKey);
    const isVisible = visibleKeys(state, lane).includes(targetKey);
    return `<div><dt>${label}</dt><dd>${isVisible ? `<a href="#lid-v18-event-${targetKey}" data-lid-v18-action="focus-relation" data-lid-v18-target="${targetKey}">${escapeHtml(target.heading)} · ${escapeHtml(target.entity)}</a>` : `${escapeHtml(target.heading)} · ${escapeHtml(target.entity)} · hidden by current view`}</dd></div>`;
  }

  function recordLineage(state, record) {
    const field = state.scope === "field" ? state.fieldLabel : "Summary";
    if (record.record === "Revision 1") return [["Earlier revision", "No earlier revision", null], ["Later revision", "Revision 2", "E04"]];
    if (record.record === "Revision 2") return state.fixture === "upstream-revised"
      ? [["Earlier revision", "Revision 1", "E01"], ["Later revision", "No later revision in this scope", null]]
      : [["Earlier revision", "Revision 1", "E01"], ["Later revision", "Revision 3", "E11"]];
    if (record.record === "Revision 3") return [["Earlier revision", "Revision 2", "E04"], ["Later revision", "No later revision", null]];
    if (record.record === "Correction 1") return [[...CORRECTION_BASE_FACT, "E04"], ["Conflict with", "Revision 3", "E11"], ["Correction lineage", "No earlier Correction · No later Correction", null]];
    if (record.record === `${field} version 1`) return [["Earlier version", "No earlier version", null], ["Later version", `${field} version 2`, "E06"]];
    if (record.record === `${field} version 2`) return [["Earlier version", `${field} version 1`, "E02"], ["Later version", "No later version", null]];
    if (record.record === "Artwork version 1") return [["Earlier version", "No earlier version", null], ["Later version", "Artwork version 2", "E08"]];
    if (record.record === "Artwork version 2") return [["Earlier version", "Artwork version 1", "E03"], ["Later version", "No later version", null]];
    return [["Earlier version", "No earlier version", null], ["Later version", "No later version", null]];
  }

  function recordLineageFact(state, term, value, targetKey) {
    if (!targetKey) return `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd></div>`;
    const lane = EVENTS[targetKey].lane.toLowerCase();
    const scoped = (lane === "source" ? state.sourceKeys : state.derivedKeys).includes(targetKey);
    const visible = visibleKeys(state, lane).includes(targetKey);
    const relation = !scoped
      ? `No represented ${term.toLowerCase()} in this scope`
      : visible
      ? `<a href="#lid-v18-event-${targetKey}" data-lid-v18-action="focus-relation" data-lid-v18-relation="record" data-lid-v18-target="${targetKey}" aria-label="Focus ${escapeHtml(value)} record facts">${escapeHtml(value)}</a>`
      : `${escapeHtml(value)} · hidden by current filter`;
    return `<div><dt>${escapeHtml(term)}</dt><dd>${relation}</dd></div>`;
  }

  function provenance(state, key) {
    const record = displayRecord(state, key);
    const nonEffect = state.fixture === "upstream-revised"
      ? "Inspection changes no represented Source Item, Source Revision, upstream, Journal Date, or visibility fact."
      : "Inspection changes no current, displayed, historical, protected, stale, conflict, upstream, Journal Date, or visibility fact.";
    const derivedFacts = record.lane === "Derived" ? `
      <div><dt>Trigger class</dt><dd>${record.actor === "Archive owner · simulated" ? "Deliberate owner selection · represented" : "Synthetic generation lane"}</dd></div>
      <div><dt>Provider</dt><dd>${escapeHtml(record.provider || (record.recordType === "artwork" ? "Artwork Provider A — synthetic fixture" : "Text Provider A — synthetic fixture"))}</dd></div>
      <div><dt>Configuration</dt><dd>Fixture configuration A</dd></div>
      <div><dt>Cost</dt><dd>Synthetic cost · fixture only</dd></div>
      <div><dt>Outcome</dt><dd>Represented record only · no provider execution claim</dd></div>` : "";
    return `<dl class="lid-provenance-v18">
      <div><dt>Event type</dt><dd>${escapeHtml(record.heading)}</dd></div>
      <div><dt>Entity type</dt><dd>${escapeHtml(record.entityType)}</dd></div>
      <div><dt>Record</dt><dd>${escapeHtml(record.entity)}</dd></div>
      <div><dt>Actor</dt><dd>${escapeHtml(record.actor)}</dd></div>
      <div><dt>Journal Date at this event</dt><dd>${escapeHtml(record.journalDateFact)}</dd></div>
      ${(record.recordType === "source" || record.recordType === "journal") && !["E15", "E17"].includes(key) ? `<div><dt>Original Timestamp</dt><dd>${escapeHtml(AUTHORITY.originalTimestamp)} · Immutable</dd></div>` : ""}
      <div><dt>Exact represented binding</dt><dd>${escapeHtml(`[${record.binding.join(", ")}]`)}</dd></div>
      ${derivedFacts}
    </dl><section class="lid-relations-v18" aria-label="Event sequence and record lineage"><h4>Event sequence</h4><dl>${sequenceRelationship(state, key, "later")}${sequenceRelationship(state, key, "earlier")}</dl><h4>Record lineage</h4><dl>${recordLineage(state, record).map(([term, value, targetKey]) => recordLineageFact(state, term, value, targetKey)).join("")}</dl></section><p class="lid-non-effect-v18"><strong>Non-effect:</strong> ${escapeHtml(nonEffect)}</p>`;
  }

  function eventCard(state, key) {
    const record = displayRecord(state, key);
    const states = record.eventTimeFact ? [...record.states, record.eventTimeFact] : record.states;
    const revisedRetention = state.fixture === "upstream-revised" && key === "E04"
      ? '<p class="lid-journal-date-v18"><strong>Retained Source Revisions</strong> · Revision 1 · Revision 2</p>'
      : "";
    const stress = state.metadataStress && key === visibleKeys(state, record.lane.toLowerCase())[0]
      ? `<p class="lid-stress-v18">FictionalWrappingTokenWithoutPrivateMeaning_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 · deliberately long translated-like helper metadata for responsive wrapping review only.</p>` : "";
    const hiddenDayLink = key === "E17" && state.scope === "global" ? `<nav aria-label="Historical Journal Day"><a id="lid-v18-open-hidden-E17" href="#lid-v18-title" data-lid-v18-action="open-hidden-day">Open historical day</a></nav>` : "";
    return `<li><article class="lid-event-card-v18 is-${record.lane.toLowerCase()}" aria-labelledby="lid-v18-event-lane-${key} lid-v18-event-${key}" data-lid-v18-event="${key}">
      <header><div><span id="lid-v18-event-lane-${key}" class="lid-lane-word-v18">${record.lane} history</span><h3 id="lid-v18-event-${key}" tabindex="-1">${escapeHtml(record.heading)}</h3><p class="lid-entity-v18">${escapeHtml(record.entityType)} · ${escapeHtml(record.entity)}</p></div><div class="lid-event-facts-v18"><span>Synthetic time</span><time datetime="${escapeHtml(record.iso)}">${escapeHtml(record.time)}</time></div></header>
      <div class="lid-state-list-v18" aria-label="Current represented facts">${states.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}</div>
      ${revisedRetention}
      <p class="lid-journal-date-v18"><strong>Journal Date at this event</strong> · ${escapeHtml(record.journalDateFact)}</p>
      <p class="lid-consequence-v18">${escapeHtml(record.consequence)}</p>
      <p class="lid-actor-v18"><strong>Actor</strong> · ${escapeHtml(record.actor)}</p>
      ${record.external ? '<p class="lid-external-v18">Synthetic UI fixture · external evidence required</p>' : ""}
      ${stress}${hiddenDayLink}
      <details class="lid-event-details-v18" data-lid-v18-event-details="${key}" ${state.openDisclosureKeys.includes(key) ? "open" : ""}><summary id="lid-v18-provenance-${key}">View complete provenance</summary>${provenance(state, key)}</details>
    </article></li>`;
  }

  function paginationControl(state, lane) {
    const page = state.pagination[lane];
    const label = lane === "source" ? "Source" : "Derived";
    const id = `lid-v18-load-${lane}`;
    if (page.stage === "ready") return `<button id="${id}" class="lid-load-v18" type="button" data-lid-action="load-${lane}">Load earlier ${label} events</button>`;
    if (page.stage === "pending") return `<div id="${id}" class="lid-pagination-state-v18" tabindex="-1"><button class="lid-load-v18" type="button" disabled aria-describedby="${id}-status">Loading earlier ${label} events…</button><p id="${id}-status" class="lid-pagination-helper-v18">The existing events remain readable. Only this represented lane load is disabled.</p><div class="lid-outcome-controls-v18" role="group" aria-label="Prototype-only ${label} page outcome"><span>Prototype-only delivery</span><button type="button" data-lid-action="deliver-${lane}-success" data-lid-request-generation="${page.requestGeneration}">Deliver 3 earlier events</button><button type="button" data-lid-action="deliver-${lane}-failure" data-lid-request-generation="${page.requestGeneration}">Deliver known failure</button><button type="button" data-lid-action="deliver-${lane}-interruption" data-lid-request-generation="${page.requestGeneration}">Deliver interruption</button></div></div>`;
    if (page.stage === "failed") return `<section class="lid-page-error-v18" aria-labelledby="${id}-error"><h3 id="${id}-error">Earlier events could not be loaded</h3><p>The events already shown remain available.</p><button id="${id}" type="button" data-lid-action="retry-${lane}">Retry loading earlier ${label} events</button></section>`;
    if (page.stage === "interrupted") return `<section class="lid-page-error-v18 is-warning" aria-labelledby="${id}-interrupted"><h3 id="${id}-interrupted">Connection interrupted</h3><p>The history already shown remains readable and may be out of date. Earlier events were not added.</p><button id="${id}" type="button" data-lid-action="retry-${lane}">Retry loading earlier ${label} events</button></section>`;
    const duplicate = ["complete-delivered", "complete-duplicate"].includes(page.stage) ? `<div class="lid-duplicate-v18"><p>${page.duplicateIgnored ? "Duplicate result ignored · 0 events added" : `Exactly 3 earlier ${label} events were added once.`}</p>${page.duplicateIgnored ? "" : `<button type="button" data-lid-action="duplicate-${lane}" data-lid-request-generation="${page.requestGeneration + 1}">Deliver duplicate result</button>`}</div>` : "";
    return `<p id="${id}" class="lid-beginning-v18" tabindex="-1">Beginning of represented ${label} history</p>${duplicate}`;
  }

  function lane(state, lane) {
    const isSource = lane === "source";
    const label = isSource ? "Source" : "Derived";
    const scopedKeys = baseLaneKeys(state, lane);
    if (!scopedKeys.length) return "";
    const keys = visibleKeys(state, lane);
    const laneFilteredOut = state.appliedFilters.lane !== "all" && state.appliedFilters.lane !== lane;
    if (laneFilteredOut) return "";
    const helper = isSource
      ? state.fixture === "upstream-revised"
        ? "Retained Source Items and Source Revisions stay separate and unchanged."
        : "Source Items, Source Revisions, Corrections, Journal Dates, and upstream lifecycle. Authentic records stay separate and unchanged."
      : "Generated field, Visual Brief, and Generated Artwork versions linked to exact represented source sets. They never replace Source history.";
    return `<section class="lid-history-lane-v18 is-${lane}" aria-labelledby="lid-v18-${lane}-title" ${state.pagination[lane].stage === "pending" ? 'aria-busy="true"' : ""}><header><div><p class="lid-eyebrow-v18">${label} lane · ${keys.length} shown</p><h2 id="lid-v18-${lane}-title">${label} history</h2></div><p>${helper}</p></header><p class="lid-order-v18">Newest represented event first</p>${keys.length ? `<ol role="list">${keys.map((key) => eventCard(state, key)).join("")}</ol>` : `<p class="lid-lane-empty-v18">No ${label} history matches this view.</p>`}${paginationControl(state, lane)}</section>`;
  }

  function paginationCompletionSummary(state) {
    const source = state.pagination.source;
    const derived = state.pagination.derived;
    const completeStages = ["complete-delivered", "complete-duplicate"];
    const sourceEndReached = completeStages.includes(source.stage);
    const derivedEndReached = completeStages.includes(derived.stage);
    const sourceCurrentCount = baseLaneKeys(state, "source").length;
    const derivedCurrentCount = baseLaneKeys(state, "derived").length;
    if (state.scope !== "global" || activeFilterCount(state.appliedFilters) !== 0
      || !sourceEndReached || !derivedEndReached
      || source.added !== 3 || derived.added !== 3) return "";
    return `<section class="lid-pagination-completion-v18" aria-labelledby="lid-v18-pagination-completion-title"><div><p class="lid-eyebrow-v18">Earlier-history completion</p><h3 id="lid-v18-pagination-completion-title">Both lanes reached their represented beginning</h3><p>Read-only completion summary for this open-page pagination result.</p></div><dl><div><dt>Source history</dt><dd>${sourceCurrentCount} shown · Exactly 3 earlier added · Beginning reached</dd></div><div><dt>Derived history</dt><dd>${derivedCurrentCount} shown · Exactly 3 earlier added · Beginning reached</dd></div></dl></section>`;
  }

  function historyResults(state) {
    if (["loading", "failure", "empty"].includes(state.transitionBranch)) {
      if (state.transitionBranch === "loading") {
        return `<section class="lid-results-v18 lid-loading-results-v18" aria-label="History results"><section class="lid-history-lane-v18 is-source" aria-labelledby="lid-v18-loading-source-title" aria-busy="true"><header><div><p class="lid-eyebrow-v18">Source lane</p><h2 id="lid-v18-loading-source-title">Source history</h2></div></header><section class="lid-loading-status-v18" aria-labelledby="lid-v18-loading-title"><h3 id="lid-v18-loading-title">Loading history</h3><p>Preparing separate Source and Derived event lists from synthetic browser-memory fixtures.</p></section></section></section>`;
      }
      if (state.transitionBranch !== "empty") return "";
      const canonicalFixture = state.fixture === "empty";
      const emptyCopy = canonicalFixture
        ? ["No history matches this view", "No represented events match this selected synthetic scope. Nothing was deleted."]
        : state.scope === "global"
          ? ["No represented history yet", "This synthetic archive scope has no events. Nothing was deleted."]
          : state.scope === "day"
            ? ["No history for this Journal Day", "No represented events match this Journal Day."]
            : state.scope === "item"
              ? ["No history for this Source Item", "No represented events match this Source Item."]
              : state.scope === "field"
                ? ["No versions for this field", "No represented Derived Artifact versions match this field."]
                : state.scope === "artwork"
                  ? ["No Generated Artwork history", "No represented artwork versions match this scope."]
                  : ["No history for this historical Journal Day", "No represented events match this historical Journal Day."];
      const canonicalBack = canonicalFixture
        ? '<button type="button" data-lid-action="close-feature">Back to Settings</button>'
        : "";
      return `<section class="lid-empty-v18" aria-labelledby="lid-v18-empty-title"><h2 id="lid-v18-empty-title" tabindex="-1">${escapeHtml(emptyCopy[0])}</h2><p>${escapeHtml(emptyCopy[1])}</p>${canonicalBack}</section>`;
    }
    const count = representedCount(state);
    const filtered = activeFilterCount(state.appliedFilters) > 0;
    return `<section class="lid-results-v18" aria-labelledby="lid-v18-results-title"><header><p class="lid-eyebrow-v18">Read-only represented sequence</p><h2 id="lid-v18-results-title" tabindex="-1">${count} represented ${count === 1 ? "event" : "events"}</h2><p>Source history appears first. Each lane is newest first; the canonical cross-lane order remains data truth.</p></header>${!count && filtered ? `<section class="lid-empty-v18" aria-labelledby="lid-v18-filtered-empty-title"><h3 id="lid-v18-filtered-empty-title">No events match these filters</h3><p>Try clearing one filter. History was not changed.</p><button type="button" data-lid-action="clear-filters">Clear filters</button></section>` : `${lane(state, "source")}${lane(state, "derived")}${paginationCompletionSummary(state)}`}</section>`;
  }

  function consolePanel(state) {
    const labels = {
      "global-ready": "Global ready", "day-ready": "Day ready", "item-ready": "Item ready", "field-ready": "Field ready", "artwork-ready": "Artwork ready", "hidden-day": "Hidden day", "upstream-revised": "Upstream revised", "upstream-conflict": "Upstream conflict", "upstream-untagged": "Upstream untagged", "upstream-deleted": "Upstream deleted", empty: "Empty", loading: "Loading", failure: "Failure", interrupted: "Interrupted",
    };
    const lifecycleFixture = state.fixture.startsWith("upstream-");
    return `<aside class="lid-console-v18" aria-labelledby="lid-v18-console-title"><details data-lid-v18-console-details ${state.consoleOpen ? "open" : ""}><summary id="lid-v18-console-title"><span>Prototype states</span><small>14 exact fixtures · deterministic browser memory</small></summary><p>Each named fixture resets scope, filters, disclosures, pagination, and counters. Theme is the only presentation preference retained.</p><div class="lid-fixture-buttons-v18" role="group" aria-label="History and Provenance prototype states">${REQUIRED_FIXTURES.map((key) => `<button type="button" data-lid-action="set-fixture" data-lid-fixture="${key}" aria-pressed="${String(state.fixture === key)}"><span aria-hidden="true">${state.fixture === key ? "●" : "○"}</span>${labels[key]}</button>`).join("")}</div><section class="lid-transition-lab-v18" aria-labelledby="lid-v18-transition-title"><h3 id="lid-v18-transition-title">Transition branches</h3><div><button type="button" data-lid-action="enter-pagination" ${state.scope === "global" ? "" : "disabled"}>Start independent lane pages</button><button type="button" data-lid-action="scope-empty">Represent empty scope</button>${lifecycleFixture ? '<button type="button" data-lid-action="status-unavailable">Represent unavailable upstream status</button>' : ""}<button type="button" data-lid-action="metadata-stress">Long safe metadata</button></div><p>Filters, retry, pagination, and disclosure inspect only. They create 0 mutation intents, 0 archive effects, and 0 provider requests.</p></section></details><section class="lid-invariant-card-v18" aria-labelledby="lid-v18-invariant-title"><p class="lid-eyebrow-v18">Invariant monitor</p><h2 id="lid-v18-invariant-title">Read-only domain fingerprint</h2><dl><div><dt>Mutation intents</dt><dd>${state.mutationIntents}</dd></div><div><dt>Archive effects</dt><dd>${state.mutationEffects}</dd></div><div><dt>Provider requests</dt><dd>${state.providerRequests}</dd></div><div><dt>Accepted corpus</dt><dd>17 typed events</dd></div></dl><p>Source, Correction, Summary, artwork, upstream, and hidden-day facts remain unchanged.</p></section></aside>`;
  }

  function render(state) {
    const definition = SCOPE_DEFINITIONS[state.scope];
    const pageHeading = state.scope === "field" ? `${state.fieldLabel} history` : definition.h1;
    const lifecycleLede = {
      "upstream-revised": "Inspect retained Revision 1 and Revision 2, with Revision 2 displayed, current upstream, and revised upstream.",
      "upstream-conflict": "Inspect three retained Source Revisions, displayed Correction 1 based on Revision 2, and the unresolved conflict with Revision 3.",
      "upstream-untagged": "Inspect the retained revision and Correction lineage, unresolved conflict, and the represented Untagged upstream state.",
      "upstream-deleted": "Inspect the retained revision and Correction lineage, unresolved conflict, and cumulative Untagged and Deleted upstream lifecycle facts.",
    }[state.fixture];
    const pageLede = state.scope === "field"
      ? `Compare read-only ${state.fieldLabel} versions and exact represented source bindings. Nothing here selects or edits a version.`
      : state.scope === "item" && lifecycleLede ? lifecycleLede : definition.lede;
    const internalBack = state.scope === "hidden" && state.internalReturn;
    const hiddenBanner = state.scope === "hidden" ? `<aside class="lid-hidden-banner-v18" aria-labelledby="lid-v18-hidden-title"><p class="lid-eyebrow-v18">History-only Journal Day</p><h2 id="lid-v18-hidden-title">Historical day — not shown in Calendar or Almanac</h2><p>This Journal Day has no live Source Items in the represented state. Retained Source and Derived history remains available here. Viewing it does not restore the day.</p></aside>` : "";
    const mainContent = `${hiddenBanner}<aside class="lid-readonly-v18"><span aria-hidden="true">◇</span><div><strong>Read-only prototype history</strong><p>Fictional deterministic events in this open page. Viewing changes no current state.</p></div></aside>${scopeSummary(state)}${sourceContext(state)}<div class="lid-history-layout-v18">${filters(state)}<div class="lid-history-column-v18">${stateNotice(state)}${historyResults(state)}</div></div>`;
    return `<div class="lid-v18-shell" data-lid-theme="${escapeHtml(state.theme)}" data-lid-scope="${escapeHtml(state.scope)}" data-lid-branch="${escapeHtml(state.transitionBranch)}"><a class="lid-skip-v18" href="#lid-main-v18" data-lid-v18-action="skip-main">Skip to History &amp; provenance</a><nav class="lid-topbar-v18" aria-label="History navigation"><a class="lid-brand-v18" href="index-v16.html" aria-label="Open the frozen Life in Days v16 archive directly"><span aria-hidden="true">L</span><strong>Life in Days</strong></a><div class="lid-topbar-actions-v18"><span>Prototype v18 · synthetic</span><button id="lid-v18-theme" type="button" data-lid-action="toggle-theme" aria-label="Use ${state.theme === "light" ? "dark" : "light"} prototype theme">${state.theme === "light" ? "Dark" : "Light"} theme</button><button type="button" ${internalBack ? 'data-lid-v18-action="back-history"' : 'data-lid-action="close-feature"'}>${escapeHtml(state.expectedBackLabel)}</button></div></nav><main id="lid-main-v18" class="lid-main-v18" tabindex="-1"><header class="lid-page-header-v18"><div><p class="lid-eyebrow-v18">Management / History &amp; provenance</p><h1 id="lid-v18-title" tabindex="-1">${escapeHtml(pageHeading)}</h1><p>${escapeHtml(pageLede)}</p></div><span class="lid-scope-mark-v18">${escapeHtml(state.scope === "global" ? "Entire archive" : state.scope === "hidden" ? "Historical day" : `${state.scope} scope`)}</span></header><div class="lid-task-v18">${mainContent}</div>${consolePanel(state)}<footer class="lid-boundary-v18"><strong>Prototype boundary</strong><p>This surface does not verify VoiceNotes retrieval or reconciliation, durable or immutable history, trustworthy actor/time evidence, provider execution, persistence, export reconstruction, authentication, encryption, deployment, formal accessibility conformance, or production readiness.</p><a href="index-v16.html">Open the frozen v16 archive directly</a></footer></main></div>`;
  }

  function paginationAnchorSnapshot(lane) {
    const retained = paginationAnchorBaselines[lane];
    return {
      baseline: retained ? {
        generation: retained.generation,
        kind: retained.kind,
        input: retained.input,
        top: retained.top,
        confirmed: retained.confirmed,
        restoring: retained.restoring,
      } : null,
      lastRestoration: paginationAnchorEvidence[lane] ? { ...paginationAnchorEvidence[lane] } : null,
    };
  }

  function snapshot(state) {
    const sourceVisible = visibleKeys(state, "source");
    const derivedVisible = visibleKeys(state, "derived");
    const representedSource = representedCurrentSource(state);
    const canonicalEntry = canonicalEntryPanelSnapshot();
    const compatibilityLauncher = compatibilityLauncherSnapshot();
    return {
      version: AUTHORITY.version,
      feature: AUTHORITY.feature,
      fixture: state.fixture,
      transitionBranch: state.transitionBranch,
      phase: state.transitionBranch,
      scope: state.scope,
      sourceContextVariant: sourceContextVariant(state),
      fieldLabel: state.fieldLabel,
      canonicalContextToken: state.canonicalContextToken,
      theme: state.theme,
      fixedClock: AUTHORITY.fixedClock,
      timezone: AUTHORITY.timezone,
      loadedVersions: runtime.manifest().loadedVersions,
      corpusKeys: Object.keys(EVENTS).sort(),
      canonicalTotalOrder: [...CANONICAL_TOTAL_ORDER],
      sourceOrder: [...SOURCE_ORDER],
      derivedOrder: [...DERIVED_ORDER],
      scopeSourceKeys: [...state.sourceKeys],
      scopeDerivedKeys: [...state.derivedKeys],
      visibleSourceKeys: sourceVisible,
      visibleDerivedKeys: derivedVisible,
      laneCounts: { source: sourceVisible.length, derived: derivedVisible.length },
      totalCount: sourceVisible.length + derivedVisible.length,
      appliedFilters: { ...state.appliedFilters },
      draftFilters: { ...state.draftFilters },
      filterOpen: state.filterOpen,
      consoleOpen: state.consoleOpen,
      activeFilterCount: activeFilterCount(state.appliedFilters),
      openDisclosureKeys: [...state.openDisclosureKeys],
      disclosureDefaultKeys: initialDisclosureKeys(state.fixture),
      disclosureDefaultIntact: state.disclosureDefaultIntact,
      initialPresentation: state.initialPresentation,
      selectedRelationTarget: state.selectedRelationTarget,
      pagination: {
        source: {
          ...copy(state.pagination.source),
          initialCount: SOURCE_FIRST_PAGE.length,
          currentCount: baseLaneKeys(state, "source").length,
          endReached: ["complete", "complete-delivered", "complete-duplicate"].includes(state.pagination.source.stage),
          anchor: paginationAnchorSnapshot("source"),
        },
        derived: {
          ...copy(state.pagination.derived),
          initialCount: DERIVED_FIRST_PAGE.length,
          currentCount: baseLaneKeys(state, "derived").length,
          endReached: ["complete", "complete-delivered", "complete-duplicate"].includes(state.pagination.derived.stage),
          anchor: paginationAnchorSnapshot("derived"),
        },
      },
      currentSource: {
        label: AUTHORITY.sourceLabel,
        type: "Voice Journal",
        originalTimestamp: AUTHORITY.originalTimestamp,
        currentJournalDate: AUTHORITY.currentDate,
        revisionLineage: [...representedSource.revisionLineage],
        displayedRecord: representedSource.displayedRecord,
        correction: representedSource.correction ? { ...representedSource.correction } : null,
        currentUpstream: representedSource.currentUpstream,
        upstreamState: [...representedSource.upstreamState],
        conflict: representedSource.conflict,
      },
      summary: { current: "Summary version 2", states: ["Current", "Protected Field", "Stale"], binding: ["Revision 2", "Correction 1"], historical: "Summary version 1" },
      displayedField: { label: state.fieldLabel, current: `${state.fieldLabel} version 2`, states: ["Current", "Protected Field", "Stale"], binding: ["Revision 2", "Correction 1"], historical: `${state.fieldLabel} version 1` },
      artwork: { currentRecord: "Artwork version 2", states: ["Historical", "Stale", "AI-generated artwork"], binding: ["Revision 2", "Correction 1"], historical: "Artwork version 1" },
      hiddenDay: { journalDate: "11 Aug 2026", currentSyntheticLocation: "10 Aug 2026", liveSourceItems: 0, banner: "Historical day — not shown in Calendar or Almanac" },
      upstream: { statusUnavailable: state.statusUnavailable, externalEvidenceRequired: true, localItemRetained: true, representedState: [...representedSource.upstreamState] },
      preOpenDomainFingerprint: state.preOpenDomainFingerprint,
      currentDomainFingerprint: state.currentDomainFingerprint,
      mutationIntents: state.mutationIntents,
      mutationEffects: state.mutationEffects,
      providerRequests: state.providerRequests,
      canonicalEntry,
      inheritedContextPatchedCount: inheritedContextPatchCount(),
      nativeNegativeAnchors: nativeNegativeAnchorSnapshot(),
      launcherUserSurfaceAbsent: compatibilityLauncher.userSurfaceAbsent,
      compatibilityLauncher,
      entryReturn: entryReturnSnapshot(),
      origin: state.origin,
      expectedBackLabel: state.expectedBackLabel,
      stableFocusKey: state.stableFocusKey,
      returnScroll: { ...state.returnScroll },
      metadataStress: state.metadataStress,
      announcement: state.announcement,
      announcementAssertive: state.announcementAssertive,
    };
  }

  function arraysEqual(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function elementRenderedInLayout(element) {
    if (!(element instanceof HTMLElement) || element.hidden || element.inert || !element.getClientRects().length) return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0;
  }

  function elementHitTestable(element) {
    if (!elementRenderedInLayout(element)) return false;
    const rectangle = element.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 1, Math.max(0, rectangle.left + rectangle.width / 2));
    const y = Math.min(window.innerHeight - 1, Math.max(0, rectangle.top + rectangle.height / 2));
    if (rectangle.right <= 0 || rectangle.bottom <= 0 || rectangle.left >= window.innerWidth || rectangle.top >= window.innerHeight) return false;
    const hit = document.elementFromPoint(x, y);
    return Boolean(hit && (hit === element || element.contains(hit)));
  }

  function canonicalEntryPanelSnapshot() {
    const matches = [...document.querySelectorAll("#lid-v18-canonical-entry-panel")];
    const panel = matches.length === 1 ? matches[0] : null;
    const prototypeRoot = document.querySelector("#prototype-root");
    const modalRoot = document.querySelector("#modal-root");
    const runtimeRoot = document.querySelector("#lid-runtime-v17");
    const activeFeature = runtimeRoot?.dataset.activeFeature || null;
    const style = panel instanceof HTMLElement ? getComputedStyle(panel) : null;
    const buttons = panel ? [...panel.querySelectorAll("button[data-lid-v18-canonical-entry]")].map((button) => ({
      id: button.id,
      token: button.dataset.lidV18CanonicalEntry,
      text: button.textContent.replace(/\s+/g, " ").trim(),
      describedBy: button.getAttribute("aria-describedby"),
      minimum44By44: button.getBoundingClientRect().width >= 44 && button.getBoundingClientRect().height >= 44,
    })) : [];
    const facts = panel ? [...panel.querySelectorAll("[data-lid-v18-canonical-fact]")].map((fact) => fact.textContent.replace(/\s+/g, " ").trim()) : [];
    const exposed = panel instanceof HTMLElement
      && elementRenderedInLayout(panel)
      && panel.getAttribute("aria-hidden") !== "true";
    return {
      count: matches.length,
      placementFailed: canonicalPanelPlacementFailed,
      directBodyChild: panel?.parentElement === document.body,
      afterPrototypeRoot: prototypeRoot?.nextElementSibling === panel,
      beforeModalRoot: panel?.nextElementSibling === modalRoot,
      activeFeature,
      display: style?.display || null,
      visibleInLayout: elementRenderedInLayout(panel),
      accessibilityExposed: exposed,
      hitTestable: elementHitTestable(panel),
      eyebrow: panel?.querySelector(".lid-v18-canonical-entry-eyebrow")?.textContent.replace(/\s+/g, " ").trim() || null,
      heading: panel?.querySelector("#lid-v18-canonical-entry-title")?.textContent.replace(/\s+/g, " ").trim() || null,
      body: panel?.querySelector("#lid-v18-canonical-entry-description")?.textContent.replace(/\s+/g, " ").trim() || null,
      listTag: panel?.querySelector(":scope > ol")?.tagName.toLowerCase() || null,
      facts,
      buttons,
    };
  }

  function compatibilityLauncherSnapshot() {
    const launcher = document.querySelector("#lid-runtime-v17 > .lid-launcher-v17");
    const style = launcher instanceof HTMLElement ? getComputedStyle(launcher) : null;
    const visible = elementRenderedInLayout(launcher);
    const focusable = launcher instanceof HTMLButtonElement
      && !launcher.disabled
      && launcher.tabIndex >= 0
      && visible;
    const accessibilityExposed = launcher instanceof HTMLElement
      && visible
      && launcher.getAttribute("aria-hidden") !== "true"
      && !launcher.inert;
    const hitTestable = elementHitTestable(launcher);
    return {
      presentForCompatibility: launcher instanceof HTMLButtonElement,
      hidden: launcher instanceof HTMLElement ? launcher.hidden : null,
      disabled: launcher instanceof HTMLButtonElement ? launcher.disabled : null,
      ariaHidden: launcher?.getAttribute("aria-hidden") || null,
      tabIndex: launcher instanceof HTMLElement ? launcher.tabIndex : null,
      inert: launcher instanceof HTMLElement ? launcher.inert : null,
      display: style?.display || null,
      visible,
      focusable,
      hitTestable,
      accessibilityExposed,
      userSurfaceAbsent: launcher instanceof HTMLButtonElement
        && launcher.disabled
        && launcher.getAttribute("aria-hidden") === "true"
        && launcher.tabIndex === -1
        && launcher.inert
        && style?.display === "none"
        && !visible
        && !focusable
        && !hitTestable
        && !accessibilityExposed,
    };
  }

  function inheritedContextPatchCount() {
    const roots = [document.querySelector("#prototype-root"), document.querySelector("#modal-root")].filter(Boolean);
    const patched = new Set();
    const remember = (element) => {
      if (element instanceof Element) patched.add(element);
    };
    roots.forEach((root) => {
      root.querySelectorAll('[data-lid-v18-entry], [data-lid-v18-origin], [data-lid-v18-field], [data-lid-v18-canonical-entry], .lid-injected-history-v18').forEach(remember);
      root.querySelectorAll('.day-actions-section [data-action="view-provenance"]').forEach((control) => {
        if (control.textContent.replace(/\s+/g, " ").trim() !== "View day history") remember(control);
      });
      root.querySelectorAll('.journal-card [data-action="view-provenance"]').forEach((control) => {
        if (control.textContent.replace(/\s+/g, " ").trim() !== "Revisions & provenance") remember(control);
      });
      root.querySelectorAll('[data-action="view-art-history"]').forEach((control) => {
        if (control.textContent.replace(/\s+/g, " ").trim() !== "View versions") remember(control);
      });
      root.querySelectorAll(".reflection-manage-row .manage-row-actions button").forEach((control) => {
        if (/^View (Title|Summary|Tags) history$/.test(control.textContent.replace(/\s+/g, " ").trim())) remember(control);
      });
    });
    return patched.size;
  }

  function nativeNegativeAnchorSnapshot() {
    const prototypeRoot = document.querySelector("#prototype-root");
    const modalRoot = document.querySelector("#modal-root");
    const dayHeading = prototypeRoot?.querySelector("#journal-day-title-v14");
    const dayIdentity = dayHeading?.textContent.replace(/\s+/g, " ").trim() || null;
    const isTwoAugust = Boolean(dayIdentity && /\b2 August 2026\b/.test(dayIdentity));
    const dayAction = isTwoAugust ? prototypeRoot.querySelector('.day-actions-section [data-action="view-provenance"]') : null;
    const sourceCard = isTwoAugust ? [...prototypeRoot.querySelectorAll(".journal-card")]
      .find((card) => card.querySelector("h3")?.textContent.replace(/\s+/g, " ").trim() === "Before sleep — synthetic fixture") : null;
    const sourceAction = sourceCard?.querySelector('[data-action="view-provenance"]') || null;
    const artworkAction = isTwoAugust ? prototypeRoot.querySelector('[data-action="view-art-history"]') : null;
    const normalizedArtworkAction = artworkAction?.textContent.replace(/\s+/g, " ").trim() || null;
    const manageRows = [...(modalRoot?.querySelectorAll(".reflection-manage-row") || [])];
    const manageHistoryCount = manageRows.reduce((count, row) => count + [...row.querySelectorAll(".manage-row-actions button")]
      .filter((button) => /history/i.test(button.textContent)).length, 0);
    return {
      represented: isTwoAugust,
      dayIdentity,
      dayAction: dayAction?.textContent.replace(/\s+/g, " ").trim() || null,
      sourceItemIdentity: sourceCard?.querySelector("h3")?.textContent.replace(/\s+/g, " ").trim() || null,
      sourceItemAction: sourceAction?.textContent.replace(/\s+/g, " ").trim() || null,
      artworkAction: normalizedArtworkAction,
      artworkRepresented: artworkAction instanceof Element,
      artworkExactWhenRepresented: !artworkAction || normalizedArtworkAction === "View versions",
      manageReflectionRowCount: manageRows.length,
      manageReflectionHistoryCount: manageHistoryCount,
      exactWhenRepresented: !isTwoAugust || (
        dayAction?.textContent.replace(/\s+/g, " ").trim() === "View day history"
        && sourceCard?.querySelector("h3")?.textContent.replace(/\s+/g, " ").trim() === "Before sleep — synthetic fixture"
        && sourceAction?.textContent.replace(/\s+/g, " ").trim() === "Revisions & provenance"
        && (!artworkAction || normalizedArtworkAction === "View versions")
        && manageHistoryCount === 0
      ),
    };
  }

  function entryReturnSnapshot() {
    return {
      pending: entryReturnAnchor ? {
        generation: entryReturnAnchor.generation,
        origin: entryReturnAnchor.origin,
        scope: entryReturnAnchor.scope,
        canonicalContextToken: entryReturnAnchor.canonicalContextToken,
        invokerId: entryReturnAnchor.trigger.id || null,
        scrollY: entryReturnAnchor.scrollY,
        targetTop: entryReturnAnchor.targetTop,
        closeMethod: entryReturnAnchor.closeMethod,
      } : null,
      lastRestoration: entryReturnEvidence ? { ...entryReturnEvidence } : null,
    };
  }

  function invariants(state) {
    const current = snapshot(state);
    const active = runtime.isActive("v18");
    const host = document.querySelector("#lid-feature-host-v17");
    const contextCount = host?.querySelectorAll(".lid-source-context-v18").length || 0;
    const sourceProse = [SOURCE_CONTEXT_PROSE, SOURCE_CONTEXT_PROSE_REVISION_2];
    const proseInEvents = [...(host?.querySelectorAll(".lid-event-card-v18, .lid-provenance-v18, .lid-relations-v18") || [])].some((element) => sourceProse.some((prose) => element.textContent.includes(prose)));
    const liveText = `${document.querySelector("#lid-status-v17")?.textContent || ""} ${document.querySelector("#lid-alert-v17")?.textContent || ""}`;
    const sourceVisible = current.visibleSourceKeys;
    const derivedVisible = current.visibleDerivedKeys;
    const snapshotText = JSON.stringify(current);
    const lifecycleText = `${host?.querySelector(".lid-page-header-v18")?.textContent || ""} ${host?.querySelector(".lid-scope-summary-v18")?.textContent || ""} ${host?.querySelector(".lid-source-context-v18")?.textContent || ""} ${host?.querySelector(".lid-history-column-v18")?.textContent || ""}`;
    const expectedContextVariant = ["day", "item"].includes(state.scope) ? (state.fixture === "upstream-revised" ? "revision-2" : "correction-1") : "none";
    const loadingBusyNodes = [...(host?.querySelectorAll('[aria-busy="true"]') || [])];
    const loadingLane = host?.querySelector('.lid-history-lane-v18.is-source[aria-labelledby="lid-v18-loading-source-title"][aria-busy="true"]');
    const loadingStatus = loadingLane?.querySelector(':scope > .lid-loading-status-v18[aria-labelledby="lid-v18-loading-title"]');
    const disclosureDefaultsExact = REQUIRED_FIXTURES.every((fixture) => arraysEqual(initialDisclosureKeys(fixture), fixture === "item-ready" ? ["E12"] : []));
    const e12Details = host?.querySelector('[data-lid-v18-event-details="E12"]');
    const e12RelationshipOrder = [...(e12Details?.querySelectorAll(".lid-relations-v18 > h4") || [])].map((heading) => heading.textContent);
    const currentDefaultDisclosureExact = !state.disclosureDefaultIntact || arraysEqual(current.openDisclosureKeys, initialDisclosureKeys(state.fixture));
    const itemDefaultDisclosureDomExact = !active || !state.disclosureDefaultIntact || state.fixture !== "item-ready" || state.scope !== "item" || !sourceVisible.includes("E12") || (
      e12Details instanceof HTMLDetailsElement
      && e12Details.open
      && arraysEqual(e12RelationshipOrder, ["Event sequence", "Record lineage"])
    );
    const paginationGenerationExact = ["source", "derived"].every((lane) => {
      const page = current.pagination[lane];
      const baseline = page.anchor.baseline;
      const restoration = page.anchor.lastRestoration;
      const generationValid = Number.isInteger(page.requestGeneration) && page.requestGeneration >= 0
        && (page.terminalGeneration === null || page.terminalGeneration === page.requestGeneration);
      const baselineValid = !baseline || (
        state.scope === "global"
        && (baseline.confirmed
          ? baseline.generation === page.requestGeneration && ["pending", "failed", "interrupted", "complete-delivered", "complete-duplicate"].includes(page.stage)
          : baseline.generation === page.requestGeneration + 1 && ["ready", "failed", "interrupted", "complete-delivered"].includes(page.stage))
      );
      const restorationValid = !restoration || (
        restoration.consumed
        && restoration.focused
        && Math.abs(restoration.delta) <= 1
        && restoration.targetId === `lid-v18-load-${lane}`
      );
      return generationValid && baselineValid && restorationValid;
    });
    const exactLoadingTree = state.transitionBranch !== "loading" || (
      loadingBusyNodes.length === 1
      && loadingBusyNodes[0] === loadingLane
      && !loadingLane.hasAttribute("aria-label")
      && loadingLane?.querySelector(':scope > header h2#lid-v18-loading-source-title')?.textContent === "Source history"
      && loadingStatus?.querySelector(':scope > h3#lid-v18-loading-title')?.textContent === "Loading history"
      && loadingStatus?.querySelector(":scope > p")?.textContent === "Preparing separate Source and Derived event lists from synthetic browser-memory fixtures."
      && !host?.querySelector(".lid-history-lane-v18.is-derived, .lid-event-card-v18, .lid-loading-results-v18 ol")
      && !/represented events/.test(host?.querySelector(".lid-loading-results-v18")?.textContent || "")
    );
    const currentSourceExact = state.fixture === "upstream-revised"
      ? arraysEqual(current.currentSource.revisionLineage, ["Revision 1", "Revision 2"]) && current.currentSource.displayedRecord === "Revision 2" && current.currentSource.correction === null && current.currentSource.currentUpstream === "Revision 2" && arraysEqual(current.currentSource.upstreamState, ["Revised upstream"]) && arraysEqual(displayRecord(state, "E04").states, ["Displayed", "Current upstream", "Revised upstream"]) && current.currentSource.conflict === null && !/\b(Correction|Revision 3|conflict|Conflict|Untagged|Deleted)\b/.test(lifecycleText)
      : state.fixture === "upstream-conflict"
        ? arraysEqual(current.currentSource.revisionLineage, ["Revision 1", "Revision 2", "Revision 3"]) && current.currentSource.correction?.basedOn === "Revision 2" && current.currentSource.conflict === "Correction 1 versus Revision 3 · Unresolved" && !/(Untagged|Deleted)/.test(lifecycleText)
        : state.fixture === "upstream-untagged"
          ? arraysEqual(current.currentSource.upstreamState, ["Untagged upstream", "Retained locally"]) && current.currentSource.conflict === "Correction 1 versus Revision 3 · Unresolved" && !/Deleted/.test(lifecycleText)
          : state.fixture === "upstream-deleted"
            ? arraysEqual(current.currentSource.upstreamState, ["Deleted upstream", "Retained locally"]) && current.currentSource.conflict === "Correction 1 versus Revision 3 · Unresolved"
            : arraysEqual(current.currentSource.revisionLineage, ["Revision 1", "Revision 2", "Revision 3"]) && current.currentSource.correction?.basedOn === "Revision 2";
    const expectedPanelButtons = [
      { id: "lid-v18-canonical-entry-day", token: "day", text: "History & provenance", describedBy: "lid-v18-canonical-entry-fact-day" },
      { id: "lid-v18-canonical-entry-item", token: "item", text: "View source history", describedBy: "lid-v18-canonical-entry-fact-item" },
      { id: "lid-v18-canonical-entry-summary", token: "field", text: "View Summary history", describedBy: "lid-v18-canonical-entry-fact-summary" },
      { id: "lid-v18-canonical-entry-artwork", token: "artwork", text: "View artwork history", describedBy: "lid-v18-canonical-entry-fact-artwork" },
    ];
    const exactPanelCopy = current.canonicalEntry.eyebrow === "PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS"
      && current.canonicalEntry.heading === "Open canonical History contexts"
      && current.canonicalEntry.body === "These controls open the fixed fictional 17 Aug 2026 history for Monsoon walk note. They do not represent the Journal Days, Source Items, generated fields, or artwork shown elsewhere in the frozen v16 archive."
      && arraysEqual(current.canonicalEntry.facts, ["Journal Day · 17 Aug 2026", "Source Item · Monsoon walk note", "Generated field · Summary", "Generated Artwork · Artwork version 2"])
      && arraysEqual(current.canonicalEntry.buttons.map(({ id, token, text, describedBy }) => ({ id, token, text, describedBy })), expectedPanelButtons);
    const anyFeatureActive = Boolean(current.canonicalEntry.activeFeature);
    const exactPanelExposure = anyFeatureActive
      ? current.canonicalEntry.display === "none" && !current.canonicalEntry.visibleInLayout && !current.canonicalEntry.accessibilityExposed && !current.canonicalEntry.hitTestable
      : current.canonicalEntry.display !== "none" && current.canonicalEntry.visibleInLayout && current.canonicalEntry.accessibilityExposed;
    const canonicalContextExact = state.canonicalContextToken === null || (
      Object.hasOwn(CANONICAL_ENTRY_MAP, state.canonicalContextToken)
      && CANONICAL_ENTRY_MAP[state.canonicalContextToken].scope === state.scope
      && CANONICAL_ENTRY_MAP[state.canonicalContextToken].origin === state.origin
      && (state.canonicalContextToken !== "field" || state.fieldLabel === "Summary")
    );
    const returnRestoration = current.entryReturn.lastRestoration;
    const exactEntryReturn = !returnRestoration || (
      returnRestoration.consumed
      && returnRestoration.sameConnectedInvoker
      && returnRestoration.focused
      && !returnRestoration.usedFallback
      && Math.abs(returnRestoration.scrollDelta) <= 1
      && Math.abs(returnRestoration.targetTopDelta) <= 1
    );
    const assertions = [
      { name: "Exact E01-E17 corpus membership", pass: arraysEqual(current.corpusKeys, Array.from({ length: 17 }, (_, index) => `E${String(index + 1).padStart(2, "0")}`)) },
      { name: "Canonical Source and Derived orders are exact", pass: arraysEqual(current.canonicalTotalOrder, CANONICAL_TOTAL_ORDER) && arraysEqual(current.sourceOrder, SOURCE_ORDER) && arraysEqual(current.derivedOrder, DERIVED_ORDER) },
      { name: "Exactly fourteen top-level fixture keys", pass: arraysEqual(REQUIRED_FIXTURES, Object.keys(FIXTURE_CONFIG)) && REQUIRED_FIXTURES.length === 14 },
      { name: "Fresh Item history opens only E12 provenance by default", pass: disclosureDefaultsExact && currentDefaultDisclosureExact && itemDefaultDisclosureDomExact && (!state.initialPresentation || state.fixture !== "item-ready" || (!current.announcement && current.stableFocusKey === state.focusSelector)) },
      { name: "Source and Derived records remain disjoint", pass: SOURCE_ORDER.every((key) => EVENTS[key].lane === "Source") && DERIVED_ORDER.every((key) => EVENTS[key].lane === "Derived") && !sourceVisible.some((key) => derivedVisible.includes(key)) },
      { name: "Revision, Correction, field, and Artwork lineage is exact", pass: currentSourceExact && arraysEqual(current.summary.binding, ["Revision 2", "Correction 1"]) && arraysEqual(current.artwork.binding, ["Revision 2", "Correction 1"]) && current.displayedField.current === `${current.fieldLabel} version 2` && current.displayedField.historical === `${current.fieldLabel} version 1` && arraysEqual(current.displayedField.binding, ["Revision 2", "Correction 1"]) },
      { name: "E10 and Source Revision copy match frozen truth", pass: EVENTS.E10.time === "19 Aug 2026, 10:00 am IST" && EVENTS.E10.journalDateFact === "18 Aug 2026 → 17 Aug 2026" && current.currentSource.originalTimestamp === "17 Aug 2026, 11:42 pm IST" && EVENTS.E04.consequence === "A newer VoiceNotes revision was represented. The prior Source Revision remains Historical. Nothing was overwritten." },
      { name: "Summary and Artwork current facts are exact", pass: arraysEqual(current.summary.states, ["Current", "Protected Field", "Stale"]) && arraysEqual(current.artwork.states, ["Historical", "Stale", "AI-generated artwork"]) },
      { name: "Lifecycle current facts remain fixture-scoped", pass: currentSourceExact && current.upstream.localItemRetained && current.currentSource.currentJournalDate === "17 Aug 2026" && current.hiddenDay.journalDate === "11 Aug 2026" },
      { name: "Hidden day identity and banner are exact", pass: current.hiddenDay.currentSyntheticLocation === "10 Aug 2026" && current.hiddenDay.liveSourceItems === 0 && current.hiddenDay.banner === "Historical day — not shown in Calendar or Almanac" && (state.scope !== "hidden" || !host?.querySelector(".lid-task-v18")?.textContent.includes(AUTHORITY.originalTimestamp)) },
      { name: "All History operations are read-only", pass: current.preOpenDomainFingerprint === current.currentDomainFingerprint && current.mutationIntents === 0 && current.mutationEffects === 0 && current.providerRequests === 0 },
      { name: "Canonical entry panel has exact copy, order, placement, and active exposure", pass: current.canonicalEntry.count === 1 && !current.canonicalEntry.placementFailed && current.canonicalEntry.directBodyChild && current.canonicalEntry.afterPrototypeRoot && current.canonicalEntry.beforeModalRoot && current.canonicalEntry.listTag === "ol" && current.canonicalEntry.buttons.length === 4 && (anyFeatureActive || current.canonicalEntry.buttons.every((button) => button.minimum44By44)) && exactPanelCopy && exactPanelExposure },
      { name: "Inherited contextual controls remain native and unpatched", pass: current.inheritedContextPatchedCount === 0 },
      { name: "Exact 2 Aug and Before sleep native negative anchors remain unchanged", pass: current.nativeNegativeAnchors.exactWhenRepresented },
      { name: "Compatibility launcher is absent from the v18 user surface", pass: current.launcherUserSurfaceAbsent && current.compatibilityLauncher.userSurfaceAbsent },
      { name: "Canonical entry token and exact return evidence are safe", pass: canonicalContextExact && exactEntryReturn },
      { name: "Pagination anchors are lane- and request-generation-scoped", pass: paginationGenerationExact },
      { name: "Unavailable upstream status adds no provider work", pass: !current.upstream.statusUnavailable || (current.providerRequests === 0 && current.currentDomainFingerprint === current.preOpenDomainFingerprint) },
      { name: "Current source prose is confined to Day or Item task content", pass: !active || (contextCount === (["day", "item"].includes(state.scope) ? 1 : 0) && !proseInEvents && !sourceProse.some((prose) => liveText.includes(prose))) },
      { name: "Safe source-context variant is exact and prose-free in structured state", pass: ["revision-2", "correction-1", "none"].includes(current.sourceContextVariant) && current.sourceContextVariant === expectedContextVariant && !sourceProse.some((prose) => snapshotText.includes(prose)) },
      { name: "Loading is a single named busy Source lane", pass: !active || exactLoadingTree },
      { name: "One feature h1 and task before prototype console", pass: !active || (host?.querySelectorAll("h1").length === 1 && Boolean(host.querySelector(".lid-task-v18")?.compareDocumentPosition(host.querySelector(".lid-console-v18")) & Node.DOCUMENT_POSITION_FOLLOWING)) },
      { name: "Generic route, title, null history, and no horizontal overflow", pass: document.title === "Life in Days" && (!active || (!location.search && !location.hash && history.state === null && document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)) },
      { name: "Runtime chain is exactly v17 then v18", pass: arraysEqual(runtime.manifest().loadedVersions, [17, 18]) && arraysEqual(runtime.listFeatures().map((feature) => feature.key), ["v17", "v18"]) },
      { name: "Visible keys are unique valid ordered subsets", pass: new Set([...sourceVisible, ...derivedVisible]).size === sourceVisible.length + derivedVisible.length && [...sourceVisible, ...derivedVisible].every((key) => Object.hasOwn(EVENTS, key)) },
    ];
    return { pass: assertions.every((assertion) => assertion.pass), assertions };
  }

  runtime.registerFeature("v18", {
    version: 18,
    title: "History and Provenance",
    launcherTitle: "History & provenance · fixed synthetic demo",
    createState: baseState,
    validateLaunchContext,
    prepareOpen,
    fixtureState,
    reduce,
    render,
    snapshot,
    invariants,
    defaultFocus: "#lid-v18-title",
    qaManifest: () => ({
      version: 18,
      feature: AUTHORITY.feature,
      requirements: ["LID-SCP-003", "LID-VN-006", "LID-REF-004"],
      supportingRegression: ["LID-SRC-004 retained history/source binding", "Frozen v17 Atomic Redating"],
      outsideUi: ["LID-VN-005 · external reconciliation evidence required"],
      fixtures: [...REQUIRED_FIXTURES],
      captureScenarios: [...CAPTURE_SCENARIOS],
      eventCorpus: Object.keys(EVENTS).sort(),
      canonicalTotalOrder: [...CANONICAL_TOTAL_ORDER],
      sourceOrder: [...SOURCE_ORDER],
      derivedOrder: [...DERIVED_ORDER],
      scopeCounts: { global: 17, day: 14, item: 14, field: 3, artwork: 3, hiddenDay: 3 },
      transitionActions: {
        filterOpenApplied: [
          { type: "open-filter" },
          { type: "draft-lane", payload: { value: "source" } },
          { type: "draft-attention", payload: { value: "needs" } },
          { type: "apply-filters" },
          { type: "open-filter" },
        ],
        sourcePaginationSuccess: [
          { type: "enter-pagination" },
          { type: "load-source" },
          { type: "deliver-source-success" },
          { type: "pagination-duplicate", payload: { lane: "source" } },
        ],
        derivedPaginationSuccess: [
          { type: "enter-pagination" },
          { type: "load-derived" },
          { type: "deliver-derived-success" },
          { type: "pagination-duplicate", payload: { lane: "derived" } },
        ],
        upstreamStatusUnavailable: [{ type: "status-unavailable" }, { type: "retry-status" }],
        scopeSpecificEmpty: [{ type: "scope-empty" }],
      },
      captureScenarioActions: {
        "compact-filtered-open": [
          { type: "open-filter" },
          { type: "draft-lane", payload: { value: "source" } },
          { type: "draft-attention", payload: { value: "needs" } },
          { type: "apply-filters" },
          { type: "open-filter" },
        ],
        "pagination-both-success": [
          { type: "enter-pagination" },
          { type: "load-source" },
          { type: "deliver-source-success" },
          { type: "load-derived" },
          { type: "deliver-derived-success" },
        ],
      },
      files: ["index-v18.html", "app-v18.js", "styles-v18.css", "README-v18.md", "check-v18.mjs", "capture-phase2-evidence-v18.mjs"],
      boundary: "Synthetic deterministic read-only frontend representation in browser memory only.",
    }),
  });

  function visibleFocusable(target) {
    return target instanceof HTMLElement
      && target.getClientRects().length > 0
      && getComputedStyle(target).visibility !== "hidden";
  }

  function eligibleRenderedButton(target) {
    if (!(target instanceof HTMLButtonElement) || !target.isConnected || target.disabled
      || target.getAttribute("aria-disabled") === "true" || target.hidden || target.inert
      || target.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
    const style = getComputedStyle(target);
    const rectangle = target.getBoundingClientRect();
    if (!target.getClientRects().length || style.display === "none"
      || ["hidden", "collapse"].includes(style.visibility) || Number(style.opacity) <= 0
      || rectangle.width <= 0 || rectangle.height <= 0
      || rectangle.bottom <= 0 || rectangle.right <= 0 || rectangle.top >= innerHeight || rectangle.left >= innerWidth) return false;
    const centerX = rectangle.left + rectangle.width / 2;
    const centerY = rectangle.top + rectangle.height / 2;
    if (centerX < 0 || centerX > innerWidth || centerY < 0 || centerY > innerHeight) return false;
    const hit = document.elementFromPoint(centerX, centerY);
    const accessibleName = (target.getAttribute("aria-label") || target.textContent || "").replace(/\s+/g, " ").trim();
    return Boolean(hit && (hit === target || target.contains(hit)) && accessibleName);
  }

  function stickyViewportInset() {
    const topbar = document.querySelector(".lid-topbar-v18");
    if (!(topbar instanceof HTMLElement)) return 12;
    const rect = topbar.getBoundingClientRect();
    const position = getComputedStyle(topbar).position;
    return ["sticky", "fixed"].includes(position) && rect.top <= 1 && rect.bottom > 0
      ? Math.ceil(rect.bottom + 16)
      : 12;
  }

  function focusAndReveal(target) {
    if (!visibleFocusable(target)) return false;
    target.focus({ preventScroll: true });
    const rect = target.getBoundingClientRect();
    const viewportTop = stickyViewportInset();
    const viewportBottom = Math.max(viewportTop + 24, window.innerHeight - 20);
    const available = viewportBottom - viewportTop;
    let delta = 0;
    if (rect.height > available || rect.top < viewportTop) delta = rect.top - viewportTop;
    else if (rect.bottom > viewportBottom) delta = rect.bottom - viewportBottom;
    if (Math.abs(delta) > 0.25) window.scrollBy({ top: delta, behavior: "auto" });
    target.focus({ preventScroll: true });
    return true;
  }

  function scheduleFocusAndReveal(selector) {
    let remaining = 3;
    const restore = () => {
      const target = document.querySelector(selector);
      focusAndReveal(target);
      remaining -= 1;
      if (remaining > 0) requestAnimationFrame(restore);
    };
    requestAnimationFrame(restore);
  }

  function clearPaginationAnchorState(options = {}) {
    const lanes = options.lane ? [options.lane] : ["source", "derived"];
    lanes.forEach((lane) => {
      paginationAnchorBaselines[lane] = null;
      paginationAnchorEvidence[lane] = null;
      if (options.resetGeneration) paginationRequestSerial[lane] = 0;
    });
  }

  function paginationActivation(control) {
    const match = /^(load|retry|duplicate)-(source|derived)$/.exec(String(control?.dataset?.lidAction || ""));
    return match ? { kind: match[1], lane: match[2] } : null;
  }

  function paginationInput(eventObject) {
    if (eventObject.type === "pointerdown") return "pointer";
    if (eventObject.type === "click") return "click-only";
    if (eventObject.type === "keydown" && eventObject.key === " ") return "space";
    if (eventObject.type === "keydown" && eventObject.key === "Enter") return "enter";
    return null;
  }

  function capturePaginationAnchor(eventObject) {
    if (!runtime.isActive("v18") || eventObject.repeat) return;
    const input = paginationInput(eventObject);
    if (!input) return;
    const control = eventObject.target.closest?.("[data-lid-action]");
    const activation = paginationActivation(control);
    if (!activation || !eligibleRenderedButton(control)) {
      ["source", "derived"].forEach((lane) => {
        if (paginationAnchorBaselines[lane] && !paginationAnchorBaselines[lane].confirmed) clearPaginationAnchorState({ lane });
      });
      return;
    }
    const existing = paginationAnchorBaselines[activation.lane];
    if (eventObject.type === "click" && existing && !existing.confirmed
      && existing.kind === activation.kind && existing.controlAction === control.dataset.lidAction) return;
    ["source", "derived"].forEach((lane) => {
      if (paginationAnchorBaselines[lane] && !paginationAnchorBaselines[lane].confirmed) clearPaginationAnchorState({ lane });
    });
    const current = runtime.snapshot("v18");
    const page = current?.pagination?.[activation.lane];
    const validStage = activation.kind === "load" ? page?.stage === "ready"
      : activation.kind === "retry" ? ["failed", "interrupted"].includes(page?.stage)
        : page?.stage === "complete-delivered";
    const boundDuplicateGeneration = activation.kind === "duplicate"
      ? control.dataset.lidRequestGeneration
      : null;
    const expectedDuplicateGeneration = activation.kind === "duplicate"
      ? paginationRequestSerial[activation.lane] + 1
      : null;
    const anchor = document.querySelector(`#lid-v18-load-${activation.lane}`);
    if (!validStage
      || current.scope !== "global"
      || !visibleFocusable(anchor)
      || (activation.kind === "duplicate"
        && (!/^\d+$/.test(String(boundDuplicateGeneration || ""))
          || Number(boundDuplicateGeneration) !== expectedDuplicateGeneration))) {
      clearPaginationAnchorState({ lane: activation.lane });
      return;
    }
    paginationAnchorBaselines[activation.lane] = {
      lane: activation.lane,
      generation: paginationRequestSerial[activation.lane] + 1,
      kind: activation.kind,
      input,
      controlAction: control.dataset.lidAction,
      top: anchor.getBoundingClientRect().top,
      confirmed: false,
      restoring: false,
    };
    paginationAnchorEvidence[activation.lane] = null;
  }

  function confirmPaginationAnchor(control) {
    const activation = paginationActivation(control);
    if (!activation) {
      ["source", "derived"].forEach((lane) => {
        if (paginationAnchorBaselines[lane] && !paginationAnchorBaselines[lane].confirmed) clearPaginationAnchorState({ lane });
      });
      return;
    }
    const retained = paginationAnchorBaselines[activation.lane];
    if (!retained || retained.kind !== activation.kind) return;
    const page = runtime.snapshot("v18")?.pagination?.[activation.lane];
    const expectedStage = activation.kind === "duplicate" ? "complete-duplicate" : "pending";
    if (page?.requestGeneration !== retained.generation || page.stage !== expectedStage) {
      clearPaginationAnchorState({ lane: activation.lane });
      return;
    }
    retained.confirmed = true;
    if (activation.kind === "duplicate") restorePaginationTerminal(activation.lane, retained);
  }

  function terminalPaginationActivation(control) {
    const direct = /^deliver-(source|derived)-(success|failure|interruption)$/.exec(String(control?.dataset?.lidAction || ""));
    if (direct) return { lane: direct[1], outcome: direct[2], type: control.dataset.lidAction };
    const duplicate = /^duplicate-(source|derived)$/.exec(String(control?.dataset?.lidAction || ""));
    return duplicate ? { lane: duplicate[1], outcome: "duplicate", type: control.dataset.lidAction } : null;
  }

  function dispatchBoundPaginationTerminal(eventObject) {
    if (!runtime.isActive("v18")) return;
    const control = eventObject.target.closest?.("[data-lid-action]");
    const terminal = terminalPaginationActivation(control);
    if (!terminal || !eligibleRenderedButton(control)) return;
    const generation = Number(control.dataset.lidRequestGeneration);
    const current = runtime.snapshot("v18");
    const page = current?.pagination?.[terminal.lane];
    const expectedGeneration = terminal.outcome === "duplicate" ? page?.requestGeneration + 1 : page?.requestGeneration;
    const validStage = terminal.outcome === "duplicate" ? page?.stage === "complete-delivered" : page?.stage === "pending";
    if (!Number.isInteger(generation) || generation <= 0 || generation !== expectedGeneration || !validStage) return;
    eventObject.preventDefault();
    eventObject.stopImmediatePropagation();
    runtime.dispatch("v18", terminal.type, { lane: terminal.lane, requestGeneration: generation });
    if (terminal.outcome === "duplicate") confirmPaginationAnchor(control);
  }

  function restorePaginationTerminal(lane, retained) {
    if (retained.restoring) return;
    retained.restoring = true;
    let attempts = 0;
    const align = () => {
      if (paginationAnchorBaselines[lane] !== retained) return;
      const current = runtime.snapshot("v18");
      const page = current?.pagination?.[lane];
      const terminal = page?.terminalGeneration === retained.generation
        && ["failed", "interrupted", "complete-delivered", "complete-duplicate"].includes(page.stage);
      if (!runtime.isActive("v18") || current.scope !== "global" || page?.requestGeneration !== retained.generation || !terminal) {
        clearPaginationAnchorState({ lane });
        return;
      }
      const target = document.querySelector(`#lid-v18-load-${lane}`);
      const isBeginning = ["complete-delivered", "complete-duplicate"].includes(page.stage);
      const validTarget = visibleFocusable(target)
        && (isBeginning ? target.getAttribute("tabindex") === "-1" : target.matches(`button[data-lid-action="retry-${lane}"]`));
      if (!validTarget) {
        clearPaginationAnchorState({ lane });
        return;
      }
      target.focus({ preventScroll: true });
      const beforeAdjustment = target.getBoundingClientRect().top;
      const adjustment = beforeAdjustment - retained.top;
      if (Math.abs(adjustment) > 0.05) window.scrollBy({ top: adjustment, behavior: "auto" });
      target.focus({ preventScroll: true });
      const finalTop = target.getBoundingClientRect().top;
      const delta = finalTop - retained.top;
      attempts += 1;
      if (attempts < 3 || Math.abs(delta) > 1 || document.activeElement !== target) {
        if (attempts < 6) {
          requestAnimationFrame(align);
          return;
        }
        retained.restoring = false;
        paginationAnchorEvidence[lane] = { generation: retained.generation, input: retained.input, beforeTop: retained.top, finalTop, delta, targetId: target.id, terminalStage: page.stage, focused: document.activeElement === target, consumed: false };
        return;
      }
      target.dataset.lidV18AnchorInput = retained.input;
      target.dataset.lidV18AnchorGeneration = String(retained.generation);
      target.dataset.lidV18AnchorBeforeTop = retained.top.toFixed(3);
      target.dataset.lidV18AnchorFinalTop = finalTop.toFixed(3);
      target.dataset.lidV18AnchorDelta = delta.toFixed(3);
      paginationAnchorEvidence[lane] = { generation: retained.generation, input: retained.input, beforeTop: retained.top, finalTop, delta, targetId: target.id, terminalStage: page.stage, focused: true, consumed: true };
      paginationAnchorBaselines[lane] = null;
    };
    align();
  }

  function reconcilePaginationAnchors() {
    if (!runtime.isActive("v18")) {
      clearPaginationAnchorState();
      return;
    }
    const current = runtime.snapshot("v18");
    if (current.scope !== "global") {
      clearPaginationAnchorState();
      return;
    }
    ["source", "derived"].forEach((lane) => {
      const retained = paginationAnchorBaselines[lane];
      if (!retained || !retained.confirmed) return;
      const page = current.pagination[lane];
      if (page.requestGeneration !== retained.generation) {
        clearPaginationAnchorState({ lane });
        return;
      }
      if (page.terminalGeneration === retained.generation) restorePaginationTerminal(lane, retained);
    });
  }

  function createCanonicalEntryPanel() {
    const panel = document.createElement("section");
    panel.id = "lid-v18-canonical-entry-panel";
    panel.className = "lid-v18-canonical-entry-panel";
    panel.setAttribute("aria-labelledby", "lid-v18-canonical-entry-title");
    panel.setAttribute("aria-describedby", "lid-v18-canonical-entry-description");
    panel.innerHTML = `
      <p class="lid-v18-canonical-entry-eyebrow">PROTOTYPE V18 · FIXED SYNTHETIC CONTEXTS</p>
      <h2 id="lid-v18-canonical-entry-title" tabindex="-1">Open canonical History contexts</h2>
      <p id="lid-v18-canonical-entry-description">These controls open the fixed fictional 17 Aug 2026 history for Monsoon walk note. They do not represent the Journal Days, Source Items, generated fields, or artwork shown elsewhere in the frozen v16 archive.</p>
      <ol class="lid-v18-canonical-entry-list" role="list">
        <li>
          <p id="lid-v18-canonical-entry-fact-day" data-lid-v18-canonical-fact><strong>Journal Day</strong> · <time datetime="2026-08-17">17 Aug 2026</time></p>
          <button id="lid-v18-canonical-entry-day" type="button" data-lid-v18-canonical-entry="day" aria-describedby="lid-v18-canonical-entry-fact-day">History &amp; provenance</button>
        </li>
        <li>
          <p id="lid-v18-canonical-entry-fact-item" data-lid-v18-canonical-fact><strong>Source Item</strong> · Monsoon walk note</p>
          <button id="lid-v18-canonical-entry-item" type="button" data-lid-v18-canonical-entry="item" aria-describedby="lid-v18-canonical-entry-fact-item">View source history</button>
        </li>
        <li>
          <p id="lid-v18-canonical-entry-fact-summary" data-lid-v18-canonical-fact><strong>Generated field</strong> · Summary</p>
          <button id="lid-v18-canonical-entry-summary" type="button" data-lid-v18-canonical-entry="field" aria-describedby="lid-v18-canonical-entry-fact-summary">View Summary history</button>
        </li>
        <li>
          <p id="lid-v18-canonical-entry-fact-artwork" data-lid-v18-canonical-fact><strong>Generated Artwork</strong> · Artwork version 2</p>
          <button id="lid-v18-canonical-entry-artwork" type="button" data-lid-v18-canonical-entry="artwork" aria-describedby="lid-v18-canonical-entry-fact-artwork">View artwork history</button>
        </li>
      </ol>`;
    return panel;
  }

  function reconcileCanonicalPanelPlacement() {
    canonicalPanelPlacementQueued = false;
    const prototypeRoot = document.querySelector("#prototype-root");
    const modalRoot = document.querySelector("#modal-root");
    const matches = [...document.querySelectorAll("#lid-v18-canonical-entry-panel")];
    if (!(prototypeRoot instanceof HTMLElement) || !(modalRoot instanceof HTMLElement) || matches.length > 1) {
      canonicalPanelPlacementFailed = true;
      return false;
    }
    if (!canonicalEntryPanel) {
      canonicalEntryPanel = matches.length === 1 ? matches[0] : createCanonicalEntryPanel();
    } else if (matches.length === 1 && matches[0] !== canonicalEntryPanel) {
      canonicalPanelPlacementFailed = true;
      return false;
    }
    if (!(canonicalEntryPanel instanceof HTMLElement) || canonicalEntryPanel.id !== "lid-v18-canonical-entry-panel") {
      canonicalPanelPlacementFailed = true;
      return false;
    }
    if (prototypeRoot.nextElementSibling !== canonicalEntryPanel || canonicalEntryPanel.nextElementSibling !== modalRoot) {
      prototypeRoot.after(canonicalEntryPanel);
    }
    canonicalPanelPlacementFailed = prototypeRoot.nextElementSibling !== canonicalEntryPanel
      || canonicalEntryPanel.nextElementSibling !== modalRoot
      || canonicalEntryPanel.parentElement !== document.body;
    return !canonicalPanelPlacementFailed;
  }

  function queueCanonicalPanelPlacement() {
    if (canonicalPanelPlacementQueued) return;
    canonicalPanelPlacementQueued = true;
    queueMicrotask(reconcileCanonicalPanelPlacement);
  }

  function retireCompatibilityLauncher() {
    const launcher = document.querySelector("#lid-runtime-v17 > .lid-launcher-v17");
    if (!(launcher instanceof HTMLButtonElement)) return false;
    if (!launcher.hidden) launcher.hidden = true;
    if (!launcher.disabled) launcher.disabled = true;
    if (launcher.getAttribute("aria-hidden") !== "true") launcher.setAttribute("aria-hidden", "true");
    if (launcher.tabIndex !== -1) launcher.tabIndex = -1;
    if (!launcher.inert) launcher.inert = true;
    return true;
  }

  function captureEntryReturnAnchor(trigger, launchContext) {
    const rectangle = trigger.getBoundingClientRect();
    entryReturnGeneration += 1;
    entryReturnAnchor = {
      generation: entryReturnGeneration,
      trigger,
      origin: launchContext.origin,
      scope: launchContext.scope,
      canonicalContextToken: launchContext.canonicalContextToken || null,
      scrollY: window.scrollY,
      targetTop: rectangle.top,
      closeMethod: null,
      restorationScheduled: false,
      rootScrollStyle: null,
    };
    entryReturnEvidence = null;
  }

  function eligibleGovernedHistoryTrigger(trigger, launchContext) {
    if (!eligibleRenderedButton(trigger) || !launchContext) return false;
    const token = launchContext.canonicalContextToken;
    if (token) {
      return Object.hasOwn(CANONICAL_ENTRY_MAP, token)
        && canonicalEntryPanel instanceof HTMLElement
        && trigger.closest("#lid-v18-canonical-entry-panel") === canonicalEntryPanel
        && trigger.dataset.lidV18CanonicalEntry === token;
    }
    if (launchContext.scope !== "global" || !["settings", "more"].includes(launchContext.origin)) return false;
    const moreOriginSurface = matchMedia("(max-width: 960px)").matches;
    if (launchContext.origin === "settings") {
      return !moreOriginSurface
        && document.querySelector("#prototype-root")?.contains(trigger)
        && !trigger.closest(".more-management");
    }
    return moreOriginSurface
      && document.querySelector("#modal-root")?.contains(trigger)
      && Boolean(trigger.closest(".more-management"));
  }

  function beginInstantReturnScroll(anchor) {
    if (anchor.rootScrollStyle) return;
    const rootStyle = document.documentElement.style;
    anchor.rootScrollStyle = {
      value: rootStyle.getPropertyValue("scroll-behavior"),
      priority: rootStyle.getPropertyPriority("scroll-behavior"),
    };
    rootStyle.setProperty("scroll-behavior", "auto", "important");
  }

  function endInstantReturnScroll(anchor) {
    if (!anchor.rootScrollStyle) return;
    const rootStyle = document.documentElement.style;
    if (anchor.rootScrollStyle.value) {
      rootStyle.setProperty("scroll-behavior", anchor.rootScrollStyle.value, anchor.rootScrollStyle.priority);
    } else rootStyle.removeProperty("scroll-behavior");
    anchor.rootScrollStyle = null;
  }

  function scheduleEntryReturnRestoration(closeMethod) {
    const anchor = entryReturnAnchor;
    if (!anchor || anchor.restorationScheduled) return;
    anchor.closeMethod = closeMethod;
    anchor.restorationScheduled = true;
    beginInstantReturnScroll(anchor);
    let attempts = 0;
    const restore = () => {
      attempts += 1;
      retireCompatibilityLauncher();
      reconcileCanonicalPanelPlacement();
      const runtimeRoot = document.querySelector("#lid-runtime-v17");
      if (runtimeRoot?.dataset.activeFeature) {
        if (attempts < 8) requestAnimationFrame(restore);
        else {
          endInstantReturnScroll(anchor);
          entryReturnAnchor = null;
        }
        return;
      }
      const sameConnectedInvoker = anchor.trigger instanceof HTMLElement && anchor.trigger.isConnected;
      const fallback = document.querySelector("#lid-v18-canonical-entry-title");
      const target = sameConnectedInvoker ? anchor.trigger : fallback;
      const usedFallback = target !== anchor.trigger;
      if (!(target instanceof HTMLElement)) {
        entryReturnEvidence = {
          generation: anchor.generation,
          origin: anchor.origin,
          scope: anchor.scope,
          canonicalContextToken: anchor.canonicalContextToken,
          closeMethod,
          sameConnectedInvoker: false,
          focused: false,
          usedFallback: true,
          beforeScrollY: anchor.scrollY,
          afterScrollY: window.scrollY,
          scrollDelta: window.scrollY - anchor.scrollY,
          beforeTargetTop: anchor.targetTop,
          afterTargetTop: null,
          targetTopDelta: null,
          consumed: true,
        };
        endInstantReturnScroll(anchor);
        entryReturnAnchor = null;
        return;
      }
      if (usedFallback) {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "nearest", behavior: "auto" });
      } else {
        window.scrollTo({ top: anchor.scrollY, behavior: "auto" });
        target.focus({ preventScroll: true });
        const adjustment = target.getBoundingClientRect().top - anchor.targetTop;
        if (Math.abs(adjustment) > 0.05) window.scrollBy({ top: adjustment, behavior: "auto" });
        target.focus({ preventScroll: true });
      }
      const afterScrollY = window.scrollY;
      const afterTargetTop = target.getBoundingClientRect().top;
      const scrollDelta = afterScrollY - anchor.scrollY;
      const targetTopDelta = afterTargetTop - anchor.targetTop;
      const focused = document.activeElement === target;
      const exact = !usedFallback && sameConnectedInvoker && focused
        && Math.abs(scrollDelta) <= 1
        && Math.abs(targetTopDelta) <= 1;
      if (!exact && !usedFallback && attempts < 8) {
        requestAnimationFrame(restore);
        return;
      }
      entryReturnEvidence = {
        generation: anchor.generation,
        origin: anchor.origin,
        scope: anchor.scope,
        canonicalContextToken: anchor.canonicalContextToken,
        closeMethod,
        sameConnectedInvoker,
        focused,
        usedFallback,
        beforeScrollY: anchor.scrollY,
        afterScrollY,
        scrollDelta,
        beforeTargetTop: anchor.targetTop,
        afterTargetTop,
        targetTopDelta,
        consumed: true,
      };
      endInstantReturnScroll(anchor);
      entryReturnAnchor = null;
    };
    requestAnimationFrame(restore);
  }

  function openGovernedHistoryEntry(eventObject) {
    const eventTarget = eventObject.target instanceof Element ? eventObject.target : null;
    if (!eventTarget || document.querySelector("#lid-runtime-v17")?.dataset.activeFeature) return false;
    const ownedControl = eventTarget.closest("#lid-v18-canonical-entry-panel button[data-lid-v18-canonical-entry]");
    const nativeGlobalControl = eventTarget.closest('[data-action="settings-related"][data-label="History"]');
    let trigger = null;
    let launchContext = null;
    if (ownedControl && ownedControl.closest("#lid-v18-canonical-entry-panel") === canonicalEntryPanel) {
      const token = ownedControl.dataset.lidV18CanonicalEntry;
      const entry = Object.hasOwn(CANONICAL_ENTRY_MAP, token) ? CANONICAL_ENTRY_MAP[token] : null;
      if (!entry) return false;
      trigger = ownedControl;
      launchContext = {
        scope: entry.scope,
        origin: entry.origin,
        field: entry.field,
        canonicalContextToken: token,
      };
    } else if (nativeGlobalControl && (document.querySelector("#prototype-root")?.contains(nativeGlobalControl) || document.querySelector("#modal-root")?.contains(nativeGlobalControl))) {
      trigger = nativeGlobalControl;
      launchContext = {
        scope: "global",
        origin: nativeGlobalControl.closest(".more-management") ? "more" : "settings",
        field: null,
        canonicalContextToken: null,
      };
    }
    if (!(trigger instanceof HTMLButtonElement) || !launchContext || !eligibleGovernedHistoryTrigger(trigger, launchContext)) return false;
    eventObject.preventDefault();
    eventObject.stopImmediatePropagation();
    captureEntryReturnAnchor(trigger, launchContext);
    if (!runtime.openFeature("v18", { trigger, launchContext })) {
      entryReturnAnchor = null;
      return false;
    }
    return true;
  }

  window.addEventListener("click", capturePaginationAnchor, true);
  window.addEventListener("click", dispatchBoundPaginationTerminal, true);

  window.addEventListener("click", (eventObject) => {
    const eventTarget = eventObject.target instanceof Element ? eventObject.target : null;
    if (!eventTarget?.closest('[data-lid-action="close-feature"], [data-lid-action="cancel-feature"]')) return;
    if (runtime.isActive("v18")) scheduleEntryReturnRestoration("back");
    requestAnimationFrame(retireCompatibilityLauncher);
  }, true);

  function shieldActiveHistoryTabFromInheritedModal(eventObject) {
    if (eventObject.key !== "Tab" || !runtime.isActive("v18")) return;
    eventObject.stopPropagation();
  }

  window.addEventListener("keydown", shieldActiveHistoryTabFromInheritedModal, true);

  window.addEventListener("keydown", (eventObject) => {
    if (eventObject.key !== "Escape" || !document.querySelector("#lid-runtime-v17")?.dataset.activeFeature) return;
    if (runtime.isActive("v18")) scheduleEntryReturnRestoration("escape");
    requestAnimationFrame(retireCompatibilityLauncher);
  }, true);

  document.addEventListener("click", (eventObject) => {
    if (openGovernedHistoryEntry(eventObject)) return;
    const runtimeControl = eventObject.target.closest?.("[data-lid-action]");
    if (runtime.isActive("v18") && runtimeControl) {
      const runtimeAction = runtimeControl.dataset.lidAction;
      confirmPaginationAnchor(runtimeControl);
      if (runtimeAction === "set-fixture") {
        runtime.dispatch("v18", "focus-fixture-control", { fixture: runtimeControl.dataset.lidFixture });
        scheduleFocusAndReveal(`[data-lid-fixture="${CSS.escape(runtimeControl.dataset.lidFixture)}"]`);
        const polite = document.querySelector("#lid-status-v17");
        if (polite) polite.textContent = "";
        const branch = runtime.snapshot("v18")?.transitionBranch;
        if (!["failure", "interrupted"].includes(branch)) {
          const alert = document.querySelector("#lid-alert-v17");
          if (alert) alert.textContent = "";
        }
      } else if (runtimeAction === "metadata-stress") {
        runtime.dispatch("v18", "focus-console-control", { action: runtimeAction });
        scheduleFocusAndReveal('[data-lid-action="metadata-stress"]');
      } else {
        const governedFocus = {
          "apply-filters": "#lid-v18-results-title",
          "clear-filters": "#lid-v18-results-title",
          "retry-history": "#lid-v18-results-title",
          "retry-interrupted": "#lid-v18-results-title",
          "retry-status": "#lid-v18-results-title",
          "enter-pagination": "#lid-v18-load-source",
          "scope-empty": "#lid-v18-empty-title",
          "status-unavailable": "#lid-v18-status-unavailable-title",
        }[runtimeAction];
        if (governedFocus) scheduleFocusAndReveal(governedFocus);
      }
    }
    const custom = eventObject.target.closest?.("[data-lid-v18-action]");
    if (!custom || !runtime.isActive("v18")) return;
    eventObject.preventDefault();
    const action = custom.dataset.lidV18Action;
    if (action === "skip-main") {
      const main = document.querySelector("#lid-main-v18");
      const focusMain = () => {
        main?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "auto" });
      };
      focusMain();
      requestAnimationFrame(() => {
        focusMain();
        requestAnimationFrame(focusMain);
      });
    } else if (action === "focus-relation") {
      const key = custom.dataset.lidV18Target;
      runtime.dispatch("v18", "focus-relation", { key });
      scheduleFocusAndReveal(`#lid-v18-event-${CSS.escape(key)}`);
    } else if (action === "open-hidden-day") {
      runtime.dispatch("v18", "open-hidden-day", { scrollY: window.scrollY });
      window.scrollTo({ top: 0, behavior: "auto" });
    } else if (action === "back-history") {
      runtime.dispatch("v18", "back-history", {});
      const pending = runtime.snapshot("v18")?.returnScroll?.pending;
      runtime.dispatch("v18", "consume-return-scroll", {}, { focus: false, preserveFocus: true });
      if (Number.isFinite(pending)) window.scrollTo({ top: pending, behavior: "auto" });
      requestAnimationFrame(() => {
        if (Number.isFinite(pending)) window.scrollTo({ top: pending, behavior: "auto" });
      });
    }
  }, true);

  document.addEventListener("pointerdown", capturePaginationAnchor, true);
  document.addEventListener("keydown", capturePaginationAnchor, true);
  document.addEventListener("pointercancel", () => {
    ["source", "derived"].forEach((lane) => {
      if (paginationAnchorBaselines[lane] && !paginationAnchorBaselines[lane].confirmed) clearPaginationAnchorState({ lane });
    });
  }, true);

  function restoreChangedFilterControl(eventObject) {
    const control = eventObject.target.closest?.(".lid-filter-details-v18 [data-lid-filter-name]");
    if (!control?.id || !runtime.isActive("v18")) return;
    const selector = `#${CSS.escape(control.id)}`;
    scheduleFocusAndReveal(selector);
  }

  document.addEventListener("input", restoreChangedFilterControl, true);
  document.addEventListener("change", restoreChangedFilterControl, true);

  document.addEventListener("toggle", (eventObject) => {
    if (!runtime.isActive("v18") || !(eventObject.target instanceof HTMLDetailsElement)) return;
    const filterDetails = eventObject.target.matches("[data-lid-v18-filter-details]");
    const consoleDetails = eventObject.target.matches("[data-lid-v18-console-details]");
    const eventKey = eventObject.target.dataset.lidV18EventDetails;
    const current = runtime.snapshot("v18");
    if (filterDetails && compactFilterMedia.matches && current.filterOpen !== eventObject.target.open) {
      runtime.dispatch("v18", "set-filter-open", { value: eventObject.target.open }, { focus: false, preserveFocus: true });
    } else if (consoleDetails && current.consoleOpen !== eventObject.target.open) {
      runtime.dispatch("v18", "set-console-open", { value: eventObject.target.open }, { focus: false, preserveFocus: true });
    } else if (eventKey && current.openDisclosureKeys.includes(eventKey) !== eventObject.target.open) {
      runtime.dispatch("v18", "set-disclosure", { key: eventKey, open: eventObject.target.open }, { focus: false, preserveFocus: true });
    }
  }, true);

  const compactFilterMedia = window.matchMedia("(max-width: 1023px)");
  let lastFilterFocus = null;

  function filterFocusToken(active) {
    const filterContainer = active?.closest?.(".lid-filter-details-v18");
    if (!filterContainer) return null;
    return {
      id: active.id || null,
      action: active.dataset?.lidAction || null,
      filterName: active.dataset?.lidFilterName || null,
      summary: active.matches?.(".lid-filter-details-v18 > summary") || false,
      heading: active.id === "lid-v18-filter-title",
    };
  }

  document.addEventListener("focusin", (eventObject) => {
    const active = eventObject.target;
    const token = filterFocusToken(active);
    if (token) lastFilterFocus = token;
    else if (active !== document.body && active !== document.documentElement) lastFilterFocus = null;
  }, true);
  document.addEventListener("pointerdown", (eventObject) => {
    if (!eventObject.target.closest?.(".lid-filter-details-v18")) lastFilterFocus = null;
  }, true);
  compactFilterMedia.addEventListener("change", (mediaEvent) => {
    if (!runtime.isActive("v18")) return;
    const active = document.activeElement;
    const focusToken = filterFocusToken(active) || lastFilterFocus;
    const current = runtime.snapshot("v18");
    const focusWasInsideForm = Boolean(focusToken?.filterName || focusToken?.action);
    if (mediaEvent.matches && focusWasInsideForm && !current.filterOpen) {
      runtime.dispatch("v18", "set-filter-open", { value: true }, { focus: false, preserveFocus: true });
    }
    const restoreResponsiveFilterFocus = () => {
      const panel = document.querySelector(".lid-filter-details-v18");
      if (!(panel instanceof HTMLDetailsElement)) return;
      const snapshot = runtime.snapshot("v18");
      panel.open = mediaEvent.matches ? Boolean(snapshot.filterOpen) : true;
      if (!focusToken) return;
      const target = focusToken.id && !focusToken.summary && !focusToken.heading
        ? panel.querySelector(`#${CSS.escape(focusToken.id)}`)
        : focusToken.filterName
          ? panel.querySelector(`[data-lid-filter-name="${CSS.escape(focusToken.filterName)}"]`)
          : focusToken.action
            ? panel.querySelector(`[data-lid-action="${CSS.escape(focusToken.action)}"]`)
            : panel.querySelector(mediaEvent.matches ? ":scope > summary" : "#lid-v18-filter-title");
      focusAndReveal(target);
    };
    restoreResponsiveFilterFocus();
    requestAnimationFrame(() => {
      restoreResponsiveFilterFocus();
      requestAnimationFrame(() => {
        restoreResponsiveFilterFocus();
        requestAnimationFrame(restoreResponsiveFilterFocus);
      });
    });
  });

  const featureHost = document.querySelector("#lid-feature-host-v17");
  reconcileCanonicalPanelPlacement();
  const canonicalPanelObserver = new MutationObserver(queueCanonicalPanelPlacement);
  canonicalPanelObserver.observe(document.body, { childList: true });
  retireCompatibilityLauncher();

  function reconcileRuntimeLiveRegions() {
    retireCompatibilityLauncher();
    if (!runtime.isActive("v18")) return;
    const current = runtime.snapshot("v18");
    const polite = document.querySelector("#lid-status-v17");
    const alert = document.querySelector("#lid-alert-v17");
    const retainedTopLevelAlert = ["failure", "interrupted"].includes(current.transitionBranch);
    if (current.announcementAssertive || retainedTopLevelAlert) {
      if (polite) polite.textContent = "";
    } else if (current.announcement) {
      if (alert) alert.textContent = "";
    } else {
      if (polite) polite.textContent = "";
      if (alert) alert.textContent = "";
    }
  }

  const liveRegionObserver = new MutationObserver(reconcileRuntimeLiveRegions);
  if (featureHost) liveRegionObserver.observe(featureHost, { childList: true });
  const paginationAnchorObserver = new MutationObserver(reconcilePaginationAnchors);
  if (featureHost) paginationAnchorObserver.observe(featureHost, { childList: true });
})();
