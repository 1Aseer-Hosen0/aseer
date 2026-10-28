import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const l = new Lenis({ lerp: 0.08 });
    lenisRef.current = l;
    window.lenis = l;
    setLenis(l);

    const onScroll = () => {
      ScrollTrigger.update();
    };
    l.on('scroll', onScroll);

    const tickerCb = (time) => {
      l.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Lenis starts stopped and will be started when loader completes
    l.stop();

    return () => {
      l.off('scroll', onScroll);
      gsap.ticker.remove(tickerCb);
      l.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
