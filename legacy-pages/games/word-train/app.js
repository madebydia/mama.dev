(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/word-train/sw.js", { scope: "/games/word-train/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
