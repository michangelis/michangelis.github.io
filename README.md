# michangelis.github.io

Michael Angeles' personal site, deployed live at
[michangelis.github.io](https://michangelis.github.io).

This is **v1 — "The Machine"**: a single full-viewport Three.js scene (~5,200
instanced cubes) that morphs through six formations as scroll drives a cinematic
camera. Pure static site — HTML/CSS/JS with vendored three.js, no build step. See
`NOTES.md` for the design story.

## Run locally

```
python3 -m http.server 4173   # open http://localhost:4173
```

## Deploy

`.github/workflows/deploy.yml` uploads the repo root straight to GitHub Pages on
push to `main` — nothing to build.

## The rest of the experiments

The full redesign catalog (v1–v6 + the earlier React/Vite build) and the Night
Engines company-site work now live in the separate `Websites` repo
(`~/Desktop/Websites`).
