(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/ten-frame/sw.js", { scope: "/games/ten-frame/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
