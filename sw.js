/* Aqwat P118 service worker — scoped offline cache.
   Network-first for app shell so new GitHub Pages deployments show every menu;
   cache fallback for offline use. Cache names are app-specific to avoid collisions
   with other Aqwat repositories on the same github.io origin. */
const APP_ID = 'aqwat-p118-system';
const CACHE_PREFIX = APP_ID + '-';
const CACHE = CACHE_PREFIX + 'v2026-07-08-2';
const SCOPE_URL = new URL(self.registration.scope);

const ASSETS = [
  './', './index.html', './css/main.css',
  './js/store.js', './js/i18n.js', './js/registry.js', './js/quiz-data.js',
  './js/quiz.js', './js/cert.js', './js/search.js', './js/analytics.js',
  './js/maintenance.js', './js/assistant.js', './js/practice.js', './js/equipment.js',
  './js/app.js',
  './vendor/three.min.js',
  './modules/ele.html', './modules/aws.html', './modules/mr4.html',
  './modules/hatchback.html', './modules/poultry.html',
  './.nojekyll'
];

function inScope(url) {
  return url.origin === location.origin && url.pathname.startsWith(SCOPE_URL.pathname);
}

async function put(req, res) {
  if (!res || !res.ok) return res;
  const cache = await caches.open(CACHE);
  await cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  try {
    return await put(req, await fetch(req, { cache: 'no-store' }));
  } catch (e) {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') return caches.match('./index.html');
    throw e;
  }
}

async function staleWhileRevalidate(req) {
  const hit = await caches.match(req, { ignoreSearch: true });
  const fresh = fetch(req).then(res => put(req, res)).catch(() => null);
  return hit || fresh;
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  if (!inScope(url)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).catch(() => hit)));
    return;
  }

  const isShell = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  const isFreshAsset = /\.(?:html|css|js)$/i.test(url.pathname);
  e.respondWith((isShell || isFreshAsset) ? networkFirst(e.request) : staleWhileRevalidate(e.request));
});
