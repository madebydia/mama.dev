const CACHE_PREFIX = "mama-take-away-train-";
const CACHE_NAME = `${CACHE_PREFIX}v4`;
const CORE_ASSETS = [
  "/games/take-away-train/",
  "/games/take-away-train/index.html",
  "/games/take-away-train/app.js",
  "/games/take-away-train/manifest-20260705.webmanifest",
  "/games/take-away-train/icons/favicon-32-20260705.png",
  "/games/take-away-train/icons/apple-touch-icon-20260705.png",
  "/games/take-away-train/icons/take-away-train-icon-192-20260705.png",
  "/games/take-away-train/icons/take-away-train-icon-512-20260705.png"
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
  if (url.origin !== location.origin || !url.pathname.startsWith("/games/take-away-train/")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      }).catch(function () {
        return caches.match(event.request).then(function (cached) {
          return cached || caches.match("/games/take-away-train/");
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
