import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export function SplitChars({ text, as: Tag = 'h3', className = '', wordClass = 'w', charClass = 'ch', trigger = true, delay = 0 }) {
  const elRef = useRef(null);
  const words = text.trim().split(/\s+/);

  useGSAP(() => {
    if (!trigger || !elRef.current) return;
    const chars = elRef.current.querySelectorAll(`.${charClass}`);
    if (!chars.length) return;

    gsap.set(chars, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: elRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(chars, {
          yPercent: 0,
          duration: 1.3,
          stagger: 0.04,
          ease: 'expo.out',
          delay
        });
      }
    });
  }, { scope: elRef });

  return (
    <Tag ref={elRef} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span className={wordClass} aria-hidden="true">
            {[...w].map((c, ci) => (
              <span key={ci} className={charClass}>{c}</span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}
