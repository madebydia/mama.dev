(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/skip-count/sw.js", { scope: "/games/skip-count/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
