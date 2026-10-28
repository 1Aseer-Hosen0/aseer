import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export function SplitWords({ text, as: Tag = 'h2', className = '', delay = 0, triggerStart = 'top 88%' }) {
  const elRef = useRef(null);
  const words = text.trim().split(/\s+/);

  useGSAP(() => {
    if (!elRef.current) return;
    const wi = elRef.current.querySelectorAll('.wi');
    if (!wi.length) return;

    gsap.set(wi, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: elRef.current,
      start: triggerStart,
      once: true,
      onEnter: () => {
        gsap.to(wi, {
          yPercent: 0,
          duration: 1.3,
          stagger: 0.07,
          ease: 'expo.out',
          delay
        });
      }
    });
  }, { scope: elRef });

  return (
    <Tag ref={elRef} className={className} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className="wi">{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}
