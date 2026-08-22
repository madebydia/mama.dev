(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/memory-match/sw.js", { scope: "/games/memory-match/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
