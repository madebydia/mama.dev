const CACHE_PREFIX = "mama-number-hop-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const CORE_ASSETS = [
  "/games/number-hop/",
  "/games/number-hop/index.html",
  "/games/number-hop/app.js",
  "/games/number-hop/manifest.webmanifest",
  "/games/number-hop/icons/favicon-32.png",
  "/games/number-hop/icons/apple-touch-icon.png",
  "/games/number-hop/icons/number-hop-icon-192.png",
  "/games/number-hop/icons/number-hop-icon-512.png"
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
  if (url.origin !== location.origin || !url.pathname.startsWith("/games/number-hop/")) return;

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
          return cached || caches.match("/games/number-hop/");
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
