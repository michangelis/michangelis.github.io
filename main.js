/* ============================================================
   THE MACHINE — scroll-driven instanced-cube monolith
   All procedural. three.js r160, custom GLSL.
   ============================================================ */
import * as THREE from './vendor/three.module.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE  = matchMedia('(pointer: coarse)').matches;
const MOBILE  = innerWidth < 760;
const NATIVE  = COARSE || REDUCED;            // native scroll modes

const content = document.getElementById('content');
const spacer  = document.getElementById('scroll-space');
const canvas  = document.getElementById('gl');

if (NATIVE) document.body.classList.add('native-scroll');

/* ---------------------------------------------------------- *
 *  DOM UTILITIES — clock, counters, reveals, magnetic, rail
 * ---------------------------------------------------------- */

// Athens clock
const clockEl = document.getElementById('clock');
const clockFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit',
  second: '2-digit', hour12: false,
});
const tickClock = () => { clockEl.textContent = clockFmt.format(new Date()); };
tickClock(); setInterval(tickClock, 1000);

// Count-up
function runCounter(el) {
  const end = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  if (REDUCED) { el.textContent = end.toLocaleString('en-US') + suffix; return; }
  const t0 = performance.now(), dur = 1500;
  (function step(t) {
    const p = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(end * e).toLocaleString('en-US') + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

// Reveal engine (manual — works in both transform & native scroll modes)
let revealables = [...document.querySelectorAll('[data-reveal]')];
function checkReveals() {
  if (!revealables.length) return;
  const vh = innerHeight;
  revealables = revealables.filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.88 && r.bottom > 0) {
      el.classList.add('in');
      el.querySelectorAll('.count').forEach(runCounter);
      return false;
    }
    return true;
  });
}
if (REDUCED) {
  revealables.forEach((el) => el.querySelectorAll('.count').forEach(runCounter));
  revealables = [];
}

// Magnetic buttons
if (!COARSE && !REDUCED) {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.3}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
      btn.style.transform = '';
      setTimeout(() => (btn.style.transition = ''), 500);
    });
  });
}

/* ---------------------------------------------------------- *
 *  SMOOTH SCROLL (custom lerp — no library)
 * ---------------------------------------------------------- */
const sections = [...document.querySelectorAll('.chapter')];
let tops = [];
let maxScroll = 1;

function measure() {
  if (!NATIVE) spacer.style.height = content.scrollHeight + 'px';
  tops = sections.map((s) => s.offsetTop);
  maxScroll = Math.max(1, content.scrollHeight - innerHeight);
}
measure();
addEventListener('load', measure);
document.fonts?.ready.then(measure);
addEventListener('resize', () => { measure(); });

let smooth = window.scrollY;
let chapterFloat = 0;

// Anchor links → drive window scroll (lerp animates the ride)
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop, behavior: NATIVE ? 'smooth' : 'auto' });
  });
});

// HUD refs
const pbar = document.getElementById('pbar');
const chlabel = document.getElementById('chlabel');
const formlabel = document.getElementById('formlabel');
const railLinks = [...document.querySelectorAll('.hud-rail a')];
const CH_NAMES = ['INIT', 'READOUT', 'AGENT OS', 'RECORD', 'STACK', 'SIGNAL'];
const FORM_NAMES = ['SCROLL — STRUCT: MONOLITH', 'STRUCT: TERRAIN', 'STRUCT: TRIAD', 'STRUCT: PIPELINE', 'STRUCT: STRATA', 'STRUCT: CORE'];
let lastCh = -1;

function updateScroll(dt) {
  const target = window.scrollY;
  if (NATIVE) {
    smooth = target;
  } else {
    const k = 1 - Math.pow(1 - 0.09, dt * 60);
    smooth += (target - smooth) * k;
    if (Math.abs(target - smooth) < 0.05) smooth = target;
    content.style.transform = `translate3d(0, ${-smooth.toFixed(2)}px, 0)`;
  }

  // chapter float 0..5
  let c = 0;
  const probe = smooth + innerHeight * 0.12;
  for (let i = 0; i < tops.length; i++) {
    const a = tops[i];
    const b = i < tops.length - 1 ? tops[i + 1] : content.scrollHeight;
    if (probe >= a) c = i + Math.min(1, (probe - a) / Math.max(1, b - a));
  }
  chapterFloat = Math.min(5, c);

  // HUD
  pbar.style.width = (Math.min(1, smooth / maxScroll) * 100).toFixed(2) + '%';
  const ch = Math.min(5, Math.round(chapterFloat - 0.18));
  if (ch !== lastCh) {
    lastCh = ch;
    chlabel.textContent = String(ch).padStart(2, '0') + ' / ' + CH_NAMES[ch];
    formlabel.textContent = FORM_NAMES[ch];
    railLinks.forEach((l, i) => l.classList.toggle('active', i === ch));
  }
  checkReveals();
}

/* ---------------------------------------------------------- *
 *  THREE — THE MACHINE
 * ---------------------------------------------------------- */
let three = null;

function initThree() {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: !MOBILE, powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE ? 1.6 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x0a0b0d, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0b0d, 10, 26);

  const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 60);
  camera.position.set(0, 0.4, 10);

  const COUNT = MOBILE ? 1900 : 5200;

  /* ---------- formation generators (each returns COUNT*3 floats) ---------- */
  const rand = (() => { let s = 1717; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const gauss = () => (rand() + rand() + rand() + rand() - 2) / 2;

  function fMonolith() {
    // tall lattice slab, ragged crown
    const a = new Float32Array(COUNT * 3);
    const nx = 12, nz = 7, cell = 0.15;
    const ny = Math.ceil(COUNT / (nx * nz));
    for (let i = 0; i < COUNT; i++) {
      const ix = i % nx, iz = ((i / nx) | 0) % nz, iy = (i / (nx * nz)) | 0;
      a[i * 3]     = (ix - (nx - 1) / 2) * cell + (rand() - 0.5) * 0.02;
      a[i * 3 + 1] = (iy - ny / 2) * (cell * 0.78) + (rand() - 0.5) * 0.02;
      a[i * 3 + 2] = (iz - (nz - 1) / 2) * cell + (rand() - 0.5) * 0.02;
      if (rand() > 0.985) { // stray debris orbiting the slab
        a[i * 3] += (rand() - 0.5) * 3.2;
        a[i * 3 + 2] += (rand() - 0.5) * 2.2;
      }
    }
    return a;
  }

  function fTerrain() {
    // instrument terrain — waveform floor
    const a = new Float32Array(COUNT * 3);
    const nx = Math.round(Math.sqrt(COUNT * 2)), nz = Math.ceil(COUNT / nx);
    for (let i = 0; i < COUNT; i++) {
      const ix = i % nx, iz = (i / nx) | 0;
      const x = (ix / (nx - 1) - 0.5) * 15;
      const z = (iz / (nz - 1) - 0.5) * 7.5;
      const y = 0.55 * Math.sin(x * 0.9) * Math.cos(z * 0.8)
              + 0.3 * Math.sin(x * 2.1 + z * 1.4)
              + 0.12 * Math.sin(x * 5.0);
      a[i * 3] = x; a[i * 3 + 1] = y - 2.6; a[i * 3 + 2] = z;
    }
    return a;
  }

  function fTriad() {
    // three interlocked rings + shared core — the three pillars
    const a = new Float32Array(COUNT * 3);
    const R = 2.7, r = 1.6;
    for (let i = 0; i < COUNT; i++) {
      if (i % 10 === 9) { // core cloud
        a[i * 3] = gauss() * 0.45; a[i * 3 + 1] = gauss() * 0.45; a[i * 3 + 2] = gauss() * 0.45;
        continue;
      }
      const k = i % 3;
      const a0 = (k / 3) * Math.PI * 2 + Math.PI / 6;
      const cx = Math.cos(a0) * R, cy = Math.sin(a0) * R * 0.62;
      const t = rand() * Math.PI * 2;
      // ring in a plane tilted per pillar
      const px = Math.cos(t) * r, py = Math.sin(t) * r;
      const tilt = a0 + Math.PI / 2;
      a[i * 3]     = cx + px * Math.cos(tilt) + gauss() * 0.05;
      a[i * 3 + 1] = cy + py * 0.9 + gauss() * 0.05;
      a[i * 3 + 2] = px * Math.sin(tilt) * 0.7 + gauss() * 0.05;
    }
    return a;
  }

  function fPipeline() {
    // 7 agent clusters along a conveyor + thin data rod
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const hAt = (j) => ((Math.min(6, Math.max(0, j)) % 2) - 0.5) * 1.5;
      if (i % 5 === 4) { // the rod — threads through the zigzag clusters
        const x = (rand() - 0.5) * 14.2;
        const jf = x / 2.3 + 3;
        const j0 = Math.floor(jf), t = jf - j0;
        a[i * 3] = x;
        a[i * 3 + 1] = hAt(j0) * (1 - t) + hAt(j0 + 1) * t + gauss() * 0.05;
        a[i * 3 + 2] = gauss() * 0.05;
      } else {
        const j = i % 7;
        a[i * 3]     = (j - 3) * 2.3 + gauss() * 0.42;
        a[i * 3 + 1] = hAt(j) + gauss() * 0.42;
        a[i * 3 + 2] = gauss() * 0.42;
      }
    }
    return a;
  }

  function fStrata() {
    // 5 floating layers — the stack
    const a = new Float32Array(COUNT * 3);
    const cell = 0.17;
    for (let i = 0; i < COUNT; i++) {
      const layer = i % 5;
      const w = 3.1 - layer * 0.26; // narrower toward the top
      a[i * 3]     = Math.round(((rand() - 0.5) * 2 * w) / cell) * cell;
      a[i * 3 + 1] = (layer - 2) * 0.98 - 0.5 + (rand() - 0.5) * 0.05;
      a[i * 3 + 2] = Math.round(((rand() - 0.5) * 3.0) / cell) * cell;
    }
    return a;
  }

  function fCore() {
    // signal sphere — fibonacci shell + inner ember
    const a = new Float32Array(COUNT * 3);
    const N = COUNT, PHI = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      if (i % 6 === 5) {
        a[i * 3] = gauss() * 0.5; a[i * 3 + 1] = gauss() * 0.5; a[i * 3 + 2] = gauss() * 0.5;
        continue;
      }
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = PHI * i;
      const R = 2.35 + (rand() - 0.5) * 0.12;
      a[i * 3] = Math.cos(th) * rad * R;
      a[i * 3 + 1] = y * R;
      a[i * 3 + 2] = Math.sin(th) * rad * R;
    }
    return a;
  }

  const formations = [fMonolith(), fTerrain(), fTriad(), fPipeline(), fStrata(), fCore()];

  /* ---------- instanced mesh + custom shader ---------- */
  const geo = new THREE.BoxGeometry(0.075, 0.075, 0.075);
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) seeds[i] = rand();
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));

  const uniforms = {
    uTime: { value: 0 },
    uAccent: { value: new THREE.Color('#c6ff2e') },
    uFogColor: { value: new THREE.Color('#0a0b0d') },
    uFogNear: { value: 9.5 },
    uFogFar: { value: 26 },
    uEnergy: { value: 0 }, // spikes during morphs
    uFlow: { value: 0 },   // data packets along the pipeline (record chapter)
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */`
      attribute float aSeed;
      varying vec3 vN;
      varying vec3 vW;
      varying float vSeed;
      uniform float uTime;
      void main() {
        vSeed = aSeed;
        // breathing scale per instance
        float br = 0.78 + 0.34 * sin(uTime * 0.9 + aSeed * 6.2831);
        vec3 p = position * br;
        vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform vec3 uAccent;
      uniform vec3 uFogColor;
      uniform float uFogNear, uFogFar, uEnergy, uFlow;
      varying vec3 vN; varying vec3 vW; varying float vSeed;
      void main() {
        vec3 n = normalize(vN);
        float key = max(dot(n, normalize(vec3(0.45, 0.85, 0.35))), 0.0);
        float fill = max(dot(n, normalize(vec3(-0.6, -0.15, 0.7))), 0.0);
        vec3 col = vec3(0.06) + vec3(0.19, 0.20, 0.22) * key + vec3(0.055, 0.065, 0.075) * fill;
        // acid instances — live cells
        float isAcc = step(0.972, vSeed);
        float pulse = 0.5 + 0.5 * sin(uTime * 1.6 + vW.y * 1.3 + vSeed * 40.0);
        col = mix(col, uAccent * (0.55 + 1.1 * pulse), isAcc);
        // scan wave sweeping the structure
        float wave = smoothstep(0.965, 1.0, sin(uTime * 0.55 + vW.y * 0.75 + vW.x * 0.2));
        col += uAccent * wave * 0.10;
        // morph energy flash
        col += uAccent * uEnergy * (0.10 + 0.25 * vSeed);
        // data packets streaming down the pipeline (record chapter only)
        float band = fract((vW.x - uTime * 1.6) * 0.24);
        float pk = smoothstep(0.0, 0.07, band) * smoothstep(0.15, 0.07, band);
        col += uAccent * pk * uFlow * 0.45;
        // depth fog
        float d = length(vW - cameraPosition);
        col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, d));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });

  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  const group = new THREE.Group();
  group.add(mesh);
  scene.add(group);

  // precompute static per-instance rotation*scale (3x3), write positions per frame
  const mArr = mesh.instanceMatrix.array;
  const rotBlocks = new Float32Array(COUNT * 9);
  const tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), tmpM = new THREE.Matrix4();
  for (let i = 0; i < COUNT; i++) {
    tmpE.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
    tmpQ.setFromEuler(tmpE);
    const s = 0.7 + rand() * 0.75;
    tmpM.compose(new THREE.Vector3(), tmpQ, new THREE.Vector3(s, s, s));
    const e = tmpM.elements;
    const o9 = i * 9, o16 = i * 16;
    rotBlocks.set([e[0], e[1], e[2], e[4], e[5], e[6], e[8], e[9], e[10]], o9);
    mArr[o16] = e[0]; mArr[o16 + 1] = e[1]; mArr[o16 + 2] = e[2]; mArr[o16 + 3] = 0;
    mArr[o16 + 4] = e[4]; mArr[o16 + 5] = e[5]; mArr[o16 + 6] = e[6]; mArr[o16 + 7] = 0;
    mArr[o16 + 8] = e[8]; mArr[o16 + 9] = e[9]; mArr[o16 + 10] = e[10]; mArr[o16 + 11] = 0;
    mArr[o16 + 15] = 1;
  }

  // current positions start at monolith
  const cur = Float32Array.from(formations[0]);

  /* ---------- dust ---------- */
  const DUST = MOBILE ? 160 : 480;
  const dGeo = new THREE.BufferGeometry();
  const dPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST * 3; i++) dPos[i] = (rand() - 0.5) * 24;
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dustTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(198,255,46,0.85)');
    grad.addColorStop(0.35, 'rgba(198,255,46,0.18)');
    grad.addColorStop(1, 'rgba(198,255,46,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const dust = new THREE.Points(dGeo, new THREE.PointsMaterial({
    map: dustTex, size: 0.085, transparent: true, opacity: 0.48,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }));
  scene.add(dust);

  // soft glow sprite behind the structure (poor man's bloom)
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(198,255,46,0.16)');
    grad.addColorStop(0.4, 'rgba(198,255,46,0.05)');
    grad.addColorStop(1, 'rgba(198,255,46,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  })();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
  }));
  glow.scale.set(11, 11, 1);
  glow.position.z = -2.5;
  scene.add(glow);

  /* ---------- camera keyframes (chapter starts) ---------- */
  // [pos, look, groupRotY]
  const KEYS = [
    [new THREE.Vector3(-1.2, 0.1, 9.6),  new THREE.Vector3(-2.5, 0.35, 0), 0.15], // 0 hero — monolith right
    [new THREE.Vector3(0, 3.6, 9.2),     new THREE.Vector3(0, -1.6, 0),    0.0 ], // 1 metrics — terrain below
    [new THREE.Vector3(0, 0.5, 9.4),     new THREE.Vector3(0, 0.35, 0),    0.35], // 2 os — triad center
    [new THREE.Vector3(-5.2, 0.9, 7.4),  new THREE.Vector3(-3.4, 0.1, 0),  0.0 ], // 3 record — pipeline left end, close
    [new THREE.Vector3(5.2, 2.5, 12.6),  new THREE.Vector3(1.5, -0.85, 0), -0.35], // 4 stack — strata right, held low under the headline
    [new THREE.Vector3(0, 0.15, 9.3),    new THREE.Vector3(0, 0.3, 0),     0.0 ], // 5 signal — core center
  ];

  const camPos = new THREE.Vector3().copy(KEYS[0][0]);
  const camLook = new THREE.Vector3().copy(KEYS[0][1]);
  const wantPos = new THREE.Vector3(), wantLook = new THREE.Vector3();

  /* ---------- mouse parallax ---------- */
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  if (!COARSE) addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });

  const smoothstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  let energy = 0;

  function renderFrame(time, dt) {
    const c = chapterFloat;
    const i = Math.min(4, Math.floor(c));
    const frac = c - i;

    // ---- morph: hold formation, transform through boundary window ----
    const mT = smoothstep(0.62, 0.98, frac);
    const A = formations[i], B = formations[Math.min(5, i + 1)];
    const morphActive = mT > 0.0001 && mT < 0.9999;
    energy += ((morphActive ? 1 : 0) - energy) * (1 - Math.pow(0.02, dt));
    uniforms.uEnergy.value = energy * 0.55;
    // packet flow ramps in around the record chapter (pipeline formation)
    uniforms.uFlow.value = Math.max(0, 1 - Math.abs(c - 3.3) / 0.7);

    const lerpK = 1 - Math.pow(0.001, dt); // per-instance chase
    for (let n = 0; n < COUNT; n++) {
      const o3 = n * 3, o16 = n * 16;
      const sd = seeds[n];
      // staggered morph per instance
      const tt = smoothstep(sd * 0.35, 0.65 + sd * 0.35, mT);
      let tx = A[o3] + (B[o3] - A[o3]) * tt;
      let ty = A[o3 + 1] + (B[o3 + 1] - A[o3 + 1]) * tt;
      let tz = A[o3 + 2] + (B[o3 + 2] - A[o3 + 2]) * tt;
      // scatter during flight
      const fl = tt * (1 - tt) * 4;
      tx += Math.sin(sd * 91.7 + time * 0.8) * fl * 0.5;
      ty += Math.cos(sd * 57.3 + time * 0.7) * fl * 0.4;
      tz += Math.sin(sd * 33.1 + time * 0.9) * fl * 0.4;
      cur[o3]     += (tx - cur[o3]) * lerpK;
      cur[o3 + 1] += (ty - cur[o3 + 1]) * lerpK;
      cur[o3 + 2] += (tz - cur[o3 + 2]) * lerpK;
      mArr[o16 + 12] = cur[o3];
      mArr[o16 + 13] = cur[o3 + 1];
      mArr[o16 + 14] = cur[o3 + 2];
    }
    mesh.instanceMatrix.needsUpdate = true;

    // ---- camera along keyframes ----
    const e2 = smoothstep(0, 1, frac);
    wantPos.lerpVectors(KEYS[i][0], KEYS[Math.min(5, i + 1)][0], e2);
    wantLook.lerpVectors(KEYS[i][1], KEYS[Math.min(5, i + 1)][1], e2);
    const rotY = KEYS[i][2] + (KEYS[Math.min(5, i + 1)][2] - KEYS[i][2]) * e2;

    const ck = 1 - Math.pow(0.005, dt);
    camPos.lerp(wantPos, ck);
    camLook.lerp(wantLook, ck);

    // cursor parallax
    mouse.sx += (mouse.x - mouse.sx) * (1 - Math.pow(0.002, dt));
    mouse.sy += (mouse.y - mouse.sy) * (1 - Math.pow(0.002, dt));

    camera.position.set(
      camPos.x + mouse.sx * 0.55,
      camPos.y - mouse.sy * 0.4,
      camPos.z,
    );
    camera.lookAt(camLook);

    group.rotation.y = rotY + Math.sin(time * 0.08) * 0.04 + mouse.sx * 0.03;
    dust.rotation.y = time * 0.012;

    // glow follows the look target loosely
    glow.position.x += (camLook.x - glow.position.x) * 0.02;
    glow.position.y += (camLook.y - glow.position.y) * 0.02;
    glow.material.opacity = 0.7 + 0.3 * Math.sin(time * 0.7);

    uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener('resize', resize);

  return { renderFrame, resize };
}

try {
  three = initThree();
} catch (err) {
  document.body.classList.add('no-webgl');
  console.warn('WebGL unavailable — static fallback active.');
}

/* ---------------------------------------------------------- *
 *  MAIN LOOP
 * ---------------------------------------------------------- */
let last = performance.now();

if (REDUCED) {
  // static beauty shots: no continuous loop; snap to the chapter's
  // formation on scroll (discrete state change, no animation)
  const settle = () => {
    if (!three) return;
    for (let k = 0; k < 4; k++) three.renderFrame(2 + k, 1);
  };
  updateScroll(0.016);
  if (three) for (let k = 0; k < 90; k++) three.renderFrame(k * 0.016, 0.016);
  addEventListener('scroll', () => { updateScroll(0.016); settle(); }, { passive: true });
  addEventListener('resize', settle);
} else {
  (function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    updateScroll(dt);
    if (three) three.renderFrame(now / 1000, dt);
    requestAnimationFrame(loop);
  })(last);
}
