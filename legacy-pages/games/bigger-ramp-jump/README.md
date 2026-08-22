# 🚗💨 Bigger Ramp Jump!

A browser-based ramp jump game where kids practice number recognition and comparison — by launching cars off ramps! Built for toddlers and young children (ages 3–6).

**No install. No app store. Just open and play.**

## 🎮 How to Play

1. **Type the numbers** — Two ramps appear with numbers on them. Type each number into the matching input box to unlock the round (sneaky number recognition practice!)
2. **Pick the BIGGER ramp** — Tap/click the side of the screen with the bigger number
3. **Watch your car fly!** — The bigger the number, the higher the jump. Pick right and you get a HUGE launch with confetti 🎉. Pick wrong and... small jump 😔

## ✨ Features

- **7 difficulty levels** — from *Bunny Hops* (1–9) to *ULTIMATE!* (100–999)
- **Adaptive difficulty** — 5 correct in a row levels you up; too many misses brings you back down
- **Number typing gate** — kids must type both ramp numbers before choosing, reinforcing number recognition
- **Streak tracking** — visual dot indicators show recent performance
- **Real 3D graphics** — a Three.js stunt arena with a chunky car, shadows, and a dusk sky
- **Real jump physics** — gravity-driven projectile arcs; launch speed and angle come from the ramp, so a bigger number really does throw the car higher and farther, with the car's nose following the arc
- **Dust + suspension** — dust kicks up on the climb and landing, and the car squashes on impact
- **Sound effects** — engine revs, launch whooshes, victory chimes, and landing thuds (all generated with Web Audio API, no files to load)
- **Confetti explosions** on correct answers
- **Dusk sky** with twinkling stars and a setting sun
- **Random car colors** each round — because variety matters when you're 3
- **Level picker** — tap the level badge to jump to any difficulty
- **Fully responsive** — works on phones, tablets, and desktops

## 🖥️ Tech Stack

- **Single `index.html` file** — the entire game
- Vanilla JavaScript with [Three.js](https://threejs.org/) (loaded from a CDN via import map) for the 3D scene
- Web Audio API for procedurally generated sound effects
- CSS for the overlay UI (confetti, shake effects, transitions)
- No build step.

## 🚀 Run It

```bash
# Clone and open
git clone https://github.com/madebydia/mama.dev.git
open mama.dev/games/bigger-ramp-jump/index.html
```

Or just download `index.html` and double-click it. That's it. It's one file.

## 📸 Gameplay

> A car sits on a dusk road between two ramps of different heights, each labeled with a number. After typing both numbers, the player taps a side to send the car racing up that ramp and soaring through the air. Pick the bigger number and the car launches sky-high with confetti raining down. Pick the smaller one and you get a sad little hop.

## 🏗️ More from madebydia

This game is part of a collection of browser games built with a 3-year-old — yes, really. Check out more at:

- 🎮 [madladstudios.com](https://madladstudios.com) — games built by a toddler and his mom
- 🐙 [github.com/madebydia](https://github.com/madebydia) — tools, games, and projects

## 📄 License

MIT — do whatever you want with it. If your kid likes it, that's all the credit needed.
