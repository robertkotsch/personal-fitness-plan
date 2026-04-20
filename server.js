/**
 * Minimal static file server for Railway.
 *
 * Cache strategy:
 *  - index.html  → no-cache (browser always revalidates with the server)
 *  - All other assets (JS, CSS, images) → 1 year cache.
 *    Cache-busting is handled via the ?v= query strings in index.html,
 *    so bumping those values is the only step needed on each deploy.
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

app.use(
  express.static(ROOT, {
    // Disable express' built-in ETag for the custom header logic below.
    etag: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
        // Always revalidate: index.html so deploys are picked up immediately;
        // sw.js because the browser MUST be able to detect SW updates (spec requirement).
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      } else {
        // Long-lived cache for versioned assets; they never change once deployed.
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// Fallback: serve index.html for any unmatched route (SPA-style).
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
