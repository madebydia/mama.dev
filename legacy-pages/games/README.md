# mama.dev Games Standards

This folder holds kid-facing games that can run from the `/games` launcher or be added to an iPad home screen as standalone apps.

## Current Shape

Each individual game lives in its own folder:

- `word-train`
- `bigger-than-race`
- `bigger-ramp-jump`
- `shapes`
- `counting-orchard`
- `add-up-train`

Each game should be playable at `/games/<slug>/` and should be installable independently from that URL.

## Game Style

Games should feel like small, tactile toys rather than thin quizzes.

- Use a full-bleed Three.js scene as the main surface.
- Keep the world warm, chunky, and physical: simple toy-like geometry, soft shadows, visible depth, clear silhouettes, and friendly motion.
- Let each game have its own setting and palette, but keep the shared mama.dev games language: rounded UI, big touch targets, soft 3D buttons, gentle feedback, and minimal chrome.
- Favor direct manipulation: tapping cars, fruit, trains, shapes, ramps, or cards should feel more natural than tapping tiny text.
- Keep instructions short and embedded in the play loop.
- Avoid long menus, dense settings, ads, sign-in, timers, or anything that makes the game feel like work.
- Preserve safe-area padding so the iPad browser/home indicator and the mama.dev home tab do not overlap gameplay.

## Learning Pattern

Each game should have one clear educational job.

- Start with an obvious action and one concept.
- Reward correct play with motion, sound, confetti, sparkle, chugging, racing, jumping, counting, or another scene-specific response.
- Use progressive levels only when the game benefits from them.
- Keep mistakes low-stakes: small jump, gentle shake, retry, or short correction.
- Prefer concrete representations before symbols when possible: apples before sums, fuel before bigger-than, train cars before words.

## Three.js Standards

The current games use vanilla JavaScript, a single `index.html`, and Three.js loaded by import map:

```html
<script type="importmap">
{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js" } }
</script>
```

Use this pattern unless there is a specific reason to add a build step.

Required scene behavior:

- Canvas is full-screen: `position: fixed; inset: 0; width: 100%; height: 100%`.
- Body is app-like: `overflow: hidden`, `viewport-fit=cover`, `touch-action: manipulation`, and no accidental text selection.
- Renderer uses antialiasing and soft shadows where performance allows.
- Camera/framing recalculates on resize and works in portrait and landscape.
- Animation uses `requestAnimationFrame`.
- Interactive meshes should have forgiving tap targets, especially on iPad.
- Respect `prefers-reduced-motion` for decorative CSS effects.

Performance defaults:

- Keep geometry simple and reusable.
- Prefer generated canvas textures over many external image requests.
- Use shadows deliberately, not everywhere.
- Test on mobile Safari or iPad before shipping.

## Shared Page Chrome

Individual games should not include a persistent back-to-games tab. These pages are meant to work as standalone PWAs on a kid's iPad, and adults can use the browser back button when they enter from the launcher.

Do not use the heavier mama.dev index styling inside games; the games should keep their own visual worlds.

## PWA Requirements

Every installable game folder must include:

```text
games/<slug>/
  index.html
  app.js
  sw.js
  manifest.webmanifest
  icons/
    favicon-32.png
    apple-touch-icon.png
    <slug>-icon-192.png
    <slug>-icon-512.png
    <slug>-icon-maskable-512.png
```

The `index.html` head must include game-scoped PWA tags:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#...">
<meta name="application-name" content="Game Name">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Short Name">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="mobile-web-app-capable" content="yes">
<link rel="manifest" href="/games/<slug>/manifest.webmanifest">
<link rel="icon" href="/games/<slug>/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/games/<slug>/icons/apple-touch-icon.png">
<script src="/games/<slug>/app.js" defer></script>
```

The `manifest.webmanifest` must be scoped to the game:

```json
{
  "name": "Game Name",
  "short_name": "Short Name",
  "description": "One sentence description.",
  "id": "/games/<slug>/",
  "start_url": "/games/<slug>/",
  "scope": "/games/<slug>/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#...",
  "theme_color": "#...",
  "categories": ["education", "games", "kids"],
  "icons": [
    {
      "src": "/games/<slug>/icons/<slug>-icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/games/<slug>/icons/<slug>-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/games/<slug>/icons/<slug>-icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

The game `app.js` should only register that game's service worker:

```js
(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/games/<slug>/sw.js", { scope: "/games/<slug>/" }).catch(function () {
      // Home-screen support should never block play if service workers are unavailable.
    });
  });
})();
```

The service worker should:

- Use a unique cache prefix, such as `mama-<slug>-`.
- Cache the game URL, `index.html`, `app.js`, `manifest.webmanifest`, favicon, Apple touch icon, and 192 and 512 icons.
- Only handle same-origin requests whose path starts with `/games/<slug>/`.
- Return the cached game shell for failed navigation requests.
- Delete old caches that share the same prefix.

Current service workers do not cache the CDN-hosted Three.js module. That is acceptable for home-screen install behavior, but not true offline play. If a future game must work offline, vendor Three.js locally and add it to that game's `CORE_ASSETS`.

## Icon Standards

Every game should have a distinct square icon that reads at iPad home-screen size.

- Use game-specific art, not a generic mama.dev icon.
- Keep the subject large and centered.
- Avoid tiny text.
- Generate 32, 180, 192, 512, and maskable 512 PNGs.
- The maskable icon should include comfortable padding so the subject does not get clipped by iOS or Android icon masks.
- Match `theme_color` and `background_color` to the icon/game palette.

## Launcher Standards

When a new game ships:

- Add one card to `/games/index.html`.
- Use the same route as the PWA `start_url`.
- Use the same name or a very close display name.
- Keep the card illustration visually related to the install icon.
- Keep card text short enough for landscape iPad.
- Do not list individual game internals or older alternates as separate launcher items.

## Per-Game README

Each game folder should have a short `README.md` with:

- What the game teaches.
- How it plays.
- Level progression, if any.
- The public play URL.
- Any unusual technical notes.

Keep these factual and site-focused. Avoid old project-context copy, external promo sections, or license boilerplate unless the game truly needs it.

## Pre-Ship Checklist

Run these before publishing game changes:

```bash
for f in games/*/manifest.webmanifest; do python3 -m json.tool "$f" >/dev/null || exit 1; done
git diff --check
```

Then serve locally and check each changed game:

```bash
python3 -m http.server 8080
```

For each changed game, verify:

- `/games/<slug>/` loads without console errors.
- The canvas is visible and framed in portrait and landscape.
- Buttons and 3D taps work with touch input.
- No persistent back/home tab overlaps the game.
- `/games/<slug>/manifest.webmanifest` returns 200.
- `/games/<slug>/app.js` returns 200.
- `/games/<slug>/sw.js` returns 200.
- `/games/<slug>/icons/apple-touch-icon.png` returns 200.
- `/games/<slug>/icons/favicon-32.png` returns 200.

For iPad-specific changes, add the page to the home screen from Safari and confirm it opens standalone with the expected icon and title.
