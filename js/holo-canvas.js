/* ═══════════════════════════════════════════════
   holo-canvas.js — Holographic interference animation
   Runs only on pages with #holo-canvas
   ═══════════════════════════════════════════════ */

(function initHoloCanvas() {
  const canvas = document.getElementById('holo-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, t = 0;
  let mx = 0.5, my = 0.5;
  let animId;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function draw() {
    t += 0.008;
    ctx.clearRect(0, 0, W, H);

    // Dark base
    ctx.fillStyle = '#0d0d10';
    ctx.fillRect(0, 0, W, H);

    const imgData = ctx.createImageData(W, H);
    const d = imgData.data;

    // Source positions: drift slowly + subtle mouse follow
    const s1x = W * (0.28 + 0.06 * Math.sin(t * 0.7) + (mx - 0.5) * 0.08);
    const s1y = H * (0.45 + 0.04 * Math.cos(t * 0.5));
    const s2x = W * (0.72 + 0.05 * Math.cos(t * 0.6) + (mx - 0.5) * 0.08);
    const s2y = H * (0.55 + 0.06 * Math.sin(t * 0.8) + (my - 0.5) * 0.06);

    const k = 0.045;

    // Render at 2×2 pixel blocks for perf
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        const r1 = Math.sqrt((x - s1x) ** 2 + (y - s1y) ** 2);
        const r2 = Math.sqrt((x - s2x) ** 2 + (y - s2y) ** 2);

        // Per-channel chromatic dispersion
        const phaseR = k * 0.97 * (r1 - r2) + t * 0.28;
        const phaseG = k * 1.00 * (r1 - r2) + t * 0.30;
        const phaseB = k * 1.04 * (r1 - r2) + t * 0.33;

        const iR = 0.5 + 0.5 * Math.cos(phaseR);
        const iG = 0.5 + 0.5 * Math.cos(phaseG);
        const iB = 0.5 + 0.5 * Math.cos(phaseB);

        // Radial fade from center
        const cx = x / W - 0.5;
        const cy = y / H - 0.5;
        const fade = Math.max(0, 1 - (cx * cx + cy * cy) * 3.2);

        const base = 8;
        const amp  = 70;

        const r = Math.round(base + iR * amp * fade);
        const g = Math.round(base + iG * amp * fade * 1.1);
        const b = Math.round(base + iB * amp * fade * 1.4); // teal bias

        // Fill 2×2 block
        for (let dy = 0; dy < 2 && (y + dy) < H; dy++) {
          for (let dx = 0; dx < 2 && (x + dx) < W; dx++) {
            const j = ((y + dy) * W + (x + dx)) * 4;
            d[j]     = r;
            d[j + 1] = g;
            d[j + 2] = b;
            d[j + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    animId = requestAnimationFrame(draw);
  }

  // Pause when not visible (perf)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animId) draw();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
  });
  observer.observe(canvas);

  window.addEventListener('resize', resize, { passive: true });

  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = (e.clientX - rect.left) / rect.width;
    my = (e.clientY - rect.top)  / rect.height;
  }, { passive: true });

  resize();
  draw();
})();
