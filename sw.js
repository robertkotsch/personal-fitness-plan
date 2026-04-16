/**
 * Kill-switch Service Worker.
 *
 * Replaces the stale Sally Up Trainer SW that was cached on this origin.
 * On activation it silently wipes all caches and unregisters itself.
 * No forced page reload — clearing the cache is sufficient; the next
 * natural navigation will fetch fresh content from the server.
 */

self.addEventListener('install', () => {
  // Activate immediately without waiting for old clients to close.
  self.skipWaiting();
});

self.addEventListener('activate', async () => {
  // 1. Delete every cache on this origin.
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));

  // 2. Take control of all open tabs so they get uncached responses.
  await self.clients.claim();

  // 3. Self-destruct — no SW should be needed for this project.
  self.registration.unregister();
});
