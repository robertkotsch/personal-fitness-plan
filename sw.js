/**
 * Service Worker — Network-first with offline fallback.
 *
 * Strategy: always try the network first so users get fresh content
 * immediately. On network failure, fall back to cache (offline support).
 *
 * The SW auto-activates on install (skipWaiting) so updates are applied
 * on the very next page load without requiring the user to tap a banner.
 *
 * CACHE_NAME is stamped by build.js at deploy/dev-server start time.
 * It changes on every run so the browser always detects a new SW.
 */

const BUILD_TS   = '1776713970568';
const CACHE_NAME = `fitness-plan-${BUILD_TS}`;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/data.js',
  './js/timer.js',
  './js/visuals.js',
  './manifest.json',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
];

// ── Install: pre-cache assets and activate immediately ───────────────────────
self.addEventListener('install', event => {
  // skipWaiting makes the new SW take over as soon as it finishes installing,
  // without waiting for all tabs to close or for the user to click "Update".
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          // cache: 'reload' bypasses the browser HTTP cache so we always
          // store a fresh copy during install.
          const res = await fetch(asset, { cache: 'reload' });
          if (res && res.status === 200) {
            await cache.put(asset, res);
          }
        } catch (e) {
          console.warn('[SW] Failed to cache:', asset, e);
        }
      }
    })
  );
});

// ── Activate: delete every old cache, claim all open tabs ───────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Removing old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first, cache fallback for offline ────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Pass cross-origin requests (YouTube embeds, etc.) straight through.
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Network succeeded — update the cache entry and return fresh response.
        if (response && response.status === 200) {
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, response.clone())
          );
        }
        return response;
      })
      .catch(() =>
        // Network failed — serve from cache so the app works offline.
        caches.match(event.request)
      )
  );
});
