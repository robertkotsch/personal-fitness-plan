/**
 * build.js — Stamp build timestamp into sw.js and index.html asset URLs.
 *
 * Usage: node build.js
 *
 * What it does:
 *  1. Replaces __BUILD_TS__ in sw.js with the current unix timestamp.
 *  2. Updates all `?v=<digits>` query strings in index.html to the same stamp.
 *
 * This ensures the browser detects a changed service worker on every deploy
 * without manual version bumping.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT  = __dirname;
const stamp = String(Date.now()); // e.g. "1713620000000"

// ── 1. Stamp sw.js ────────────────────────────────────────────────────────────
const swPath = path.join(ROOT, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/__BUILD_TS__/, stamp);
fs.writeFileSync(swPath, sw, 'utf8');
console.log(`[build] sw.js  → CACHE_NAME = fitness-plan-${stamp}`);

// ── 2. Stamp index.html asset query strings ────────────────────────────────────
const htmlPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
// Match any ?v=<digits> — covers CSS and JS includes.
html = html.replace(/\?v=\d+/g, `?v=${stamp}`);
fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`[build] index.html → ?v=${stamp}`);

console.log('[build] Done.');
