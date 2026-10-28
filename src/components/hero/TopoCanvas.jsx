import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

export function TopoCanvas({ elevRef, topoAlphaRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, S = 14, cols = 0, rows = 0;
    let F = new Float32Array(0);
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let sx = mx;
    let sy = my;
    let ox = 0, oy = 0;
    let frame = 0;

    const hash = (x, y) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    };

    const noise = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      const a = hash(xi, yi), b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S = W < 768 ? 18 : 14;
      cols = Math.ceil(W / S) + 2;
      rows = Math.ceil(H / S) + 2;
      F = new Float32Array(cols * rows);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const SEG = [
      [], [3, 2], [2, 1], [3, 1], [0, 1], [0, 3, 2, 1], [0, 2], [0, 3],
      [0, 3], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], []
    ];

    function interp(e, x, y, a, b, c, d, t) {
      if (e === 0) {
        ox = x + ((t - a) / (b - a)) * S;
        oy = y;
      } else if (e === 1) {
        ox = x + S;
        oy = y + ((t - b) / (c - b)) * S;
      } else if (e === 2) {
        ox = x + ((t - d) / (c - d)) * S;
        oy = y + S;
      } else {
        ox = x;
        oy = y + ((t - a) / (d - a)) * S;
      }
    }

    const levels = Array.from({ length: 16 }, (_, i) => 0.24 + i * 0.034);

    const drawTopo = (time) => {
      const t = time * 0.00006;
      sx += (mx - sx) * 0.06;
      sy += (my - sy) * 0.06;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const nx = i * 0.05, ny = j * 0.05;
          const dx = i * S - sx, dy = j * S - sy;
          F[j * cols + i] =
            0.6 * noise(nx + t * 2, ny - t) +
            0.3 * noise(nx * 2.2 - t * 3, ny * 2.2 + t * 2) +
            0.1 * noise(nx * 4.5 + t, ny * 4.5 - t * 2) +
            0.2 * Math.exp(-(dx * dx + dy * dy) / 48000);
        }
      }

      if (frame % 8 === 0 && elevRef?.current) {
        const val = F[Math.round(sy / S) * cols + Math.round(sx / S)] || 0;
        elevRef.current.textContent = val.toFixed(3);
      }

      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = topoAlphaRef?.current?.v ?? 1;
      ctx.lineWidth = 1;

      levels.forEach((lv, li) => {
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = F[j * cols + i];
            const b = F[j * cols + i + 1];
            const c = F[(j + 1) * cols + i + 1];
            const d = F[(j + 1) * cols + i];
            const s = SEG[(a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0)];
            for (let n = 0; n < s.length; n += 2) {
              interp(s[n], i * S, j * S, a, b, c, d, lv);
              ctx.moveTo(ox, oy);
              interp(s[n + 1], i * S, j * S, a, b, c, d, lv);
              ctx.lineTo(ox, oy);
            }
          }
        }
        ctx.strokeStyle = li % 4 === 0 ? 'rgba(91,220,247,.26)' : 'rgba(255,255,255,.075)';
        ctx.stroke();
      });
    };

    const tickerCb = (time) => {
      if (window.scrollY < window.innerHeight * 1.05 && frame++ % 2 === 0) {
        drawTopo(time);
      }
    };

    gsap.ticker.add(tickerCb);

    return () => {
      gsap.ticker.remove(tickerCb);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [elevRef, topoAlphaRef]);

  return <canvas ref={canvasRef} id="topo" className="absolute inset-0 w-full h-full" />;
}
