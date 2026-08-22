(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/pattern-parade/sw.js", { scope: "/games/pattern-parade/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
