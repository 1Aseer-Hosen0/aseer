import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useLenis } from '../../lib/LenisProvider';
import { useClock } from '../../hooks/useClock';
import { usePointerFine } from '../../hooks/usePointerFine';
import { TopoCanvas } from './TopoCanvas';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { SITE } from '../../data/site';

export function Hero({ loaderRef, countRef, headerRef, railRef }) {
  const lenis = useLenis();
  const clock = useClock();
  const isFine = usePointerFine();

  const heroRef = useRef(null);
  const elevRef = useRef(null);
  const topoAlphaRef = useRef({ v: 0 });

  const frameRef = useRef(null);
  const nameMoveRef = useRef(null);
  const w1Ref = useRef(null);
  const w2Ref = useRef(null);
  const photoScrollRef = useRef(null);
  const photoMoveRef = useRef(null);
  const photoRef = useRef(null);
  const motoWrapRef = useRef(null);
  const motoInnerRef = useRef(null);
  const uiRef = useRef(null);
  const actionsRef = useRef(null);

  useGSAP(() => {
    if (!heroRef.current) return;

    const chars = heroRef.current.querySelectorAll('.hero-char');
    const rvElements = heroRef.current.querySelectorAll('.hero-rv');
    const actionBtns = actionsRef.current ? actionsRef.current.children : [];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (loaderRef?.current) gsap.set(loaderRef.current, { display: 'none' });
      if (headerRef?.current) gsap.set(headerRef.current, { yPercent: 0 });
      if (railRef?.current) gsap.set(railRef.current, { xPercent: 0 });
      topoAlphaRef.current.v = 1;
      gsap.set(frameRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(photoRef.current, { opacity: 1, scale: 1 });
      gsap.set(chars, { yPercent: 0 });
      gsap.set(motoInnerRef.current, { yPercent: 0 });
      gsap.set(rvElements, { opacity: 1, y: 0 });
      gsap.set(actionBtns, { opacity: 1, y: 0 });
      if (lenis) lenis.start();
      return;
    }

    // Initial hidden states before first paint
    gsap.set(chars, { yPercent: 115 });
    gsap.set(frameRef.current, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(photoRef.current, { opacity: 0, scale: 1.08 });
    gsap.set(motoInnerRef.current, { yPercent: 120 });
    gsap.set(actionBtns, { opacity: 0, y: 20 });
    gsap.set(rvElements, { opacity: 0, y: 16 });
    if (headerRef?.current) gsap.set(headerRef.current, { yPercent: -100 });
    if (railRef?.current) gsap.set(railRef.current, { xPercent: 100 });

    const count = { v: 0 };
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.to(count, {
      v: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (countRef?.current) {
          countRef.current.textContent = String(Math.round(count.v));
        }
      }
    });

    if (loaderRef?.current) {
      tl.to(loaderRef.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=.15');
    }

    tl.add(() => {
      if (lenis) lenis.start();
    }, '-=.4');

    tl.to(topoAlphaRef.current, { v: 1, duration: 2.4, ease: 'power2.out' }, '-=.9')
      .to(frameRef.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, '-=.9')
      .to(photoRef.current, { opacity: 1, scale: 1, duration: 1.8 }, '-=.7')
      .to(chars, { yPercent: 0, duration: 1.3, stagger: 0.055 }, '-=1.5');

    if (headerRef?.current) {
      tl.to(headerRef.current, { yPercent: 0, duration: 1 }, '-=1.1');
    }
    if (railRef?.current) {
      tl.to(railRef.current, { xPercent: 0, duration: 1 }, '<');
    }

    tl.to(motoInnerRef.current, { yPercent: 0, duration: 1 }, '-=.8')
      .to([...rvElements, ...actionBtns], { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, '-=.8');

    // Scroll-linked scrub
    const st = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 };
    gsap.to(w1Ref.current, { xPercent: -28, ease: 'none', scrollTrigger: st });
    gsap.to(w2Ref.current, { xPercent: 28, ease: 'none', scrollTrigger: st });
    gsap.to(photoScrollRef.current, { yPercent: -7, scale: 1.04, ease: 'none', scrollTrigger: st });
    gsap.to(frameRef.current, { yPercent: 4, ease: 'none', scrollTrigger: st });
    gsap.to([uiRef.current, motoWrapRef.current], {
      opacity: 0,
      y: -40,
      ease: 'none',
      scrollTrigger: { ...st, end: '60% top' }
    });

    // Mouse depth (disabled on touch)
    if (isFine && nameMoveRef.current && photoMoveRef.current) {
      const nx = gsap.quickTo(nameMoveRef.current, 'x', { duration: 1.2, ease: 'power3' });
      const ny = gsap.quickTo(nameMoveRef.current, 'y', { duration: 1.2, ease: 'power3' });
      const px = gsap.quickTo(photoMoveRef.current, 'x', { duration: 1.2, ease: 'power3' });
      const py = gsap.quickTo(photoMoveRef.current, 'y', { duration: 1.2, ease: 'power3' });

      const onMouseMove = (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        nx(x * -36);
        ny(y * -14);
        px(x * 14);
        py(y * 8);
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, { scope: heroRef, dependencies: [lenis, isFine] });

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen min-h-[680px] overflow-hidden bg-void"
    >
      <TopoCanvas elevRef={elevRef} topoAlphaRef={topoAlphaRef} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 55%, transparent 30%, #050505 92%)' }}
      />

      <div className="absolute left-0 top-16 bottom-0 right-10 md:right-14 [--fw:64vw] md:[--fw:clamp(300px,28vw,420px)]">

        {/* Name: BEHIND the portrait (z-10) */}
        <div
          id="nameMove"
          ref={nameMoveRef}
          className="absolute inset-x-0 top-[17%] md:top-[24%] z-10 pointer-events-none select-none"
        >
          <h1
            className="name text-ink leading-[.84] text-[27vw] md:text-[13.5vw] lg:text-[15.5vw] text-center md:flex md:justify-center md:[gap:calc(var(--fw)*.62)]"
            aria-label="Aseer Hosen"
          >
            <span ref={w1Ref} className="word w1" aria-hidden="true">
              {[...'Aseer'].map((c, i) => (
                <span key={i} className="char hero-char">{c}</span>
              ))}
            </span>
            <br className="md:hidden" />
            <span ref={w2Ref} className="word w2" aria-hidden="true">
              {[...'Hosen'].map((c, i) => (
                <span key={i} className="char hero-char">{c}</span>
              ))}
            </span>
          </h1>
        </div>

        {/* Portrait (front layer, clipped to frame, z-20) */}
        <div
          id="photoScroll"
          ref={photoScrollRef}
          className="absolute inset-y-0 inset-x-0 mx-auto w-auto z-20 overflow-hidden rounded-t-lg"
          data-cursor="hello"
        >
          <div id="photoMove" ref={photoMoveRef} className="absolute inset-0">
            <div id="photo" ref={photoRef} className="absolute inset-0 origin-bottom">
              <img
                src="/aseer.png"
                alt="Portrait of Aseer Hosen"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-none h-[min(100%,calc(var(--fw)*2.1))] aspect-square"
                style={{ filter: 'contrast(1.05) saturate(.9)' }}
              />
            </div>
          </div>
        </div>

        {/* Moto: difference blend so it reads over both shirt and suit (z-30) */}
        <p
          id="motoWrap"
          ref={motoWrapRef}
          className="absolute inset-x-0 top-[62%] md:top-[63%] z-30 text-center px-6 pointer-events-none"
        >
          <span className="inline-block overflow-hidden align-bottom">
            <span
              id="motoInner"
              ref={motoInnerRef}
              className="inline-block font-sans font-light text-[15px] md:text-[17px] text-white"
              style={{ mixBlendMode: 'difference' }}
            >
              {SITE.moto}
            </span>
          </span>
        </p>

        {/* UI layer: corners (z-30) */}
        <div id="ui" ref={uiRef} className="absolute inset-0 z-30 pointer-events-none">
          <ul className="hero-rv hidden md:block absolute left-20 top-10 w-60 font-sans text-[15px] text-ink/90 pointer-events-auto">
            {SITE.disciplines.map((item, idx) => (
              <li key={idx} className="row py-2.5 border-b border-hair" data-cursor="link">
                {item}
              </li>
            ))}
          </ul>

          <div className="hero-rv absolute right-6 md:right-20 top-6 md:top-10 text-right font-mono text-[11px] leading-6 tracking-[.04em] text-mute tabular-nums">
            <Chip status>{SITE.status}</Chip>
            <div className="mt-3">
              {SITE.city}, {SITE.countryCode} &nbsp;
              <span id="clock">{clock}</span>
            </div>
          </div>

          <p className="hero-rv hidden md:block absolute right-20 bottom-8 w-64 text-[13px] leading-[1.6] text-mute">
            {SITE.bio}
          </p>

          <div id="actions" ref={actionsRef} className="absolute left-6 md:left-20 bottom-8 flex gap-3 pointer-events-auto">
            <Button as="a" href="#work" size="hero" magnetic>
              Projects
            </Button>
            <Button as="a" href="#contact" size="hero" magnetic>
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
