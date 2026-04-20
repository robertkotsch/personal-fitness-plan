/**
 * Service Worker — Network-first for core assets, cache-first for the rest.
 *
 * CACHE_NAME auto-updates via the build timestamp injected below — no manual
 * version bumps needed. Every time sw.js itself changes the browser detects it,
 * installs the new SW, and the activate handler deletes the old cache.
 *
 * The new SW does NOT auto-activate — it waits for a SKIP_WAITING message from
 * app.js (sent when the user taps the update banner).
 */

// Timestamp injected at deploy time — changes whenever any file is modified.
const BUILD_TS    = '1776713748731';
const CACHE_NAME  = `fitness-plan-${BUILD_TS}`;
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

// ── Install: pre-cache assets one-by-one (safe — skips failures) ──────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
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
  // Do NOT call skipWaiting() here.
  // The new SW waits until the user accepts the update (see message handler).
});

// ── Message: user clicked "Update" → activate the waiting SW ──────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Activate: delete every old cache, then claim all clients ──────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: cache-first; bypass cross-origin requests entirely ────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Let cross-origin requests (YouTube embeds, etc.) go straight to network.
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
              return response;
            });
          }
          return response;
        })
        .catch(() => { /* network failed, nothing cached — fail silently */ });
    })
  );
});
