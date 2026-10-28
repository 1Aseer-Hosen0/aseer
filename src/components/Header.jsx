import React from 'react';
import { useLenis } from '../lib/LenisProvider';

export function Header({ headerRef }) {
  const lenis = useLenis();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[101] px-4 py-2 bg-base border border-cyan text-cyan font-mono text-xs rounded"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 h-16 z-[70] border-b border-hair bg-base/90 backdrop-blur-[16px] flex items-center justify-center"
      >
        <a
          href="#hero"
          onClick={handleLogoClick}
          className="font-mono text-sm tracking-[.3em] text-ink outline-none focus-visible:outline-1 focus-visible:outline-cyan"
          data-cursor="link"
          aria-label="Aseer Hosen Portfolio Home"
        >
          <img src="/logo.png" alt="Aseer Hosen Logo" className="h-20 w-auto" />
        </a>
      </header>
    </>
  );
}
