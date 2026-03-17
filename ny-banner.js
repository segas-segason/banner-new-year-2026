(() => {
  const banner = document.querySelector('.ny-banner__inner');
  const layer = document.querySelector('.ny-banner__snow');
  if (!banner || !layer) return;

  const FLAKES = [
    { src: './img/snowflake/snowflake-1.png', min: 14, max: 22 },
    { src: './img/snowflake/snowflake-2.png', min: 18, max: 28 },
    { src: './img/snowflake/snowflake-3.png', min: 22, max: 36 },
    { src: './img/snowflake/snowflake-4.png', min: 16, max: 26 },
    { src: './img/snowflake/snowflake-5.png', min: 26, max: 44 },
    { src: './img/snowflake/snowflake-6.png', min: 20, max: 32 },
  ];

  const MAX_FLAKES = 70;
  const TARGET = 35;

  const rand = (a, b) => Math.random() * (b - a) + a;
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  let rect = banner.getBoundingClientRect();
  let w = rect.width, h = rect.height;

  const measure = () => {
    rect = banner.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
  };

  const ro = new ResizeObserver(measure);
  ro.observe(banner);
  measure();

  const onEnd = (e) => {
    if (e.animationName === 'ny-fall') e.currentTarget.remove();
  };

  function spawn(initial = false) {
    if (layer.childElementCount >= MAX_FLAKES) return;

    const f = pick(FLAKES);
    const img = document.createElement('img');
    img.className = 'ny-banner__flake';
    img.src = f.src;
    img.alt = '';

    const size = rand(f.min, f.max);
    const x = rand(0, Math.max(0, w - size));

    img.style.setProperty('--fall-distance', `${h + 160}px`);

    const fallSec = rand(12, 24);
    const driftSec = rand(2.4, 5.2);
    const fallDelay = initial ? rand(-fallSec, 0) : rand(0, 1.2);
    const driftDelay = rand(0, 1.5);

    img.style.width = `${size}px`;
    img.style.left = `${x}px`;
    img.style.animationDuration = `${fallSec}s, ${driftSec}s`;
    img.style.animationDelay = `${fallDelay}s, ${driftDelay}s`;

    img.addEventListener('animationend', onEnd, { passive: true });
    layer.appendChild(img);
  }

  for (let i = 0; i < TARGET; i++) spawn(true);

  const loop = () => {
    const deficit = TARGET - layer.childElementCount;
    if (deficit > 0) {
      const add = Math.min(deficit, 1 + ((Math.random() * 2) | 0));
      for (let i = 0; i < add; i++) spawn(false);
    }
    setTimeout(loop, rand(120, 260));
  };

  loop();
})();

(() => {
  const hangers = Array.from(document.querySelectorAll('.ny-banner__hanger'));
  if (!hangers.length) return;

  const chain3 = document.querySelector('.ny-banner__chain3');
  const hanger3 = document.querySelector('.ny-banner__hanger--3');

  const PRESETS = [
    ['ny-banner__hanger--1', 0.8,  0.03],
    ['ny-banner__hanger--2', 1.0,  0.02],
    ['ny-banner__hanger--3', 1.25, 0.01],
    ['ny-banner__hanger--4', 0.95, 0.01],
    ['ny-banner__hanger--5', 0.85, 0.03],
  ];

  const state = hangers.map((el) => {
    let mult = 1, smooth = 0.02;
    for (const [cls, m, s] of PRESETS) {
      if (el.classList.contains(cls)) { mult = m; smooth = s; break; }
    }
    return { el, mult, smooth, angle: 0, target: 0 };
  });

  const MAX_ANGLE = 10;
  const WIND = 0.10;
  const RETURN = 0.94;
  const STOP_EPS = 0.002;
  const IDLE_MS = 120;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  let lastMove = performance.now();
  let lastX = null;
  let lastT = 0;
  let wind = 0;
  let raf = 0;

  const applyZero = () => {
    for (const s of state) s.el.style.transform = 'translateX(-50%) rotate(0deg)';
    if (chain3) chain3.style.rotate = '0deg';
  };

  function tick() {
    const now = performance.now();

    wind *= RETURN;
    if (now - lastMove > IDLE_MS) wind *= 0.80;

    for (const s of state) {
      s.target = clamp(wind * s.mult, -MAX_ANGLE, MAX_ANGLE);
      s.angle += (s.target - s.angle) * s.smooth;
      s.el.style.transform = `translateX(-50%) rotate(${s.angle.toFixed(2)}deg)`;
    }

    if (chain3 && hanger3) {
      const s3 = state.find((s) => s.el === hanger3);
      if (s3) chain3.style.rotate = `${s3.angle.toFixed(2)}deg`;
    }

    const moving =
      Math.abs(wind) > STOP_EPS ||
      state.some((s) => Math.abs(s.angle) > 0.05);

    if (moving) raf = requestAnimationFrame(tick);
    else { raf = 0; applyZero(); }
  }

  const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    lastMove = now;

    if (lastX == null) { lastX = e.clientX; lastT = now; start(); return; }

    const dx = e.clientX - lastX;
    const dt = Math.max(16, now - lastT);
    const speed = dx / dt;

    wind = clamp(wind + speed * 100 * WIND, -MAX_ANGLE, MAX_ANGLE);

    lastX = e.clientX;
    lastT = now;

    start();
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    lastX = null;
    wind = 0;
    start();
  });
})();
