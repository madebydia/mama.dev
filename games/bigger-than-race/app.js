(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/bigger-than-race/sw.js", { scope: "/games/bigger-than-race/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
