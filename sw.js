/**
 * Kill-switch Service Worker.
 *
 * The previous project (Sally Up Trainer) left a Service Worker registered on
 * localhost:3000. Because SWs are scoped to an origin, it was intercepting
 * every page load here and returning its own cached content.
 *
 * By serving a new sw.js at the same URL, the browser installs this file as
 * an update. On activation it wipes every cache and unregisters itself so this
 * origin is completely clean for future use.
 */

self.addEventListener('install', () => {
  // Skip the waiting phase so this SW activates immediately.
  self.skipWaiting();
});

self.addEventListener('activate', async () => {
  // 1. Delete every cache entry on this origin.
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));

  // 2. Take control of all open tabs immediately.
  await self.clients.claim();

  // 3. Tell every controlled tab to reload so it gets the real content.
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(client => client.navigate(client.url));

  // 4. Unregister this SW — we don't need it anymore.
  self.registration.unregister();
});
