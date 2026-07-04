(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/letter-sounds/sw.js", { scope: "/games/letter-sounds/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
