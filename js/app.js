/**
 * app.js — UI rendering, event wiring, and PWA installation.
 *
 * Depends on (loaded before this script):
 *   visuals.js  → V (visual-cue map)
 *   data.js     → DAYS[] training plan
 */

// ── DOM references ─────────────────────────────────────────────────────────

const tabsEl    = document.getElementById('dayTabs');
const contentEl = document.getElementById('content');

// ── State ──────────────────────────────────────────────────────────────────

// Map Sunday (0) → index 6; Mon–Sat → 0–5. Cap at 6.
let todayIdx   = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6);
let currentIdx = todayIdx;

// ── Rendering ──────────────────────────────────────────────────────────────

function renderTabs() {
  tabsEl.innerHTML = DAYS.map((d, i) =>
    `<div class="day-tab ${i === todayIdx ? 'active' : ''} ${d.isRest ? 'rest' : ''}" data-idx="${i}">${d.tab}</div>`
  ).join('');
}

/** Returns the HTML for one exercise's visual-cue block (or empty string). */
function renderVis(key) {
  const v = V[key];
  if (!v) return '';
  const positions = v.p.map(p =>
    `<div class="visual-pos">${p.s}<div class="pos-label">${p.l}</div></div>`
  ).join('');
  return `<div class="visual-cue"><div class="visual-positions">${positions}</div></div>`;
}

/** Returns the full HTML string for a given day. */
function renderDay(day) {
  if (day.isRest) {
    return `<div class="day-view active">
      <div class="rest-day">
        <div class="rest-icon">◌</div>
        <h2>Rest &amp; Recovery</h2>
        <p>Walk, stretch, nothing structured.<br>Recovery is where adaptation happens.</p>
      </div>
      <div class="period-info">
        <div class="period-title">4-Week Periodization</div>
        <div class="period-weeks">
          <div class="period-week active-week">W1 Moderate</div>
          <div class="period-week">W2 Hard</div>
          <div class="period-week">W3 Very Hard</div>
          <div class="period-week">W4 Deload</div>
        </div>
      </div>
    </div>`;
  }

  const exercises = day.exercises.map((ex, i) => `
    <div class="exercise-card" data-exidx="${i}">
      <div class="exercise-header">
        <div class="exercise-num">${i + 1}</div>
        <div class="exercise-info">
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-prescription">${ex.rx}</div>
        </div>
        ${ex.n ? '<div class="tag-new">New</div>' : ''}
        <svg class="exercise-chevron" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <div class="exercise-details">
        ${ex.vi ? renderVis(ex.vi) : ''}
        <div class="detail-section">
          <div class="detail-label">Why</div>
          <div class="detail-text">${ex.why}</div>
        </div>
        <div class="detail-section">
          <div class="detail-label">Cues</div>
          <div class="detail-text">${ex.cues}</div>
        </div>
        <div class="detail-section">
          <div class="detail-label">Progression</div>
          <div class="detail-text dim">${ex.prog}</div>
        </div>
        ${ex.yt || ''}
      </div>
    </div>`).join('');

  const notesHtml = day.notes
    ? `<div class="day-notes"><strong>Note</strong><br>${day.notes}</div>`
    : '';

  return `<div class="day-view active">
    <div class="day-header">
      <div class="day-name">${day.name}</div>
      <div class="day-focus">${day.focus}</div>
      <div class="day-duration">${day.duration}</div>
    </div>
    ${exercises}
    ${notesHtml}
  </div>`;
}

// ── Navigation ─────────────────────────────────────────────────────────────

function showDay(idx) {
  currentIdx = idx;
  document.querySelectorAll('.day-tab').forEach((t, i) =>
    t.classList.toggle('active', i === idx)
  );
  contentEl.innerHTML = renderDay(DAYS[idx]);
  contentEl.scrollTop = 0;
  contentEl.querySelectorAll('.exercise-card').forEach(card =>
    card.querySelector('.exercise-header').addEventListener('click', () =>
      card.classList.toggle('expanded')
    )
  );
}

// ── Initialise ─────────────────────────────────────────────────────────────

renderTabs();
showDay(todayIdx);

// ── Tab click ──────────────────────────────────────────────────────────────

tabsEl.addEventListener('click', e => {
  const t = e.target.closest('.day-tab');
  if (t) {
    showDay(parseInt(t.dataset.idx, 10));
    t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
});

// ── Swipe gesture (mobile) ─────────────────────────────────────────────────

let touchStartX = 0;

contentEl.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

contentEl.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(delta) > 60) {
    if (delta > 0 && currentIdx < 6) currentIdx++;
    else if (delta < 0 && currentIdx > 0) currentIdx--;
    showDay(currentIdx);
    tabsEl.children[currentIdx]?.scrollIntoView({
      behavior: 'smooth', inline: 'center', block: 'nearest',
    });
  }
}, { passive: true });

// ── PWA install banner ─────────────────────────────────────────────────────

let deferredPrompt;
const installBanner = document.getElementById('installBanner');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.classList.add('show');
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
  installBanner.classList.remove('show');
});

document.getElementById('dismissBtn').addEventListener('click', () =>
  installBanner.classList.remove('show')
);

// ── Service Worker ─────────────────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
