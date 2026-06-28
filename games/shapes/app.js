(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/shapes/sw.js", { scope: "/games/shapes/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
