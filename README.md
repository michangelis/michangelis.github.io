# michangelis.github.io

Michael Angeles' personal site, deployed live at
[michangelis.github.io](https://michangelis.github.io).

## About

I'm Michael Angeles — an AI engineer in Athens building the **agent OS for
business**: a second brain and mission control for companies (now as
[Night Engines](https://nightengines.com)). I founded and led the Hellas Direct
AI lab — an 8-person team — and took its claims automation to production:
2,000+ real insurance claims, Digital Finance Awards 2026 (Best AI Initiative).
Co-founder of Mediva (smart pill dispenser → Class IIa medical device).
Previously Netcompany, Copenhagen; UniAI winner.

- GitHub: [@michangelis](https://github.com/michangelis)
- Email: angeles.michalis@gmail.com

## The site

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
