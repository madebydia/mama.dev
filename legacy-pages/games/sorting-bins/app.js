(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/sorting-bins/sw.js", { scope: "/games/sorting-bins/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
