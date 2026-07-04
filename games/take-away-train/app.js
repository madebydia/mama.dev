(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/take-away-train/sw.js", { scope: "/games/take-away-train/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
