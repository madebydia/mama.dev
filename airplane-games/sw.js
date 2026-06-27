const CACHE_PREFIX = "mama-airplane-games-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const CORE_ASSETS = [
  "/airplane-games/",
  "/airplane-games/index.html",
  "/airplane-games/landing-path.html",
  "/airplane-games/takeoff-path.html",
  "/airplane-games/pattern-lab.html",
  "/airplane-games/logic-hangar.html",
  "/airplane-games/flight-path.html",
  "/airplane-games/cargo-count.html",
  "/airplane-games/home-btn.js",
  "/airplane-games/app.js",
  "/airplane-games/manifest.webmanifest",
  "/airplane-games/icons/airplanes-icon.svg",
  "/airplane-games/icons/favicon-32.png",
  "/airplane-games/icons/apple-touch-icon.png",
  "/airplane-games/assets/plane-1.png",
  "/airplane-games/assets/plane-2.png",
  "/airplane-games/assets/plane-3.png",
  "/airplane-games/assets/plane-4.png",
  "/airplane-games/assets/plane-5.png",
  "/airplane-games/assets/plane-6.png",
  "/airplane-games/assets/plane-7.png",
  "/airplane-games/assets/plane-8.png",
  "/airplane-games/assets/plane-9.png"
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
  if (url.origin !== location.origin || !url.pathname.startsWith("/airplane-games/")) return;

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
          return cached || caches.match("/airplane-games/");
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
