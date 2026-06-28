(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/counting-orchard/sw.js", { scope: "/games/counting-orchard/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
