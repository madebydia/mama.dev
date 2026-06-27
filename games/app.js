(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/sw.js", { scope: "/games/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
