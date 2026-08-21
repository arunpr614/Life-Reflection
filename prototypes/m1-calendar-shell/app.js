/* Life in Days — M1 Calendar shell + month view
 * PROTOTYPE ARTIFACT · fictional data · in-memory only · not production.
 * Milestone: M1. Issues: #187, #189, #195.
 * Three structurally distinct variants of the shell + calendar, switchable
 * via the ?variant= bar. See docs/design/M1-BUILD-INSTRUCTIONS.md.
 */

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const F = window.LID_FIXTURES;

const state = {
  monthKey: '2026-08',
  selectedDay: null,
  demo: 'normal', // normal | single-day | loading | error | first-use
  theme: 'light',
  focusDate: null // date string that should receive DOM focus after re-render
};

function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

function monthData(monthKey) {
  if (state.demo === 'single-day') return F.singleDayMonth;
  return F.months[monthKey] || { label: `${MONTH_NAMES[Number(monthKey.split('-')[1]) - 1]} ${monthKey.split('-')[0]}`, days: {} };
}

function buildGrid(monthKey) {
  const [y, m] = monthKey.split('-').map(Number);
  const data = monthData(monthKey);
  const first = new Date(y, m - 1, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${monthKey}-${String(d).padStart(2, '0')}`;
    const entries = data.days[date] || [];
    cells.push({
      date, entries,
      isToday: date === F.today,
      isFuture: date > F.today,
      inMonth: true
    });
  }
  while (cells.length % 7 !== 0) cells.push({ blank: true });
  return { cells, label: data.label };
}

function dayCounts(entries) {
  const photos = entries.reduce((n, e) => n + e.photos.length, 0);
  return { photos, journals: entries.length };
}

function accessibleName(cell) {
  if (cell.blank) return '';
  const dateLabel = fmtDate(cell.date);
  if (!cell.entries.length) return cell.isFuture ? `${dateLabel}, no Journal Day yet` : `${dateLabel}, no Journal Day`;
  const { photos, journals } = dayCounts(cell.entries);
  const parts = [dateLabel];
  parts.push(photos === 1 ? '1 photo' : `${photos} photos`);
  parts.push(journals === 1 ? '1 journal' : `${journals} journals`);
  const title = cell.entries[0].title;
  // WCAG 2.5.3 (Label in Name): when a tile shows visible title text, the
  // accessible name must contain it, not just the UX-CAL-11 count summary.
  if (title) parts.push(title);
  return parts.join(', ');
}

function coverStyle(photo) {
  if (!photo) return '';
  const light = photo.tone === 'light' ? 82 : photo.tone === 'dark' ? 30 : 55;
  return `background: linear-gradient(155deg, hsl(${photo.hue} 28% ${light + 12}%), hsl(${(photo.hue + 30) % 360} 34% ${light - 14}%));`;
}

function weekOfToday(cells) {
  const idx = cells.findIndex(c => c.isToday);
  return idx === -1 ? -1 : Math.floor(idx / 7);
}

/* ---------- tile rendering, one function per variant ---------- */

function tileA(cell) {
  if (cell.blank) return '<div class="tile tile--blank" aria-hidden="true"></div>';
  const name = accessibleName(cell);
  if (!cell.entries.length) {
    const cls = cell.isFuture ? 'tile tile--quiet tile--future' : 'tile tile--quiet';
    return `<button type="button" class="${cls}" data-date="${cell.date}" aria-label="${name}"><span class="tile__date">${Number(cell.date.slice(-2))}</span></button>`;
  }
  const cover = cell.entries[0].photos[0];
  const style = cover ? coverStyle(cover) : '';
  const covered = cover ? 'tile--cover' : 'tile--day';
  const today = cell.isToday ? ' tile--today' : '';
  const { title } = cell.entries[0];
  // A visible fallback string here would need to appear in the accessible
  // name too (WCAG 2.5.3); keep any no-title marker decorative instead.
  const titleHtml = cover ? '' : title ? `<span class="tile__title">${title}</span>` : '<span class="tile__mark" aria-hidden="true"></span>';
  return `<button type="button" class="tile ${covered}${today}" style="${style}" data-date="${cell.date}" aria-label="${name}">
    <span class="tile__date">${Number(cell.date.slice(-2))}</span>
    ${titleHtml}
  </button>`;
}

function tileB(cell) {
  if (cell.blank) return '<div class="tile tile--blank" aria-hidden="true"></div>';
  const name = accessibleName(cell);
  const dateNum = `<span class="tile__date">${Number(cell.date.slice(-2))}</span>`;
  if (!cell.entries.length) {
    const cls = cell.isFuture ? 'tile tile--quiet tile--future' : 'tile tile--quiet';
    return `<button type="button" class="${cls}" data-date="${cell.date}" aria-label="${name}">${dateNum}</button>`;
  }
  const { title } = cell.entries[0];
  const cover = cell.entries[0].photos[0];
  const today = cell.isToday ? ' tile--today' : '';
  const coverHtml = cover ? `<span class="tile__coverbox" style="${coverStyle(cover)}"></span>` : '<span class="tile__coverbox tile__coverbox--empty"></span>';
  const titleHtml = title ? `<span class="tile__title">${title}</span>` : '';
  return `<button type="button" class="tile tile--day tile--editorial${today}" data-date="${cell.date}" aria-label="${name}">
    ${dateNum} ${coverHtml} ${titleHtml}
  </button>`;
}

function tileC(cell, emphasize) {
  if (cell.blank) return '<div class="tile tile--blank" aria-hidden="true"></div>';
  const name = accessibleName(cell);
  const dateNum = `<span class="tile__date">${Number(cell.date.slice(-2))}</span>`;
  const emphCls = emphasize ? ' tile--thisweek' : '';
  if (!cell.entries.length) {
    const cls = cell.isFuture ? 'tile tile--quiet tile--future' : 'tile tile--quiet';
    return `<button type="button" class="${cls}${emphCls}" data-date="${cell.date}" aria-label="${name}">${dateNum}</button>`;
  }
  const { title } = cell.entries[0];
  const cover = cell.entries[0].photos[0];
  const today = cell.isToday ? ' tile--today' : '';
  const badge = cover
    ? `<span class="tile__badge" style="${coverStyle(cover)}"></span>`
    : `<span class="tile__badge tile__badge--empty"></span>`;
  const titleHtml = title ? `<span class="tile__title">${title}</span>` : '';
  return `<button type="button" class="tile tile--day tile--ledger${today}${emphCls}" data-date="${cell.date}" aria-label="${name}">
    ${badge} ${dateNum} ${titleHtml}
  </button>`;
}

/* ---------- rail, one per variant ---------- */

function railA() {
  return `
    <div class="rail__brand">Life in Days</div>
    <nav class="rail__nav" aria-label="Primary">
      <a class="rail__item rail__item--active" href="#" aria-current="page">Calendar</a>
    </nav>`;
}

function railB() {
  const g = buildGrid(state.monthKey);
  const journaled = g.cells.filter(c => !c.blank && c.entries.length).length;
  const photos = g.cells.reduce((n, c) => n + (c.blank ? 0 : dayCounts(c.entries).photos), 0);
  const ndr = F.needsDateReview.length;
  return `
    <div class="rail__brand">Life in Days</div>
    <nav class="rail__nav" aria-label="Primary">
      <a class="rail__item rail__item--active" href="#" aria-current="page">Calendar</a>
    </nav>
    <dl class="rail__stats">
      <dt>This month</dt>
      <dd>${journaled} journaled days · ${photos} photos</dd>
    </dl>
    ${ndr ? `<a class="rail__item rail__item--muted" href="#" data-stub="needs-date-review">Needs Date Review <span class="rail__count">${ndr}</span></a>` : ''}`;
}

function railC() {
  return `
    <div class="rail__brand">Life in Days</div>
    <nav class="rail__nav" aria-label="Primary">
      <a class="rail__item rail__item--active" href="#" aria-current="page">Calendar</a>
    </nav>
    <div class="rail__later">
      <p class="rail__later-label">Coming later</p>
      <p class="rail__later-list">Almanac · Search · Settings · History · Trash · Export</p>
    </div>`;
}

/* ---------- margin (Museum Margin) ---------- */

function renderMargin(cell) {
  const { photos, journals } = dayCounts(cell.entries);
  const cover = cell.entries[0].photos[0]
    ? `${photos} Daily Photo${photos === 1 ? '' : 's'}`
    : 'No cover image · journal only';
  return `
    <aside class="margin" data-lid-app>
      <p class="margin__label">Selected Journal Day</p>
      <p class="margin__date">${fmtDate(cell.date).replace(/^(\S+ )/, '$1<br>')}</p>
      <dl>
        <dt>Calendar Cover</dt>
        <dd>${cover}</dd>
        <dt>Source Items</dt>
        <dd>${journals} Uploaded journal${journals === 1 ? '' : 's'}, ${photos} Daily Photo${photos === 1 ? '' : 's'}</dd>
      </dl>
      <div class="margin__preview">
        <h3>${cell.entries[0].title || 'Untitled Journal Day'}</h3>
        <p>${(cell.entries[0].journal || '').slice(0, 220)}${(cell.entries[0].journal || '').length > 220 ? '…' : ''}</p>
        <p class="margin__note">Full Journal Day detail is designed in M2. This preview uses the Calendar's own selection treatment.</p>
      </div>
      <button type="button" class="btn btn--quiet margin__close" data-action="close-day">Close</button>
    </aside>`;
}

/* ---------- top-level render ---------- */

function render() {
  const app = document.getElementById('app');
  const variant = document.body.dataset.variant;
  const grid = buildGrid(state.monthKey);
  const thisWeek = weekOfToday(grid.cells);

  const railHtml = variant === 'a' ? railA() : variant === 'b' ? railB() : railC();

  let mainHtml;
  if (state.demo === 'first-use') {
    mainHtml = `
      <div class="first-use">
        <h1 class="first-use__title">Your archive begins here.</h1>
        <p class="first-use__body">Nothing has been journaled yet. Upload your first Journal Day to start the archive.</p>
        <button type="button" class="btn" data-action="stub-upload">Upload journal</button>
      </div>`;
  } else if (state.demo === 'loading') {
    mainHtml = `
      <div class="month-header month-header--loading">
        <span class="t-month">${grid.label}</span>
      </div>
      <div class="grid-fragment" aria-hidden="true">
        ${WEEKDAYS.map(w => `<div class="weekday">${w}</div>`).join('')}
        ${grid.cells.map(() => '<div class="tile tile--skeleton"></div>').join('')}
      </div>`;
  } else {
    const errorBanner = state.demo === 'error'
      ? `<div class="error-banner" role="alert">Couldn't load ${grid.label}. Settled content below may be stale.
          <button type="button" class="btn btn--quiet" data-action="retry">Retry</button></div>`
      : '';
    const noData = !state.demo.match(/error/) && grid.cells.every(c => c.blank || !c.entries.length)
      ? '<p class="no-days-note">No journaled days in this month.</p>' : '';

    const tileFn = variant === 'a' ? tileA : variant === 'b' ? tileB : (c, i) => tileC(c, Math.floor(grid.cells.indexOf(c) / 7) === thisWeek);

    mainHtml = `
      <div class="month-header">
        <button type="button" class="btn btn--quiet" data-action="prev-month" aria-label="Previous month">←</button>
        <span class="t-month" data-action="month-picker">${grid.label}</span>
        <button type="button" class="btn btn--quiet" data-action="next-month" aria-label="Next month">→</button>
        <button type="button" class="btn btn--quiet month-header__today" data-action="today">Today</button>
      </div>
      ${errorBanner}
      <div class="grid-fragment${state.demo === 'error' ? ' grid-fragment--dimmed' : ''}" aria-label="${grid.label}, calendar">
        ${WEEKDAYS.map(w => `<div class="weekday">${w}</div>`).join('')}
        ${grid.cells.map(c => tileFn(c)).join('')}
      </div>
      ${noData}`;
  }

  const selectedCell = state.selectedDay ? grid.cells.find(c => c.date === state.selectedDay && c.entries.length) : null;
  const marginHtml = selectedCell ? renderMargin(selectedCell) : '';
  const stageClass = selectedCell ? 'stage stage--selected' : 'stage';

  app.innerHTML = `
    <a class="skip-link" href="#lid-main">Skip to calendar</a>
    <div class="shell" data-lid-app>
      <aside class="rail" aria-label="Application">${railHtml}</aside>
      <div class="${stageClass}">
        <main class="main" id="lid-main">${mainHtml}</main>
        ${marginHtml}
      </div>
    </div>`;

  wireEvents();
  if (state.focusDate) {
    const el = app.querySelector(`[data-date="${state.focusDate}"]`);
    if (el) el.focus();
    state.focusDate = null;
  }
}

/* ---------- interaction ---------- */

function setDay(date, focus) {
  const params = new URLSearchParams(location.search);
  if (date) params.set('day', date); else params.delete('day');
  history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
  state.selectedDay = date;
  if (focus) state.focusDate = date;
  render();
}

function changeMonth(delta) {
  const focused = document.activeElement && document.activeElement.dataset.date;
  const dayOfMonth = focused ? Number(focused.slice(-2)) : 1;
  const [y, m] = state.monthKey.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  state.monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  state.selectedDay = null;
  const daysInNewMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  state.focusDate = focused ? `${state.monthKey}-${String(Math.min(dayOfMonth, daysInNewMonth)).padStart(2, '0')}` : null;
  render();
}

function allDates(grid) { return grid.cells.map(c => c.blank ? null : c.date); }

function focusDate(date) {
  const el = document.querySelector(`[data-date="${date}"]`);
  if (el) el.focus();
}

function moveFocus(delta) {
  const grid = buildGrid(state.monthKey);
  const dates = allDates(grid);
  const idx = dates.indexOf(document.activeElement.dataset.date);
  if (idx === -1) return;
  let next = idx + delta;
  const step = Math.sign(delta) || 1;
  while (next >= 0 && next < dates.length && dates[next] === null) next += step;
  if (next < 0 || next >= dates.length || dates[next] === null) return;
  focusDate(dates[next]);
}

function moveToRowEdge(toStart) {
  const grid = buildGrid(state.monthKey);
  const dates = allDates(grid);
  const idx = dates.indexOf(document.activeElement.dataset.date);
  if (idx === -1) return;
  const row = Math.floor(idx / 7);
  let target = toStart ? row * 7 : row * 7 + 6;
  const step = toStart ? 1 : -1;
  while (target >= 0 && target < dates.length && dates[target] === null) target += step;
  if (target < 0 || target >= dates.length || dates[target] === null) return;
  focusDate(dates[target]);
}

function wireEvents() {
  const app = document.getElementById('app');
  app.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-date]');
    if (tile) {
      const grid = buildGrid(state.monthKey);
      const cell = grid.cells.find(c => c.date === tile.dataset.date);
      if (cell && cell.entries.length) setDay(cell.date, false);
      return;
    }
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'prev-month') changeMonth(-1);
    else if (action === 'next-month') changeMonth(1);
    else if (action === 'today') { state.monthKey = F.today.slice(0, 7); state.selectedDay = null; state.focusDate = F.today; render(); }
    else if (action === 'close-day') setDay(null, false);
    else if (action === 'retry') { state.demo = 'normal'; render(); }
    else if (action === 'stub-upload' || action === 'needs-date-review') announce('Designed in M4 — Upload a journal from the browser.');
  });

  app.addEventListener('keydown', (e) => {
    const tile = e.target.closest('.tile[data-date]');
    if (!tile) return;
    const map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    if (map[e.key] !== undefined) { e.preventDefault(); moveFocus(map[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); moveToRowEdge(true); }
    else if (e.key === 'End') { e.preventDefault(); moveToRowEdge(false); }
    else if (e.key === 'PageUp') { e.preventDefault(); changeMonth(-1); }
    else if (e.key === 'PageDown') { e.preventDefault(); changeMonth(1); }
    else if ((e.key === 'Enter' || e.key === ' ') && tile.classList.contains('tile--quiet')) {
      e.preventDefault();
    }
  });
}

function announce(msg) {
  let live = document.getElementById('lid-announce');
  if (!live) {
    live = document.createElement('div');
    live.id = 'lid-announce';
    live.className = 'visually-hidden';
    live.setAttribute('role', 'status');
    document.body.appendChild(live);
  }
  live.textContent = msg;
}

/* ---------- chrome: theme + demo-state controls ---------- */

function initControls() {
  const wrap = document.createElement('div');
  wrap.className = 'lid-chrome lid-controls';
  wrap.innerHTML = `
    <label class="visually-hidden" for="lid-state">Demo state</label>
    <select id="lid-state" title="Demo state">
      <option value="normal">Normal</option>
      <option value="single-day">Single day</option>
      <option value="first-use">First use</option>
      <option value="loading">Loading</option>
      <option value="error">Failed to load</option>
    </select>
    <button type="button" id="lid-theme">Use dark theme</button>
  `;
  document.body.appendChild(wrap);
  wrap.querySelector('#lid-state').addEventListener('change', (e) => {
    state.demo = e.target.value;
    if (state.demo === 'single-day') state.monthKey = '2026-08';
    render();
  });
  wrap.querySelector('#lid-theme').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = state.theme;
    wrap.querySelector('#lid-theme').textContent = state.theme === 'dark' ? 'Use light theme' : 'Use dark theme';
  });
}

function boot(variant) {
  document.body.dataset.variant = variant.key;
  const params = new URLSearchParams(location.search);
  const day = params.get('day');
  if (day) { state.selectedDay = day; state.monthKey = day.slice(0, 7); }
  render();
}

const VARIANTS = [
  { key: 'a', name: 'Contact Sheet' },
  { key: 'b', name: 'Editorial' },
  { key: 'c', name: 'Ledger' }
];

initControls();
initSwitcher(VARIANTS, boot);
