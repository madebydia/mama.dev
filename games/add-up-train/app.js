(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/add-up-train/sw.js", { scope: "/games/add-up-train/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
