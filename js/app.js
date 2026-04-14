/**
 * app.js — UI rendering, event wiring, and PWA installation.
 *
 * Depends on (loaded before this script):
 *   data.js  → DAYS[] training plan
 */

// ── DOM references ─────────────────────────────────────────────────────────

const tabsEl    = document.getElementById('dayTabs');
const contentEl = document.getElementById('content');

// ── State ──────────────────────────────────────────────────────────────────

// Map Sunday (0) → index 6; Mon–Sat → 0–5. Cap at 6.
let todayIdx   = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6);
let currentIdx = todayIdx;

// ── Workout Values Storage ─────────────────────────────────────────────────

let workoutWeights = JSON.parse(localStorage.getItem('workoutWeights')) || {};

/**
 * Parses the leading set count from an rx string.
 * Matches: "4 × 6", "3 rds", "3 rounds", "3 sets".
 */
function getSetsCount(rx) {
  const match = rx.match(/(\d+)\s*([×x]|rds|rounds|sets)\s*/i);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Retrieves the stored value for a given set, falling back to the
 * exercise's recommended value (from data.js) so inputs are pre-filled.
 */
function getStoredValue(key, setIdx, recommended) {
  const saved = workoutWeights[key];
  if (saved && saved[setIdx] !== undefined && saved[setIdx] !== '') {
    return saved[setIdx];
  }
  return recommended !== undefined ? recommended : '';
}

window.stepValue = function(dayId, exIdx, setIdx, delta, recommended) {
  const key = `${dayId}_${exIdx}`;
  if (!workoutWeights[key]) workoutWeights[key] = [];

  const current = parseFloat(workoutWeights[key][setIdx] ?? recommended ?? 0);
  const next    = Math.max(0, Math.round((current + delta) * 100) / 100);

  workoutWeights[key][setIdx] = next;
  localStorage.setItem('workoutWeights', JSON.stringify(workoutWeights));

  // Update only the display value in the DOM — no full re-render.
  const display = document.getElementById(`val-${dayId}-${exIdx}-${setIdx}`);
  if (display) display.textContent = next;
};

window.updateDirect = function(dayId, exIdx, setIdx, value) {
  const key = `${dayId}_${exIdx}`;
  if (!workoutWeights[key]) workoutWeights[key] = [];
  workoutWeights[key][setIdx] = value === '' ? '' : parseFloat(value) || value;
  localStorage.setItem('workoutWeights', JSON.stringify(workoutWeights));
};

// ── Rendering ──────────────────────────────────────────────────────────────

const defaultProfile = {
  age:     { label: 'Age',        val: 51,   unit: '' },
  weight:  { label: 'Weight',     val: 91,   unit: 'kg' },
  height:  { label: 'Height',     val: 1.93, unit: 'm' },
  vo2max:  { label: 'VO2max',     val: 50,   unit: '' },
  bench:   { label: 'Bench 1RM',  val: 100,  unit: 'kg' },
  pullups: { label: 'Pull-ups',   val: 12,   unit: 'reps' },
};

let profile = JSON.parse(localStorage.getItem('athleteProfile'));
if (!profile) {
  profile = JSON.parse(JSON.stringify(defaultProfile));
} else {
  for (const key in defaultProfile) {
    if (profile[key] === undefined) profile[key] = defaultProfile[key];
  }
}

window.editProfile = function(key) {
  const item  = profile[key];
  const input = prompt(`Enter new value for ${item.label}:`, item.val);
  if (input !== null && input.trim() !== '') {
    item.val = isNaN(Number(input)) ? input : Number(input);
    localStorage.setItem('athleteProfile', JSON.stringify(profile));
    if (currentIdx === 7) showDay(7);
  }
};

function renderProfile() {
  const cards = Object.keys(profile).map(k => {
    const p = profile[k];
    return `<div class="profile-card" onclick="editProfile('${k}')">
      <div class="profile-val">${p.val}<span class="profile-unit">${p.unit}</span></div>
      <div class="profile-label">${p.label}</div>
    </div>`;
  }).join('');

  return `<div class="day-view active">
    <div class="day-header">
      <div class="day-name">Athlete Profile</div>
      <div class="day-focus">Tap numbers to adjust measurements</div>
    </div>
    <div class="profile-grid">
      ${cards}
    </div>
  </div>`;
}

function renderTabs() {
  const daysHtml = DAYS.map((d, i) =>
    `<div class="day-tab ${i === todayIdx ? 'active' : ''} ${d.isRest ? 'rest' : ''}" data-idx="${i}">${d.tab}</div>`
  ).join('');
  const profileHtml = `<div class="day-tab ${todayIdx === 7 ? 'active' : ''}" data-idx="7">Profile</div>`;
  tabsEl.innerHTML = daysHtml + profileHtml;
}

/**
 * Builds one stepper tile for a single set.
 *
 * Layout:
 *   SET N
 *   [−]   VALUE   [+]
 *     unit · rec: X
 */
function renderStepper(day, exIdx, setIdx, ex) {
  const key     = `${day.id}_${exIdx}`;
  const rec     = ex.recommended;
  const step    = ex.step ?? 1;
  const unit    = ex.unit || '';
  const val     = getStoredValue(key, setIdx, rec);
  const displayVal = val !== '' ? val : (rec !== undefined ? rec : '—');

  // Decide label based on unit type
  const isTime = (unit === 'sec' || unit === 'min');
  const setLabel = isTime ? `Set ${setIdx + 1}` : `Set ${setIdx + 1}`;

  const recHint = rec !== undefined
    ? `<div class="stepper-rec">rec: ${rec}${unit ? ' ' + unit : ''}</div>`
    : '';

  return `
    <div class="set-stepper">
      <div class="stepper-label">${setLabel}</div>
      <div class="stepper-controls">
        <button class="stepper-btn minus"
          onclick="stepValue('${day.id}', ${exIdx}, ${setIdx}, ${-step}, ${rec ?? 0})">−</button>
        <div class="stepper-value">
          <span class="stepper-num" id="val-${day.id}-${exIdx}-${setIdx}">${displayVal}</span>
          <span class="stepper-unit">${unit}</span>
        </div>
        <button class="stepper-btn plus"
          onclick="stepValue('${day.id}', ${exIdx}, ${setIdx}, ${step}, ${rec ?? 0})">+</button>
      </div>
      ${recHint}
    </div>`;
}

/**
 * Renders a self-contained interval timer panel for the given exercise.
 * Phase colours and labels change automatically as the timer runs.
 */
function renderTimer(ex, dayId, exIdx) {
  // Use stored overrides if present, otherwise exercise defaults
  const cfg     = getTimerConfig(dayId, exIdx);
  const totalMin = Math.ceil(cfg.rounds * (cfg.work + cfg.rest) / 60);
  const id      = `timer-${dayId}-${exIdx}`;

  // Tiny inline stepper for a single timer parameter
  const paramStepper = (param, label, val, delta) => `
    <div class="tcfg-item">
      <div class="tcfg-label">${label}</div>
      <div class="tcfg-row">
        <button class="tcfg-btn"
          onclick="stepTimerParam('${dayId}', ${exIdx}, '${param}', ${-delta})">&#8722;</button>
        <span class="tcfg-val" id="tcfg-${param}-${dayId}-${exIdx}">${val}</span>
        <button class="tcfg-btn"
          onclick="stepTimerParam('${dayId}', ${exIdx}, '${param}', ${delta})">+</button>
      </div>
    </div>`;

  return `
    <div class="timer-panel" id="${id}" data-phase="idle">
      <div class="timer-meta">
        <span class="timer-round">Round 1 / ${cfg.rounds}</span>
        <span class="timer-total">~${totalMin} min total</span>
      </div>
      <div class="timer-phase">${cfg.workLabel || 'WORK'}</div>
      <div class="timer-count">${timerFmt(cfg.work)}</div>
      <div class="timer-legend">
        <span class="legend-work">${cfg.workLabel || 'WORK'} ${cfg.work}s</span>
        <span class="legend-divider">/</span>
        <span class="legend-rest">${cfg.restLabel || 'REST'} ${cfg.rest}s</span>
      </div>
      <div class="timer-controls">
        <button class="timer-btn timer-reset-btn"
          onclick="timerReset('${dayId}', ${exIdx})">↺</button>
        <button class="timer-btn timer-start-btn"
          onclick="timerStart('${dayId}', ${exIdx})">▶ Start</button>
      </div>
      <div class="timer-config">
        ${paramStepper('rounds', 'Rounds', cfg.rounds,    1)}
        <div class="tcfg-divider"></div>
        ${paramStepper('work',   'Work',   cfg.work + 's', 5)}
        <div class="tcfg-divider"></div>
        ${paramStepper('rest',   'Rest',   cfg.rest + 's', 5)}
      </div>
    </div>`;
}

/**
 * Returns the full HTML string for a given day.
 */
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

  const exercises = day.exercises.map((ex, i) => {
    const setsCount = getSetsCount(ex.rx);
    const unit      = ex.unit !== undefined ? ex.unit : 'kg';

    let trackLabel = 'Records';
    if (unit === 'reps')                    trackLabel = 'Rep Count';
    else if (unit === 'sec' || unit === 'min') trackLabel = 'Time';
    else if (unit === 'km' || unit === 'm') trackLabel = 'Distance';
    else if (unit === 'level')              trackLabel = 'Resistance Level';
    else if (unit === 'kg')                 trackLabel = 'Weight';

    const steppers = Array.from({ length: setsCount }, (_, s) =>
      renderStepper(day, i, s, ex)
    ).join('');

    const trackerHtml = ex.track === false ? '' : `
        <div class="weight-tracker">
          <div class="detail-label">${trackLabel}</div>
          <div class="steppers-row">
            ${steppers}
          </div>
        </div>`;

    const timerHtml = ex.timer ? renderTimer(ex, day.id, i) : '';

    return `
    <div class="exercise-card" data-exidx="${i}">
      <div class="exercise-header">
        <div class="exercise-num">${i + 1}</div>
        <div class="exercise-info">
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-prescription">${ex.rx}</div>
        </div>
        ${ex.n ? '<div class="tag-new">New</div>' : ''}
      </div>
      <div class="exercise-details">
        ${trackerHtml}
        ${timerHtml}
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
    </div>`;
  }).join('');

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
  document.querySelectorAll('.day-tab').forEach(t =>
    t.classList.toggle('active', parseInt(t.dataset.idx, 10) === idx)
  );

  if (idx === 7) {
    contentEl.innerHTML = renderProfile();
  } else {
    contentEl.innerHTML = renderDay(DAYS[idx]);
    contentEl.querySelectorAll('.exercise-card').forEach(card => {
      card.querySelector('.exercise-header').addEventListener('click', () =>
        card.classList.toggle('expanded')
      );
      // Stepper + timer buttons must not collapse the card when tapped
      card.querySelectorAll('.stepper-btn, .timer-btn, .tcfg-btn').forEach(btn =>
        btn.addEventListener('click', e => e.stopPropagation())
      );
    });
  }
  contentEl.scrollTop = 0;
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

// Removed to allow horizontal scrolling of horizontally-aligned set counters.


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
