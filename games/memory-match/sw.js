const CACHE_PREFIX = "mama-memory-match-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const CORE_ASSETS = [
  "/games/memory-match/",
  "/games/memory-match/index.html",
  "/games/memory-match/app.js",
  "/games/memory-match/manifest.webmanifest",
  "/games/memory-match/icons/favicon-32.png",
  "/games/memory-match/icons/apple-touch-icon.png",
  "/games/memory-match/icons/memory-match-icon-192.png",
  "/games/memory-match/icons/memory-match-icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) return caches.delete(key);
        return undefined;
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== location.origin || !url.pathname.startsWith("/games/memory-match/")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      }).catch(function () {
        return caches.match(event.request).then(function (cached) {
          return cached || caches.match("/games/memory-match/");
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      });
    })
  );
});
