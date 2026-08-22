(function () {
  if (!("serviceWorker" in navigator)) return;

  // When a new service worker takes control, reload once so the fresh
  // assets are used immediately (only if a worker was already controlling
  // this page — avoids a needless reload on the very first visit).
  var hadController = !!navigator.serviceWorker.controller;
  var reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (reloading || !hadController) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/sw.js", { scope: "/games/" }).then(function (reg) {
      // Check for an updated worker on every load.
      if (reg && typeof reg.update === "function") reg.update();
    }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
