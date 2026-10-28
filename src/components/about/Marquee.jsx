import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

const MARQUEE_ITEMS = [
  'Interface design', '◆', 'Motion', '◆', 'Frontend development', '◆', 'Craft', '◆'
];

export function Marquee() {
  const mqRef = useRef(null);

  useEffect(() => {
    const mq = mqRef.current;
    if (!mq) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let x = 0;
    let dir = 1;
    let vel = 0;

    const st = ScrollTrigger.create({
      onUpdate: (s) => {
        vel = s.getVelocity();
        dir = s.direction;
      }
    });

    const tickerCb = () => {
      const half = mq.scrollWidth / 2;
      if (!half) return;
      vel *= 0.92;
      x -= dir * (1.1 + Math.abs(vel) * 0.004);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(mq, { x, skewX: gsap.utils.clamp(-10, 10, -vel * 0.008) });
    };

    gsap.ticker.add(tickerCb);

    return () => {
      st.kill();
      gsap.ticker.remove(tickerCb);
    };
  }, []);

  return (
    <div
      className="-mx-6 md:-mx-20 overflow-hidden border-y border-hair py-6 md:py-10 select-none"
      aria-hidden="true"
    >
      <div
        id="mq"
        ref={mqRef}
        className="mq h2 inline-flex w-max whitespace-nowrap text-[clamp(56px,10vw,160px)] gap-[.4em] will-change-transform"
      >
        {[...Array(4)].map((_, rep) => (
          <React.Fragment key={rep}>
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={`${rep}-${i}`}>{item}</span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
