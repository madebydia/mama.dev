const CACHE_PREFIX = "mama-bigger-ramp-jump-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const CORE_ASSETS = [
  "/games/bigger-ramp-jump/",
  "/games/bigger-ramp-jump/index.html",
  "/games/bigger-ramp-jump/app.js",
  "/games/bigger-ramp-jump/manifest.webmanifest",
  "/games/bigger-ramp-jump/icons/favicon-32.png",
  "/games/bigger-ramp-jump/icons/apple-touch-icon.png",
  "/games/bigger-ramp-jump/icons/bigger-ramp-jump-icon-192.png",
  "/games/bigger-ramp-jump/icons/bigger-ramp-jump-icon-512.png",
  "/assets/mama-home-tab.css"
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
  if (url.origin !== location.origin || !url.pathname.startsWith("/games/bigger-ramp-jump/")) return;

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
          return cached || caches.match("/games/bigger-ramp-jump/");
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
