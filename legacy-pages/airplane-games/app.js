(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/airplane-games/sw.js", { scope: "/airplane-games/" }).catch(function () {
      // Home-screen support should never block the games if service workers are unavailable.
    });
  });
})();
