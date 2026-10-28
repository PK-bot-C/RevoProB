// Offline cache for the Revo Pro app (only active when served over https, never inside the native app)
// Network first, so a new version on GitHub Pages shows up straight away; the cache is the offline fallback.
const CACHE = "revopro-app-v1.1.0";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
