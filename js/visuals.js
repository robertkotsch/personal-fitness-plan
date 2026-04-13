/**
 * visuals.js — SVG helpers and exercise visual-cue map.
 *
 * V[key].p is an array of position objects: { l: label, s: svgString }.
 * Consumed by renderVis() in app.js.
 */

// ── SVG primitive helpers ──────────────────────────────────────────────────

/** Wraps paths in a root <svg> element. */
const S = (paths, w = 80, h = 90) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none"` +
  ` stroke="#e85d26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/** Circle (head). */
const H = (cx, cy, r = 5) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;

/** Line segment. */
const L = (a, b, c, d) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`;

/** Kettlebell icon. */
const KB = (cx, cy) =>
  `<rect x="${cx - 4}" y="${cy - 3}" width="8" height="6" rx="1"` +
  ` fill="#e85d2660" stroke="#e85d26" stroke-width="1.5"/>` +
  `<line x1="${cx}" y1="${cy - 3}" x2="${cx}" y2="${cy - 7}"` +
  ` stroke="#e85d26" stroke-width="1.5"/>`;

/** Floor line (dashed). */
const FL =
  `<line x1="10" y1="72" x2="70" y2="72" stroke="#7a7670" stroke-width="1" stroke-dasharray="3,3"/>`;

/** Pull-up bar. */
const BAR =
  `<line x1="20" y1="8" x2="60" y2="8" stroke="#7a7670" stroke-width="3"/>`;

/** Small text label. */
const TX = (x, y, t, sz = 5.5) =>
  `<text x="${x}" y="${y}" fill="#7a7670" font-size="${sz}"` +
  ` text-anchor="middle" font-family="Source Sans 3">${t}</text>`;

// ── Exercise visual-cue map ────────────────────────────────────────────────

/** Keys match the `vi` field on exercise objects in data.js. */
const V = {
  plyo_pushup: { p: [
    { l: 'Down', s: S(
      H(40, 28) + L(40, 33, 40, 52) + L(40, 52, 25, 70) + L(40, 52, 55, 70) +
      L(40, 38, 20, 48) + L(20, 48, 20, 55) + L(40, 38, 60, 48) + L(60, 48, 60, 55) + FL
    )},
    { l: 'Explode', s: S(
      H(40, 20) + L(40, 25, 40, 48) + L(40, 48, 25, 68) + L(40, 48, 55, 68) +
      L(40, 32, 22, 42) + L(22, 42, 22, 52) + L(40, 32, 58, 42) + L(58, 42, 58, 52) + FL
    )},
    { l: 'Airborne', s: S(
      H(40, 12) + L(40, 17, 40, 40) + L(40, 40, 28, 56) + L(40, 40, 52, 56) +
      L(40, 22, 18, 14) + L(40, 22, 62, 14) + TX(40, 82, 'hands off!', 6) + FL
    )},
  ]},

  ring_dips: { p: [
    { l: 'Top RTO', s: S(
      H(40, 12) + L(40, 17, 40, 45) + L(40, 45, 30, 65) + L(40, 45, 50, 65) +
      L(40, 24, 22, 35) + L(22, 35, 22, 10) + L(40, 24, 58, 35) + L(58, 35, 58, 10)
    )},
    { l: 'Bottom', s: S(
      H(40, 22) + L(40, 27, 40, 52) + L(40, 52, 30, 70) + L(40, 52, 50, 70) +
      L(40, 32, 20, 22) + L(20, 22, 20, 10) + L(40, 32, 60, 22) + L(60, 22, 60, 10)
    )},
  ]},

  floor_press: { p: [
    { l: 'Elbows down', s: S(
      `<line x1="10" y1="48" x2="70" y2="48" stroke="#7a7670" stroke-width="1" stroke-dasharray="3,3"/>` +
      H(15, 42) + L(20, 42, 55, 42) + L(55, 42, 65, 58) + L(55, 42, 50, 28) +
      L(20, 38, 20, 28) + L(20, 38, 30, 48),
      80, 70
    )},
    { l: 'Press up', s: S(
      `<line x1="10" y1="48" x2="70" y2="48" stroke="#7a7670" stroke-width="1" stroke-dasharray="3,3"/>` +
      H(15, 42) + L(20, 42, 55, 42) + L(55, 42, 65, 58) + L(55, 42, 50, 28) +
      L(20, 36, 20, 14) + L(20, 38, 30, 48),
      80, 70
    )},
  ]},

  dead_hang: { p: [
    { l: 'Passive hang', s: S(
      BAR + L(30, 8, 30, 14) + L(50, 8, 50, 14) + L(30, 14, 40, 22) + L(50, 14, 40, 22) +
      H(40, 28) + L(40, 33, 40, 55) + L(40, 55, 32, 75) + L(40, 55, 48, 75) +
      TX(40, 86, 'relax everything')
    )},
  ]},

  l_sit: { p: [
    { l: 'Tuck', s: S(
      H(40, 15) + L(40, 20, 40, 42) + L(40, 42, 50, 48) + L(50, 48, 42, 55) +
      L(40, 28, 25, 38) + L(25, 38, 25, 48) + L(40, 28, 55, 38) + L(55, 38, 55, 48) +
      TX(40, 86, 'parallettes')
    )},
    { l: 'Full L-Sit', s: S(
      H(40, 15) + L(40, 20, 40, 42) + L(40, 42, 65, 42) +
      L(40, 28, 25, 38) + L(25, 38, 25, 48) + L(40, 28, 55, 38) + L(55, 38, 55, 48)
    )},
  ]},

  pallof_press: { p: [
    { l: 'Hold', s: S(
      H(35, 12) + L(35, 17, 35, 48) + L(35, 48, 28, 70) + L(35, 48, 42, 70) +
      L(35, 28, 50, 28) +
      `<line x1="65" y1="10" x2="65" y2="50" stroke="#7a7670" stroke-width="2"/>` +
      `<line x1="50" y1="28" x2="65" y2="30" stroke="#f0c040" stroke-width="1.5" stroke-dasharray="4,2"/>` +
      TX(50, 22, 'resist →')
    )},
    { l: 'Press out', s: S(
      H(35, 12) + L(35, 17, 35, 48) + L(35, 48, 28, 70) + L(35, 48, 42, 70) +
      L(35, 28, 60, 28) +
      `<line x1="65" y1="10" x2="65" y2="50" stroke="#7a7670" stroke-width="2"/>` +
      `<line x1="60" y1="28" x2="65" y2="30" stroke="#f0c040" stroke-width="1.5" stroke-dasharray="4,2"/>` 
    )},
  ]},

  hip_90_90: { p: [
    { l: 'Setup', s: S(
      H(40, 12) + L(40, 17, 40, 42) + L(40, 42, 25, 48) + L(25, 48, 25, 62) +
      L(40, 42, 55, 48) + L(55, 48, 70, 48) + L(40, 24, 32, 18) + L(40, 24, 48, 18) +
      TX(25, 72, '90°') + TX(60, 56, '90°') +
      `<line x1="5" y1="65" x2="75" y2="65" stroke="#7a7670" stroke-width="1" stroke-dasharray="3,3"/>`
    )},
  ]},

  kb_clean_press: { p: [
    { l: 'Clean', s: S(
      H(40, 12) + L(40, 17, 40, 45) + L(40, 45, 32, 68) + L(40, 45, 48, 68) +
      L(40, 24, 48, 34) + L(48, 34, 48, 24) + KB(48, 20) + L(40, 24, 32, 18)
    )},
    { l: 'Press', s: S(
      H(40, 18) + L(40, 23, 40, 50) + L(40, 50, 32, 72) + L(40, 50, 48, 72) +
      L(40, 28, 48, 20) + L(48, 20, 48, 8) + KB(48, 5) + L(40, 28, 32, 22)
    )},
  ]},

  hindu_pushup: { p: [
    { l: 'Down dog', s: S(
      H(35, 28) + L(35, 33, 52, 55) + L(52, 55, 52, 72) + L(52, 55, 38, 72) +
      L(35, 33, 28, 48) + L(28, 48, 28, 56) + FL
    )},
    { l: 'Swoop', s: S(
      H(50, 38) + L(50, 43, 35, 55) + L(35, 55, 25, 72) + L(35, 55, 45, 72) +
      L(50, 38, 58, 52) + L(58, 52, 58, 60) + FL +
      `<path d="M 30 32 Q 45 22 52 36" fill="none" stroke="#7a7670" stroke-width="1" stroke-dasharray="2,2"/>`
    )},
    { l: 'Cobra', s: S(
      H(50, 18) + L(50, 23, 40, 42) + L(40, 42, 25, 55) + L(25, 55, 15, 55) +
      L(50, 28, 58, 38) + L(58, 38, 58, 48) + L(50, 28, 42, 22) + FL
    )},
  ]},

  scapular_pullup: { p: [
    { l: 'Passive', s: S(
      BAR + L(30, 8, 36, 16) + L(50, 8, 44, 16) +
      H(40, 22) + L(40, 27, 40, 52) + L(40, 52, 32, 72) + L(40, 52, 48, 72) +
      TX(40, 86, 'shoulders by ears')
    )},
    { l: 'Engaged', s: S(
      BAR + L(30, 8, 34, 14) + L(50, 8, 46, 14) +
      H(40, 20) + L(40, 25, 40, 50) + L(40, 50, 32, 70) + L(40, 50, 48, 70) +
      TX(40, 84, 'squeeze down') +
      `<line x1="22" y1="18" x2="22" y2="28" stroke="#f0c040" stroke-width="1"/>` +
      `<polygon points="22,28 20,24 24,24" fill="#f0c040"/>` +
      `<line x1="58" y1="18" x2="58" y2="28" stroke="#f0c040" stroke-width="1"/>` +
      `<polygon points="58,28 56,24 60,24" fill="#f0c040"/>`
    )},
  ]},

  archer_pullup: { p: [
    { l: 'Pull to one side', s: S(
      BAR + L(55, 8, 50, 18) + L(15, 8, 25, 18) +
      H(48, 24) + L(48, 29, 45, 50) + L(45, 50, 35, 70) + L(45, 50, 55, 70) +
      L(25, 18, 50, 24) + TX(22, 28, 'straight', 5)
    )},
  ]},

  face_pulls: { p: [
    { l: 'Pull & rotate', s: S(
      H(35, 15) + L(35, 20, 35, 48) + L(35, 48, 28, 70) + L(35, 48, 42, 70) +
      L(35, 24, 25, 15) + L(35, 24, 45, 15) +
      `<line x1="65" y1="10" x2="65" y2="40" stroke="#7a7670" stroke-width="2"/>` +
      `<line x1="25" y1="15" x2="55" y2="15" stroke="#f0c040" stroke-width="1" stroke-dasharray="3,2"/>` +
      TX(52, 10, 'thumbs back')
    )},
  ]},

  skin_the_cat: { p: [
    { l: 'Hang', s: S(
      BAR + L(30, 8, 36, 16) + L(50, 8, 44, 16) +
      H(40, 22) + L(40, 27, 40, 50) + L(40, 50, 35, 68) + L(40, 50, 45, 68)
    )},
    { l: 'Tuck through', s: S(
      BAR + L(30, 8, 36, 16) + L(50, 8, 44, 16) +
      H(40, 32) + L(40, 37, 40, 48) + L(40, 48, 35, 40) + L(40, 48, 45, 40)
    )},
    { l: 'German hang', s: S(
      BAR + L(30, 8, 36, 18) + L(50, 8, 44, 18) +
      H(40, 52) + L(40, 47, 40, 30) + L(40, 30, 35, 20) + L(40, 30, 45, 20) +
      L(40, 47, 35, 62) + L(40, 47, 45, 62)
    )},
  ]},

  bulgarian_split: { p: [
    { l: 'Bottom position', s: S(
      H(28, 10) + L(28, 15, 28, 40) + L(28, 40, 23, 58) + L(23, 58, 23, 72) +
      L(28, 40, 50, 48) + L(50, 48, 60, 40) +
      `<rect x="58" y="36" width="12" height="6" rx="1" fill="none" stroke="#7a7670" stroke-width="1"/>` +
      L(28, 22, 20, 16) + L(28, 22, 36, 16) + FL + TX(64, 50, 'bench', 5)
    )},
  ]},

  nordic_curl: { p: [
    { l: 'Start', s: S(
      H(40, 10) + L(40, 15, 40, 40) + L(40, 40, 40, 65) + L(40, 22, 32, 16) + L(40, 22, 48, 16) +
      `<line x1="35" y1="68" x2="45" y2="68" stroke="#7a7670" stroke-width="2"/>` +
      TX(40, 80, 'kneel upright')
    )},
    { l: '5s negative', s: S(
      H(58, 12) + L(55, 17, 48, 35) + L(48, 35, 40, 60) + L(55, 22, 50, 10) + L(55, 22, 62, 14) +
      `<line x1="35" y1="63" x2="45" y2="63" stroke="#7a7670" stroke-width="2"/>` +
      `<path d="M 42 15 Q 50 22 55 14" fill="none" stroke="#f0c040" stroke-width="1" stroke-dasharray="2,2"/>` +
      TX(48, 78, 'slow fall')
    )},
    { l: 'Catch', s: S(
      H(65, 18) + L(62, 23, 55, 38) + L(55, 38, 40, 58) + L(62, 28, 68, 18) + L(62, 28, 68, 32) +
      L(68, 32, 68, 42) +
      `<line x1="35" y1="61" x2="45" y2="61" stroke="#7a7670" stroke-width="2"/>` +
      TX(68, 50, 'hands', 5)
    )},
  ]},

  turkish_getup: { p: [
    { l: '1. Floor', s: S(
      `<line x1="5" y1="48" x2="75" y2="48" stroke="#7a7670" stroke-width="1" stroke-dasharray="3,3"/>` +
      H(12, 42) + L(17, 42, 55, 42) + L(55, 42, 65, 52) + L(55, 42, 50, 28) +
      L(17, 38, 17, 18) + KB(17, 14),
      80, 60
    )},
    { l: '2. Elbow', s: S(
      `<line x1="5" y1="48" x2="75" y2="48" stroke="#7a7670" stroke-width="1" stroke-dasharray="3,3"/>` +
      H(20, 30) + L(25, 33, 52, 42) + L(52, 42, 62, 52) + L(52, 42, 48, 28) +
      L(25, 28, 25, 10) + KB(25, 6) + L(25, 35, 32, 46),
      80, 60
    )},
    { l: '3. Stand', s: S(
      H(35, 5) + L(35, 10, 35, 35) + L(35, 35, 28, 52) + L(35, 35, 42, 52) +
      L(35, 16, 35, 0) + KB(35, -4) + L(35, 16, 28, 12),
      80, 60
    )},
  ]},

  handstand: { p: [
    { l: 'Wall hold', s: S(
      `<line x1="62" y1="5" x2="62" y2="82" stroke="#7a7670" stroke-width="2"/>` +
      L(40, 72, 40, 30) + H(40, 25) + L(40, 72, 35, 82) + L(40, 72, 45, 82) +
      L(40, 40, 58, 35) + L(40, 40, 58, 45) + TX(30, 88, '15cm from wall')
    )},
  ]},
};
