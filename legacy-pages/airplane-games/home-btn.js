// Shared home button for all games
(function() {
  const btn = document.createElement('a');
  btn.href = 'index.html';
  btn.textContent = '🏠';
  btn.style.cssText = 'position:fixed;top:12px;left:12px;z-index:999;font-size:32px;text-decoration:none;background:rgba(255,255,255,0.85);width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:transform 0.15s;';
  btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
  document.body.appendChild(btn);
})();
