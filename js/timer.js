/**
 * timer.js — Interval Timer Module
 *
 * Manages work/rest interval timers displayed inside exercise cards.
 * Depends on: DAYS (global, defined in data.js — must load first).
 *
 * Public API (all on window):
 *   timerStart(dayId, exIdx)         — start, pause, or resume
 *   timerReset(dayId, exIdx)         — stop and rewind to idle
 *   stepTimerParam(dayId, exIdx, param, delta) — adjust rounds/work/rest
 *
 * Called by app.js:
 *   renderTimer(ex, dayId, exIdx)    — returns HTML string for the timer panel
 */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────

/**
 * Single shared timer state. Only one interval runs at a time.
 * epochEnd enables drift correction: remaining time is calculated from
 * wall-clock delta rather than trusting setInterval accuracy.
 */
const timerState = {
  tickId: null, dayId: null, exIdx: null,
  round: 1, phaseIdx: 0, remaining: 0,
  segments: [], // [{label, dur, colorPhase}]
  config: null, epochEnd: 0,
};

/**
 * Per-exercise timer config overrides — persisted so custom rounds/durations
 * survive page reloads. Falls back to data.js defaults if no override exists.
 */
let timerConfigs = JSON.parse(localStorage.getItem('timerConfigs')) || {};

// ── Config helpers ─────────────────────────────────────────────────────────

/**
 * Returns the effective config for a timer, merging any stored overrides
 * onto the exercise defaults (labels are always preserved from data.js).
 */
function getTimerConfig(dayId, exIdx) {
  const day        = DAYS.find(d => d.id === dayId);
  const ex         = day && day.exercises[exIdx];
  const defaultCfg = ex && ex.timer ? { ...ex.timer } : null;
  if (!defaultCfg) return null;
  const stored = timerConfigs[`${dayId}_${exIdx}`];
  return stored ? { ...defaultCfg, ...stored } : defaultCfg;
}

/**
 * Adjusts a single timer parameter (rounds | work | rest) by delta,
 * persists the override, and refreshes the idle panel DOM without a
 * full re-render. Adjusters are hidden via CSS while the timer is active.
 */
window.stepTimerParam = function(dayId, exIdx, param, delta) {
  const key  = `${dayId}_${exIdx}`;
  const day  = DAYS.find(d => d.id === dayId);
  const ex   = day && day.exercises[exIdx];
  const base = { ...(ex && ex.timer || {}), ...(timerConfigs[key] || {}) };

  const mins = { rounds: 1, work: 10, rest: 5 };
  base[param] = Math.max(mins[param] || 1, (base[param] || 0) + delta);
  timerConfigs[key] = base;
  localStorage.setItem('timerConfigs', JSON.stringify(timerConfigs));

  // Refresh the param display without a full re-render
  const panel = document.getElementById(`timer-${dayId}-${exIdx}`);
  if (!panel) return;
  const valEl = document.getElementById(`tcfg-${param}-${dayId}-${exIdx}`);
  if (valEl) valEl.textContent = param === 'rounds' ? String(base[param]) : `${base[param]}s`;

  // Keep main display in sync while idle
  panel.querySelector('.timer-round').textContent = `Round 1 / ${base.rounds}`;
  panel.querySelector('.timer-count').textContent = timerFmt(base.work);
  const totalMin = Math.ceil(base.rounds * (base.work + base.rest) / 60);
  panel.querySelector('.timer-total').textContent = `~${totalMin} min total`;
  panel.querySelector('.legend-work').textContent =
    `${base.workLabel || 'WORK'} ${base.work}s`;
  panel.querySelector('.legend-rest').textContent =
    `${base.restLabel || 'REST'} ${base.rest}s`;
};

// ── Utilities ──────────────────────────────────────────────────────────────

/** Format seconds as M:SS */
function timerFmt(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Short Web Audio API beep — no external files required. */
function timerBeep(freq = 880, dur = 0.15) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch (_) {}
}

// ── DOM update ─────────────────────────────────────────────────────────────

/** Push current timerState to the panel DOM — called by timerTick & controls. */
function timerUpdateDOM() {
  const st    = timerState;
  const panel = document.getElementById(`timer-${st.dayId}-${st.exIdx}`);
  if (!panel) return;
  const phaseEl  = panel.querySelector('.timer-phase');
  const countEl  = panel.querySelector('.timer-count');
  const roundEl  = panel.querySelector('.timer-round');
  const startBtn = panel.querySelector('.timer-start-btn');

  if (st.phaseIdx === -1) { // done
    panel.dataset.phase = 'done';
    phaseEl.textContent = 'DONE';
    countEl.textContent = '\u2713';
    roundEl.textContent = `Round ${st.config.rounds} / ${st.config.rounds}`;
    if (startBtn) startBtn.textContent = '\u21ba Reset';
    return;
  }

  const seg = st.segments[st.phaseIdx];
  panel.dataset.phase = seg.colorPhase;
  phaseEl.textContent = seg.label;
  countEl.textContent = timerFmt(st.remaining);
  roundEl.textContent = `Round ${st.round} / ${st.config.rounds}`;
  if (startBtn) startBtn.textContent = st.tickId ? '\u23f8 Pause' : '\u25b6 Start';
}

// ── Tick ───────────────────────────────────────────────────────────────────

/** Called every 500 ms. Uses epochEnd for wall-clock drift correction. */
function timerTick() {
  const st  = timerState;
  const now = Date.now();
  st.remaining = Math.max(0, Math.round((st.epochEnd - now) / 1000));

  if (st.remaining <= 0) {
    st.phaseIdx++;
    if (st.phaseIdx >= st.segments.length) {
      // End of round
      st.phaseIdx = 0;
      st.round++;
      if (st.round > st.config.rounds) {
        st.phaseIdx = -1; // done
        clearInterval(st.tickId); st.tickId = null;
        timerBeep(880, 0.15);
        setTimeout(() => timerBeep(1100, 0.15), 220);
      } else {
        timerBeep(880, 0.2);
      }
    } else {
      // Transition to next segment in same round
      timerBeep(660, 0.12);
    }

    if (st.phaseIdx !== -1) {
      const nextSeg = st.segments[st.phaseIdx];
      st.epochEnd = now + nextSeg.dur * 1000;
      st.remaining = nextSeg.dur;
    }
  }
  timerUpdateDOM();
}

// ── Public controls ────────────────────────────────────────────────────────

/**
 * Start, pause, or resume the timer for an exercise.
 * Automatically stops any other running timer first.
 */
window.timerStart = function(dayId, exIdx) {
  const st = timerState;
  if ((st.dayId !== dayId || st.exIdx !== exIdx) && st.config !== null) {
    window.timerReset(st.dayId, st.exIdx);
  }
  if (st.phaseIdx === -1) { window.timerReset(dayId, exIdx); return; }

  if (st.tickId) {
    // Pause
    clearInterval(st.tickId); st.tickId = null;
    timerUpdateDOM(); return;
  }

  if (st.config === null) {
    const cfg = getTimerConfig(dayId, exIdx);
    if (!cfg) return;
    
    // Build segments list
    const segments = [
      { label: cfg.workLabel || 'WORK', dur: cfg.work,   colorPhase: 'work' },
      cfg.trans ? { label: cfg.transLabel || 'READY',  dur: cfg.trans,  colorPhase: 'rest' } : null,
      { label: cfg.restLabel || 'REST', dur: cfg.rest,   colorPhase: 'rest' },
      cfg.rest2 ? { label: cfg.rest2Label || 'REST', dur: cfg.rest2, colorPhase: 'rest' } : null
    ].filter(Boolean);

    Object.assign(st, {
      dayId, exIdx, config: cfg, segments,
      round: 1, phaseIdx: 0, remaining: segments[0].dur,
    });
  }
  st.epochEnd = Date.now() + st.remaining * 1000;
  st.tickId   = setInterval(timerTick, 500);
  timerBeep(880, 0.08);
  timerUpdateDOM();
};

/** Stop the timer and rewind the panel to its idle state. */
window.timerReset = function(dayId, exIdx) {
  const st = timerState;
  if (st.tickId) { clearInterval(st.tickId); st.tickId = null; }
  Object.assign(st, {
    dayId: null, exIdx: null, round: 1,
    phaseIdx: 0, segments: [], remaining: 0, config: null,
  });

  const panel = document.getElementById(`timer-${dayId}-${exIdx}`);
  if (!panel) return;
  const cfg = getTimerConfig(dayId, exIdx);
  if (!cfg) return;
  panel.dataset.phase = 'idle';
  panel.querySelector('.timer-phase').textContent = cfg.workLabel || 'WORK';
  panel.querySelector('.timer-count').textContent = timerFmt(cfg.work);
  panel.querySelector('.timer-round').textContent = `Round 1 / ${cfg.rounds}`;
  panel.querySelector('.timer-start-btn').textContent = '\u25b6 Start';
};

// ── Rendering ──────────────────────────────────────────────────────────────

/**
 * Returns the HTML string for a fully self-contained timer panel.
 * Uses any stored config overrides so the panel reflects the current settings.
 * Called by renderDay() in app.js.
 */
/**
 * Returns the HTML string for a fully self-contained timer panel.
 * Uses any stored config overrides so the panel reflects the current settings.
 * Called by renderDay() in app.js.
 */
function renderTimer(ex, dayId, exIdx) {
  const cfg      = getTimerConfig(dayId, exIdx);
  const totalMin = Math.ceil(cfg.rounds * (cfg.work + cfg.rest) / 60);
  const id       = `timer-${dayId}-${exIdx}`;

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

  // Build legend HTML
  const segments = [
    { label: cfg.workLabel || 'WORK', dur: cfg.work,  cls: 'legend-work' },
    cfg.trans ? { label: cfg.transLabel || 'READY', dur: cfg.trans, cls: 'legend-rest' } : null,
    { label: cfg.restLabel || 'REST', dur: cfg.rest,  cls: 'legend-rest' },
    cfg.rest2 ? { label: cfg.rest2Label || 'REST', dur: cfg.rest2, cls: 'legend-rest' } : null
  ].filter(Boolean);

  const legendHtml = segments.map((s, idx) => 
    `<span class="${s.cls}">${s.label} ${s.dur}s</span>`
  ).join('<span class="legend-divider">/</span>');

  return `
    <div class="timer-panel" id="${id}" data-phase="idle">
      <div class="timer-meta">
        <span class="timer-round">Round 1 / ${cfg.rounds}</span>
        <span class="timer-total">~${totalMin} min total</span>
      </div>
      <div class="timer-phase">${cfg.workLabel || 'WORK'}</div>
      <div class="timer-count">${timerFmt(cfg.work)}</div>
      <div class="timer-legend">
        ${legendHtml}
      </div>
      <div class="timer-controls">
        <button class="timer-btn timer-reset-btn"
          onclick="timerReset('${dayId}', ${exIdx})">&#8635;</button>
        <button class="timer-btn timer-start-btn"
          onclick="timerStart('${dayId}', ${exIdx})">&#9654; Start</button>
      </div>
      <div class="timer-config">
        ${paramStepper('rounds', 'Rounds', cfg.rounds,     1)}
        <div class="tcfg-divider"></div>
        ${paramStepper('work',   'Work',   cfg.work + 's', 5)}
        <div class="tcfg-divider"></div>
        ${paramStepper('rest',   'Rest',   cfg.rest + 's', 5)}
      </div>
    </div>`;
}
