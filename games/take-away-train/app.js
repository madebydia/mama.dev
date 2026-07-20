(function () {
  if (!("serviceWorker" in navigator)) return;

  var hadController = !!navigator.serviceWorker.controller;
  var reloading = false;

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (reloading || !hadController) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/take-away-train/sw.js", {
      scope: "/games/take-away-train/",
      updateViaCache: "none"
    }).then(function (reg) {
      if (reg && typeof reg.update === "function") reg.update();
    }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
