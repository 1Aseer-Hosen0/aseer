import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePointerFine } from '../hooks/usePointerFine';

export function Cursor() {
  const isFine = usePointerFine();
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!isFine || !ringRef.current || !dotRef.current) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;

    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });

    const onMouseMove = (e) => {
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };

    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (!target) return;
      const type = target.dataset.cursor;
      const isHello = type === 'hello';

      gsap.to(ring, { scale: isHello ? 1.9 : 1.5, duration: 0.4, ease: 'power3', overwrite: 'auto' });
      gsap.to(label, { opacity: isHello ? 1 : 0, duration: 0.2, overwrite: 'auto' });
      gsap.to(dot, { scale: 0, duration: 0.2, overwrite: 'auto' });
    };

    const onMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (!target) return;
      // Check if moving to another element inside the same cursor target
      const related = e.relatedTarget?.closest?.('[data-cursor]');
      if (related === target) return;

      if (!related) {
        gsap.to(ring, { scale: 1, duration: 0.4, ease: 'power3', overwrite: 'auto' });
        gsap.to(label, { opacity: 0, duration: 0.15, overwrite: 'auto' });
        gsap.to(dot, { scale: 1, duration: 0.2, overwrite: 'auto' });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [isFine]);

  if (!isFine) return null;

  return (
    <>
      <div
        id="cur-ring"
        ref={ringRef}
        className="fixed left-0 top-0 z-[100] pointer-events-none"
        aria-hidden="true"
      >
        <span
          id="cur-label"
          ref={labelRef}
          className="font-mono text-[9px] tracking-[.08em] text-white opacity-0"
        >
          HELLO
        </span>
      </div>
      <div
        id="cur-dot"
        ref={dotRef}
        className="fixed left-0 top-0 z-[100] pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
