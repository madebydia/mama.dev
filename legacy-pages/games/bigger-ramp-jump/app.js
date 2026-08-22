(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/bigger-ramp-jump/sw.js", { scope: "/games/bigger-ramp-jump/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
