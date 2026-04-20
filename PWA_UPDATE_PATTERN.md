# PWA Auto-Update Pattern

A copy-paste reference for reliable service worker updates in vanilla JS PWAs.
Derived from `personal-fitness-plan` and compared against `sally-trainer`.

---

## The Core Problem

A service worker (SW) stores files in a cache and intercepts all network requests.
Once installed, it keeps serving cached files even after you've deployed new code — until
the browser detects a changed `sw.js` and installs a fresh SW. By default the browser
only polls for a new `sw.js` once per 24 hours, so users can be stuck on a stale version
for a full day without ever realising it.

Two caching layers compound the problem:

1. **HTTP cache** — the browser may cache `sw.js` itself, so the update check never
   even reaches the server.
2. **SW cache** — even if a new SW installs, it queues as "waiting" and won't activate
   until all tabs are closed (unless you call `skipWaiting`).

---

## The Solution (2-file pattern)

### 1. `sw.js` — the service worker itself

Choose one of the two fetch strategies below:

#### Strategy A — Network-first (always fresh, used in personal-fitness-plan)

Best for: apps that change frequently and where offline is a nice-to-have.

```js
const CACHE_NAME = 'my-app-v1';   // Bump this on every deploy (or use build.js below)

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './js/app.js',
  // … all your JS, CSS, images, fonts, manifest
];

// Install: pre-cache all assets fresh, then activate IMMEDIATELY.
self.addEventListener('install', event => {
  self.skipWaiting(); // ← activates without waiting for user interaction

  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          const res = await fetch(asset, { cache: 'reload' }); // bypass HTTP cache on install
          if (res && res.status === 200) await cache.put(asset, res);
        } catch (e) {
          console.warn('[SW] Failed to cache:', asset, e);
        }
      }
    })
  );
});

// Activate: delete old caches, claim all open tabs.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: network first → update cache → fall back to cache if offline.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, response.clone())
          );
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // offline fallback
  );
});
```

#### Strategy B — Cache-first with user-triggered update toast (used in sally-trainer)

Best for: apps where offline reliability is critical and users tolerate a one-tap update.

```js
const CACHE_NAME = 'my-app-v1';

// Install: pre-cache, but do NOT call skipWaiting.
// The new SW stays "waiting" until the user accepts.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          const res = await fetch(asset, { cache: 'reload' });
          if (res && res.status === 200) await cache.put(asset, res);
        } catch (e) {
          console.warn('[SW] Failed to cache:', asset, e);
        }
      }
    })
  );
  // No self.skipWaiting() here — user controls when to activate.
});

// Activate via message from the page (user clicked "Update now").
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
  );
  self.clients.claim();
});

// Fetch: cache first → network on miss → cache for next time.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, response.clone())
          );
        }
        return response;
      }).catch(() => {});
    })
  );
});
```

> [!NOTE]
> **Safari fix**: If your app redirects (e.g. `/` → `/index.html`), Safari throws
> "Response served by service worker has redirections". Wrap cached responses:
> ```js
> function createCleanResponse(response) {
>   if (response.redirected && response.status !== 0) {
>     return new Response(response.body, {
>       headers: response.headers,
>       status: response.status,
>       statusText: response.statusText,
>     });
>   }
>   return response;
> }
> ```

---

### 2. Registration in your main JS

This is the **most critical part** — both options are required.

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {

    navigator.serviceWorker.register('./sw.js', {
      updateViaCache: 'none'   // ← KEY: browser NEVER uses its HTTP cache for sw.js
    })
    .then(reg => {

      // ← KEY: force an update check on EVERY page load.
      // Without this, browsers only check for a new sw.js once per 24 hours.
      reg.update().catch(() => {});

      // Handle a SW that was already waiting before this page loaded
      // (e.g. user had multiple tabs open).
      if (reg.waiting && navigator.serviceWorker.controller) {
        // Strategy A: activate silently
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });

        // Strategy B: show a toast instead
        // showUpdateToast(reg.waiting);
      }

      // Listen for a new SW found during this page session.
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        if (!newSW) return;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            // Strategy A: activate silently
            newSW.postMessage({ type: 'SKIP_WAITING' });

            // Strategy B: show a toast instead
            // showUpdateToast(newSW);
          }
        });
      });

    }).catch(() => {});

    // Once the new SW takes control, reload so the page runs fresh JS/CSS.
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!reloading) {
        reloading = true;
        window.location.reload();
      }
    });

  });
}
```

---

### 3. Auto-stamp `CACHE_NAME` on every deploy (`build.js`)

Manually bumping the version string is error-prone. Use this zero-dependency script instead.

```js
// build.js — run with: node build.js
'use strict';
const fs   = require('fs');
const path = require('path');
const ROOT  = __dirname;
const stamp = String(Date.now());

// Replace the placeholder in sw.js
let sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
sw = sw.replace(/__BUILD_TS__/, stamp);
fs.writeFileSync(path.join(ROOT, 'sw.js'), sw);
console.log(`[build] CACHE_NAME = my-app-${stamp}`);

// Update all ?v= query strings in index.html
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
html = html.replace(/\?v=\d+/g, `?v=${stamp}`);
fs.writeFileSync(path.join(ROOT, 'index.html'), html);
console.log(`[build] index.html → ?v=${stamp}`);
```

In `sw.js`, use the placeholder as the initial value:

```js
const CACHE_NAME = 'my-app-__BUILD_TS__';
```

Wire it into `package.json` so it always runs before the server starts:

```json
{
  "scripts": {
    "predev":   "node build.js",
    "dev":      "npx serve .",
    "prestart": "node build.js",
    "start":    "node server.js"
  }
}
```

---

### 4. Stop `npx serve` from caching `sw.js` (`serve.json`)

Place in your project root. Only needed for local dev with `npx serve`.

```json
{
  "headers": [
    {
      "source": "sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    },
    {
      "source": "index.html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    }
  ]
}
```

For production with Express / Railway, set headers in `server.js`:

```js
setHeaders(res, filePath) {
  if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}
```

---

## Why each piece matters

| Piece | What breaks without it |
|---|---|
| `updateViaCache: 'none'` | Browser uses HTTP cache for `sw.js` → stale SW never detected |
| `reg.update()` on load | Browser only polls for new `sw.js` once per 24h → users stuck on old version all day |
| `skipWaiting` (or message) | New SW sits in "waiting" indefinitely → fresh files never served |
| `clients.claim()` in activate | Existing open tabs remain under the old SW after activation |
| `controllerchange` → reload | Page HTML/JS is from before the new SW took over → stale content visible |
| `cache: 'reload'` in install | Install fetches from SW's own cache, not the network → new SW caches old files |
| Bump `CACHE_NAME` | Old and new SW share the same cache → activate handler can't delete stale entries |

---

## One-time reset (escape a stuck cache)

If a browser is already stuck behind a stale SW, no code change can fix it remotely.
The user (or you in dev) must clear manually once:

**Chrome DevTools → Application → Storage → Clear site data**

Or via the Console:

```js
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(r => r.unregister()));
caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
location.reload();
```

After this one-time reset the patterns above keep things fresh automatically.
