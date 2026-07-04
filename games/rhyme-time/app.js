(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/rhyme-time/sw.js", { scope: "/games/rhyme-time/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
