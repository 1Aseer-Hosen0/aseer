import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../lib/gsap';

export function useReveal(scopeRef, selector = '[data-rv]', y = 28) {
  useGSAP(() => {
    if (!scopeRef?.current) return;
    const elements = scopeRef.current.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y });

    ScrollTrigger.batch(elements, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out'
        });
      }
    });
  }, { scope: scopeRef });
}
