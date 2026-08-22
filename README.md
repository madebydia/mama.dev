# mama.dev

Small things built for a small person.

A Hugo-built collection of tools, games, stories, and printables a developer
mom makes for her kid. Existing standalone apps stay self-contained; Hugo gives
every rendered page one shared metadata and analytics head.

**Live at:** [mama.dev](https://mama.dev)

## Build

```sh
./scripts/build-repo-activity.sh
hugo --gc --minify --printPathWarnings
./scripts/verify-site.sh
```

The generated site is written to `public/`. GitHub Pages builds and deploys the
same command from `.github/workflows/hugo.yaml`.

The homepage repository activity tile is generated from Git history. Each dot
represents one real commit; GitHub Pages checks out the complete history and
refreshes the data before each build.

Site-wide metadata and Plausible configuration live in
`layouts/partials/head.html`. The existing app documents are retained under
`legacy-pages/`; Hugo removes their old metadata and analytics snippets, adds
the shared head, and republishes them at their original URLs.

The verification script fails the build if any HTML page is missing the shared
Plausible script, contains it more than once, or drops a required public route.

## Projects

| Project | What it is |
|---------|-----------|
| [one-true-story](https://mama.dev/one-true-story/) | Printable nonfiction stories for early readers. Real photos, big facts |
| [word-train](https://mama.dev/games/word-train/) | A phonics game — build words by snapping train cars together |
| [bigger-ramp-jump](https://mama.dev/games/bigger-ramp-jump/) | Adjust ramp height and angle, launch the truck |
| [bigger-than-race](https://mama.dev/games/bigger-than-race/) | Number comparison racing game with adaptive difficulty |
| [shapes](https://mama.dev/games/shapes/) | 2D and 3D shapes that reveal their names when you tap them |
| [what-to-eat](https://mama.dev/what-to-eat/) | A visual food menu for when "what do you want?" gets a blank stare |
| [2026-calendar](https://mama.dev/2026-calendar/) | Interactive holiday calendar with confetti and animations |
| [worksheets](https://mama.dev/worksheets/) | Printable worksheet PDF gallery with direct downloads |

## Why

My son is 3. These are the things I build for him — games, tools, stories. Each one solves a real problem or teaches a real thing. No frameworks, no build steps. Just HTML files that work.

---

Made by [@madebydia](https://x.com/madebydia)
