import React, { useEffect, useRef } from 'react';
import { useLenis } from '../lib/LenisProvider';

export function ScrollRail({ railRef }) {
  const lenis = useLenis();
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const pctRef = useRef(null);
  const TH = 64;

  useEffect(() => {
    if (!lenis || !trackRef.current || !thumbRef.current || !pctRef.current) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    const pct = pctRef.current;

    const onScroll = ({ scroll, limit }) => {
      const p = limit ? scroll / limit : 0;
      const trackHeight = track.clientHeight;
      thumb.style.top = `${p * (trackHeight - TH)}px`;
      pct.textContent = String(Math.round(p * 100)).padStart(3, '0');
    };

    lenis.on('scroll', onScroll);

    let drag = false;
    const seek = (e, now) => {
      const r = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (e.clientY - r.top - TH / 2) / (r.height - TH)));
      lenis.scrollTo(p * lenis.limit, { immediate: now });
    };

    const onPointerDown = (e) => {
      drag = true;
      track.classList.add('on');
      track.setPointerCapture(e.pointerId);
      seek(e, e.target === thumb);
    };

    const onPointerMove = (e) => {
      if (drag) seek(e, true);
    };

    const onPointerUp = () => {
      drag = false;
      track.classList.remove('on');
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);

    return () => {
      lenis.off('scroll', onScroll);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
    };
  }, [lenis]);

  return (
    <aside
      ref={railRef}
      className="fixed right-0 top-16 bottom-0 w-10 md:w-14 z-[60] border-l border-hair bg-base/70 backdrop-blur-[16px] select-none"
      aria-label="Scroll progress"
    >
      <span
        ref={pctRef}
        id="pct"
        className="absolute top-5 inset-x-0 text-center font-mono text-[10px] tracking-[.08em] text-mute tabular-nums"
      >
        000
      </span>
      <div
        ref={trackRef}
        id="track"
        className="absolute inset-x-0 top-14 bottom-28 cursor-pointer touch-none"
        data-cursor="link"
      >
        <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-px bg-white/10" />
        <div
          ref={thumbRef}
          id="thumb"
          className="absolute left-1/2 top-0 h-16 w-[3px] rounded-full bg-cyan"
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>
      <span className="absolute bottom-6 inset-x-0 flex justify-center font-mono text-[10px] tracking-[.08em] text-dim [writing-mode:vertical-rl]">
        Scroll
      </span>
    </aside>
  );
}
