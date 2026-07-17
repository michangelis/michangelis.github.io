# v1 — "THE MACHINE"

## 1. Concept & design story
The agent OS as a physical machine. One full-viewport Three.js scene — ~5,200 instanced
cubes forming a single engineered structure — is the site's protagonist. Scroll drives a
cinematic camera and morphs the structure through six formations, one per chapter:

| Chapter | Formation | Reading |
|---|---|---|
| 00 INIT | **MONOLITH** — tall lattice slab, stray debris | the thing being built |
| 01 READOUT | **TERRAIN** — waveform instrument floor | production telemetry |
| 02 AGENT OS | **TRIAD** — three interlocked rings + core | the three pillars |
| 03 RECORD | **PIPELINE** — 7 zigzag clusters threaded by a rod, acid data packets streaming through | the 7-agent claims pipeline |
| 04 STACK | **STRATA** — five floating quantized layers | the stack |
| 05 SIGNAL | **CORE** — fibonacci shell + inner ember | open channel |

HTML chapters layer over the canvas on translucent, backdrop-blurred panels; a persistent
mono HUD (top bar, chapter rail, bottom progress + `STRUCT:` formation readout) frames
everything like mission-control chrome.

## 2. Layout & motion system
- **Custom lerp scroll** (no library): body keeps native scrollbar via a spacer div;
  `#content` is `position:fixed` and translated by a smoothed copy of `scrollY`
  (`k = 1-(1-0.09)^(dt·60)`). Touch / reduced-motion / no-WebGL fall back to native scroll
  (`body.native-scroll`).
- **Chapter float** (0..5 continuous) is computed from section offsets; it drives camera
  keyframe interpolation, formation index, HUD state, and the morph window.
- **Morphs** run in the last 38% of each chapter (`smoothstep(0.62, 0.98, frac)`), staggered
  per instance by seed, with a mid-flight scatter term (`t(1-t)·sin(seed·k + time)`) so cubes
  fly apart and reassemble instead of tweening linearly. A `uEnergy` uniform flashes accent
  during morphs.
- **Reveals**: manual rect-check engine (works in both scroll modes); hero display lines
  stagger 90ms apart. Metric numerals count up with quartic ease on reveal.
- **Magnetic CTAs** (pointer-fine only) + cursor parallax on camera and group rotation.
- **Reduced motion**: full static render at load; on scroll the machine *snaps* to the
  chapter's formation (4 large-dt settle frames — discrete state change, no animation).
  All CSS reveals/grain disabled, counters print final values.

## 3. Type & color
- **Display**: Archivo (variable, `wdth 118`, weight 800), uppercase, line-height .94 —
  engineered Swiss slab. **Text**: Space Grotesk. **Data/HUD**: JetBrains Mono
  (metric numerals at weight 200, huge, instrument-readout style).
- **Palette**: near-black `#0a0b0d`, soft panel `rgba(10,11,13,.72–.78)` + backdrop-blur,
  ink `#e8eaed`, dim `#8a8f98`, faint `#4a4f58`, hairlines `rgba(232,234,237,.09)`, and one
  surgical accent: **acid chartreuse `#c6ff2e`** (accents, live dots, badges, ~2.8% of cubes).
- Film grain: animated SVG `feTurbulence` overlay at 50% opacity, stepped keyframes.

## 4. Techniques worth stealing
- **One InstancedMesh, positions-only writes**: per-instance rotation+scale 3×3 blocks are
  precomputed into the instance matrix once; per frame only elements 12–14 (translation) are
  written from a `cur` Float32Array that chases the morph target with frame-rate-independent
  lerp (`1-0.001^dt`). 5,200 instances stay 60fps without a worker.
- **Custom ShaderMaterial**: two-light lambert + per-instance breathing scale (vertex),
  seed-gated acid instances with pulse, a scan wave sweeping world-Y, morph energy flash,
  and a `uFlow`-gated packet band (`fract((x - t·1.6)·0.24)`) that streams pulses down the
  pipeline only near chapter 3 (`uFlow = max(0, 1-|c-3.3|/0.7)`). Manual fog in-shader
  (near 9.5 / far 26) matched to scene fog for the Points dust.
- **Poor man's bloom**: additive radial-gradient CanvasTexture sprite loosely tracking the
  camera look target, plus additive dust Points.
- **Camera as narrative**: 6 keyframes `[pos, look, groupRotY]` lerped by eased chapter
  fraction, then double-smoothed (`1-0.005^dt`) so anchor jumps still ride smoothly.
- **Formation readout HUD**: bottom-left `STRUCT: PIPELINE` label ties the 3D state to the
  chrome — cheap, but makes the machine feel instrumented.

## 5. Assets
**All procedural.** No AI-generated or external assets: geometry, textures (canvas radial
gradients), grain (inline SVG turbulence), favicon (inline SVG) are all code. Fonts via
Google Fonts; three.js r160 vendored locally (`vendor/three.module.js`).

## 6. Reproduction notes
Plain HTML/CSS/JS, no build. Serve the folder statically (paths are relative). The only
heavy knobs: `COUNT` (5200 desktop / 1900 mobile), pixel ratio cap (2 / 1.6), fog
near/far, and the six formation generators — each is a pure function returning
`Float32Array(COUNT*3)`, so new chapters = new generator + camera keyframe + HUD name.
If you copy one thing, copy the morph recipe: hold → staggered smoothstep window at the
chapter boundary → scatter term → per-instance chase lerp. That's what makes it feel like
a machine reconfiguring rather than a particle tween.
