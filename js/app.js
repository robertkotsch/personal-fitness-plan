/**
 * app.js — UI rendering, event wiring, and PWA installation.
 *
 * Depends on (loaded before this script):
 *
 *   data.js     → DAYS[] training plan
 */

// ── DOM references ─────────────────────────────────────────────────────────

const tabsEl    = document.getElementById('dayTabs');
const contentEl = document.getElementById('content');

// ── State ──────────────────────────────────────────────────────────────────

// Map Sunday (0) → index 6; Mon–Sat → 0–5. Cap at 6.
let todayIdx   = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6);
let currentIdx = todayIdx;

// ── Weights Storage ────────────────────────────────────────────────────────

let workoutWeights = JSON.parse(localStorage.getItem('workoutWeights')) || {};

function getSetsCount(rx) {
  // Matches patterns like "4 × 6", "4x6", "3 rds", "3 rounds", "3 sets"
  const match = rx.match(/(\d+)\s*([×x]|rds|rounds|sets)\s*/i);
  return match ? parseInt(match[1], 10) : 1;
}

window.updateWeight = function(dayId, exIdx, setIdx, value) {
  const key = `${dayId}_${exIdx}`;
  if (!workoutWeights[key]) workoutWeights[key] = [];
  workoutWeights[key][setIdx] = value;
  localStorage.setItem('workoutWeights', JSON.stringify(workoutWeights));
};

// ── Rendering ──────────────────────────────────────────────────────────────

const defaultProfile = {
  age: { label: 'Age', val: 51, unit: '' },
  weight: { label: 'Weight', val: 91, unit: 'kg' },
  height: { label: 'Height', val: 1.93, unit: 'm' },
  vo2max: { label: 'VO2max', val: 50, unit: '' },
  bench: { label: 'Bench 1RM', val: 107, unit: 'kg' },
  pullups: { label: 'Pull-ups', val: 12, unit: 'reps' }
};

let profile = JSON.parse(localStorage.getItem('athleteProfile'));
if (!profile) {
  profile = JSON.parse(JSON.stringify(defaultProfile));
} else {
  for (let key in defaultProfile) {
    if (profile[key] === undefined) profile[key] = defaultProfile[key];
  }
}

window.editProfile = function(key) {
  const item = profile[key];
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

  const exercises = day.exercises.map((ex, i) => {
    const setsCount = getSetsCount(ex.rx);
    const key = `${day.id}_${i}`;
    const weights = workoutWeights[key] || [];

    const weightInputs = Array.from({ length: setsCount }, (_, s) => {
      const val = weights[s] || '';
      return `
        <div class="set-input-group">
          <label>Set ${s + 1}</label>
          <div class="input-with-unit">
            <input type="number" step="0.5" placeholder="--" 
                   value="${val}" 
                   oninput="updateWeight('${day.id}', ${i}, ${s}, this.value)">
            <span>kg</span>
          </div>
        </div>`;
    }).join('');

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
        <div class="weight-tracker">
          <div class="detail-label">Weight Records</div>
          <div class="weight-inputs-scroll">
            <div class="weight-inputs">
              ${weightInputs}
            </div>
          </div>
        </div>
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
      // Toggle expansion when clicking the header
      card.querySelector('.exercise-header').addEventListener('click', () =>
        card.classList.toggle('expanded')
      );
      // Prevent expansion when clicking inputs
      card.querySelectorAll('input').forEach(input => {
        input.addEventListener('click', e => e.stopPropagation());
      });
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

let touchStartX = 0;

contentEl.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

contentEl.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(delta) > 60) {
    if (delta > 0 && currentIdx < 7) currentIdx++;
    else if (delta < 0 && currentIdx > 0) currentIdx--;
    showDay(currentIdx);
    const targetTab = tabsEl.querySelector(`[data-idx="${currentIdx}"]`);
    if (targetTab) {
      targetTab.scrollIntoView({
        behavior: 'smooth', inline: 'center', block: 'nearest',
      });
    }
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

