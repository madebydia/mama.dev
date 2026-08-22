(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/number-hop/sw.js", { scope: "/games/number-hop/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
