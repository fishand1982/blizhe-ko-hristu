/* Offline: cache only bundled static assets. User notes stay in localStorage. */
const CACHE = 'closer-to-christ-v1.0.1';
const CORE = ['./','./index.html','./styles.css','./main.js','./data.js','./manifest.webmanifest','./assets/favicon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/og-cover.png'];
const coreUrls = new Set(CORE.map(path => new URL(path, self.registration.scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('closer-to-christ-') && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.href.startsWith(self.registration.scope)) return;
  if (event.request.mode !== 'navigate' && !coreUrls.has(requestUrl.href)) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok && (event.request.mode === 'navigate' || coreUrls.has(requestUrl.href))) {
        const cache = await caches.open(CACHE);
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') return (await caches.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
