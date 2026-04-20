/**
 * Service Worker — Cache-first strategy.
 *
 * HOW TO FORCE AN UPDATE: bump CACHE_NAME (e.g. v1.1 → v1.2).
 * The browser detects the changed sw.js byte, installs the new SW,
 * the activate handler deletes the old cache, clients get fresh files.
 */

const CACHE_NAME = 'fitness-plan-v1.2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/data.js',
  '/js/timer.js',
];

// Cache all core assets on install; activate immediately.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Delete every cache that isn't the current version, then claim clients.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Cache-first: serve from cache, fall back to network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached ?? fetch(event.request))
  );
});
