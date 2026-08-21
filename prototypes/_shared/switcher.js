/* Life in Days — variant switcher
 * PROTOTYPE ARTIFACT. Floating bottom bar per the `prototype` skill's UI
 * branch: ?variant= in the URL, arrow keys to cycle, ignored while typing.
 */

function initSwitcher(variants, onChange) {
  const params = new URLSearchParams(location.search);
  let current = variants.findIndex(v => v.key === params.get('variant'));
  if (current === -1) current = 0;

  const bar = document.createElement('div');
  bar.className = 'lid-chrome lid-switcher';
  bar.innerHTML = `
    <button type="button" data-dir="-1" aria-label="Previous variant">←</button>
    <span class="variant-label" aria-live="polite"></span>
    <button type="button" data-dir="1" aria-label="Next variant">→</button>
    <span class="hint">variant switcher — review tool, not part of the design</span>
  `;
  document.body.appendChild(bar);
  const label = bar.querySelector('.variant-label');

  function apply() {
    const v = variants[current];
    label.textContent = `${v.key} (${v.name})`;
    const params = new URLSearchParams(location.search);
    params.set('variant', v.key);
    history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
    onChange(v);
  }

  bar.querySelectorAll('button[data-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
      current = (current + Number(btn.dataset.dir) + variants.length) % variants.length;
      apply();
    });
  });

  document.addEventListener('keydown', (e) => {
    const el = document.activeElement;
    const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    if (typing) return;
    // The calendar grid uses plain arrow keys to move between days (UX-CAL-10).
    // Yield to it whenever focus is inside the app, not the switcher chrome —
    // only cycle variants when nothing in the design itself wants the key.
    const insideApp = el && el.closest && el.closest('[data-lid-app]');
    if (insideApp) return;
    if (e.key === 'ArrowLeft' && !e.altKey && !e.metaKey && !e.ctrlKey) {
      current = (current - 1 + variants.length) % variants.length;
      apply();
    } else if (e.key === 'ArrowRight' && !e.altKey && !e.metaKey && !e.ctrlKey) {
      current = (current + 1) % variants.length;
      apply();
    }
  });

  apply();
}
