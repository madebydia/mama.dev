const CACHE_PREFIX = "mama-sorting-bins-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const CORE_ASSETS = [
  "/games/sorting-bins/",
  "/games/sorting-bins/index.html",
  "/games/sorting-bins/app.js",
  "/games/sorting-bins/manifest.webmanifest",
  "/games/sorting-bins/icons/favicon-32.png",
  "/games/sorting-bins/icons/apple-touch-icon.png",
  "/games/sorting-bins/icons/sorting-bins-icon-192.png",
  "/games/sorting-bins/icons/sorting-bins-icon-512.png"
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
  if (url.origin !== location.origin || !url.pathname.startsWith("/games/sorting-bins/")) return;

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
          return cached || caches.match("/games/sorting-bins/");
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
