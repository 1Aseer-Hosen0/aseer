import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export function SectionHead({ number, title, meta, mb = 'mb-10 md:mb-16', className = '' }) {
  const lineRef = useRef(null);

  useGSAP(() => {
    if (!lineRef.current) return;
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' });
    ScrollTrigger.create({
      trigger: lineRef.current,
      start: 'top 92%',
      once: true,
      onEnter: () => gsap.to(lineRef.current, { scaleX: 1, duration: 1.5, ease: 'expo.inOut' })
    });
  }, { scope: lineRef });

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between mono text-dim pb-4">
        <span>
          {number && (
            <>
              <span className="text-cyan">[{number}]</span>
              &nbsp;&nbsp;
            </>
          )}
          {title}
        </span>
        {meta && <span>{meta}</span>}
      </div>
      <div ref={lineRef} className={`hl h-px bg-white/10 ${mb}`} />
    </div>
  );
}
