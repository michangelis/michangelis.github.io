# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Michael Angeles' personal site, deployed live at michangelis.github.io. It is a
**single static site** — v1 "The Machine" — with no build step and no framework.
The full redesign catalog (v1–v6 + an earlier React/Vite build) and the Night
Engines company-site work live in a separate repo at `~/Desktop/Websites`; do not
recreate them here.

## Run / deploy

```
python3 -m http.server 4173   # local preview at http://localhost:4173
```

Deploy is automatic: `.github/workflows/deploy.yml` uploads the repo root as-is to
GitHub Pages on push to `main`. There is nothing to build — never add a build step
back unless the site stops being plain static files.

## Architecture

One WebGL scene drives the whole page. `main.js` (ES module, imports
`vendor/three.module.js`) renders ~5,200 instanced cubes in a single full-viewport
canvas and morphs them through six formations as scroll drives a cinematic camera;
`index.html` layers translucent HUD/chapter panels over the canvas and `style.css`
styles them. Key mechanics (all custom, no libraries):

- **Custom lerp scroll** — body keeps a native scrollbar via a spacer; `#content`
  is `position:fixed` and translated by a smoothed copy of `scrollY`. Touch /
  reduced-motion / no-WebGL fall back to native scroll (`body.native-scroll`).
- **Chapter float** (0..5 continuous) computed from section offsets drives camera
  keyframes, formation index, HUD state, and the morph window.

`NOTES.md` is the authoritative design story (formations, motion system, scroll
math) — read it before changing the scene.
