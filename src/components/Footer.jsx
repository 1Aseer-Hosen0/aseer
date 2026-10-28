import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useLenis } from '../lib/LenisProvider';
import { FOOTER_LINKS } from '../data/channels';
import { SITE } from '../data/site';

export function Footer() {
  const lenis = useLenis();
  const footerRef = useRef(null);
  const boxRef = useRef(null);
  const nameRef = useRef(null);

  const handleBackToTop = (e) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useGSAP(() => {
    if (!footerRef.current || !boxRef.current || !nameRef.current) return;
    const footer = footerRef.current;
    const box = boxRef.current;
    const bn = nameRef.current;
    const chars = footer.querySelectorAll('.fchar');
    const inElements = footer.querySelectorAll('.ft-in');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fit font size to container width
    let fs = 100;
    const fit = () => {
      if (!bn || !box) return;
      bn.style.fontSize = '101px';
      const rect = bn.getBoundingClientRect();
      if (!rect.width) return;
      fs = (100 * box.clientWidth) / rect.width;
      bn.style.fontSize = `${fs}px`;
    };

    fit();
    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    const ro = new ResizeObserver(fit);
    ro.observe(box);

    if (prefersReducedMotion) {
      gsap.set(inElements, { opacity: 1, y: 0 });
      gsap.set(chars, { yPercent: 0 });
      return () => ro.disconnect();
    }

    // Entrance
    gsap.set(chars, { yPercent: 115 });
    gsap.set(inElements, { opacity: 0, y: 24 });

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      scrollTrigger: { trigger: footer, start: 'top 65%' }
    });

    tl.to(inElements, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 })
      .to(chars, { yPercent: 0, duration: 1.4, stagger: 0.06 }, '-=.9');

    // Proximity hover
    let cx = -1e4, cy = -1e4;
    const onMouseMove = (e) => {
      cx = e.clientX;
      cy = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const charStates = Array.from(chars).map((c) => ({ c, v: 0 }));

    const tickerCb = () => {
      const r = bn.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;

      charStates.forEach((o) => {
        const b = o.c.getBoundingClientRect();
        const d = Math.hypot(
          cx - (b.left + b.width / 2),
          (cy - (b.top + b.height / 2)) * 0.6
        );
        const t = Math.pow(Math.max(0, 1 - d / (fs * 1.1)), 2);
        o.v += (t - o.v) * 0.12;
        o.c.style.setProperty('--p', o.v.toFixed(3));
        o.c.style.translate = `0 ${(-o.v * fs * 0.06).toFixed(1)}px`;
      });
    };

    gsap.ticker.add(tickerCb);

    return () => {
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerCb);
    };
  }, { scope: footerRef, dependencies: [lenis] });

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden border-t border-hair bg-base pl-6 pr-14 md:pl-20 md:pr-20 pt-14 md:pt-20"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(60% 45% at 50% 100%, rgba(91,220,247,.07), transparent 70%)' }}
      />

      {/* Top: tagline + link columns */}
      <div className="relative flex flex-col md:flex-row md:justify-between gap-14">
        <h2 className="ft-in font-sans font-light tracking-[-.02em] leading-[1.08] text-[clamp(30px,3.6vw,54px)] max-w-[15ch] md:max-w-[17ch]">
          Have an idea that needs to manifest?{' '}
          <a
            href={`mailto:${SITE.email}`}
            className="text-cyan border-b border-cyan/30 hover:border-cyan transition-colors"
            data-cursor="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Let’s talk.
          </a>
        </h2>

        <nav
          className="grid grid-cols-2 md:grid-cols-3 gap-x-10 md:gap-x-20 gap-y-10 font-sans text-[17px] md:text-[18px] text-ink"
          aria-label="Footer Navigation"
        >
          <div className="ft-in">
            <p className="font-mono text-[10px] tracking-[.08em] uppercase text-dim mb-5">Site</p>
            <ul className="flex flex-col gap-3.5 items-start">
              {FOOTER_LINKS.site.map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="ul" data-cursor="link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-in">
            <p className="font-mono text-[10px] tracking-[.08em] uppercase text-dim mb-5">Elsewhere</p>
            <ul className="flex flex-col gap-3.5 items-start">
              {FOOTER_LINKS.elsewhere.map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="ul" data-cursor="link" target="_blank" rel="noopener noreferrer">
                    {item.label} <span className="arr">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-in">
            <p className="font-mono text-[10px] tracking-[.08em] uppercase text-dim mb-5">Contact</p>
            <ul className="flex flex-col gap-3.5 items-start">
              {FOOTER_LINKS.contact.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="ul"
                    data-cursor="link"
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.label} {item.external && <span className="arr">↗</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Giant name, centered */}
      <div id="bigBox" ref={boxRef} className="relative flex justify-center mt-20 md:mt-10 mb-6 md:mb-8 select-none">
        <p
          id="bigName"
          ref={nameRef}
          className="big text-ink inline-flex flex-col items-center md:flex-row md:gap-[.22em]"
          aria-label="Aseer Hosen"
          data-cursor="link"
        >
          <span className="fword" aria-hidden="true">
            {[...'ASEER'].map((c, i) => (
              <span key={i} className="fchar">{c}</span>
            ))}
          </span>
          <span className="fword" aria-hidden="true">
            {[...'HOSEN'].map((c, i) => (
              <span key={i} className="fchar">{c}</span>
            ))}
          </span>
        </p>
      </div>

      {/* Bottom bar */}
      <div className="ft-in relative border-t border-hair py-5 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[10px] md:text-[11px] tracking-[.08em] uppercase text-dim">
        <span>© 2026 {SITE.name} · Designed with Pure Passion</span>
        <button id="toTop" onClick={handleBackToTop} className="ul text-mute cursor-pointer" data-cursor="link">
          Back to top <span className="arr">↑</span>
        </button>
        <span>Thank you for the Time</span>
      </div>
    </footer>
  );
}
