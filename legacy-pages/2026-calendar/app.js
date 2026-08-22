(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/2026-calendar/sw.js", { scope: "/2026-calendar/" }).catch(function () {
      // PWA support should never block the calendar if service workers are unavailable.
    });
  });
})();
