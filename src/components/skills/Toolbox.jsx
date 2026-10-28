import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { SectionHead } from '../ui/SectionHead';
import { SplitWords } from '../ui/SplitWords';
import { ToolTip } from './ToolTip';
import { usePointerFine } from '../../hooks/usePointerFine';
import { GROUPS } from '../../data/toolbox';

export function Toolbox({ number = '05' }) {
  const toolboxRef = useRef(null);
  const isFine = usePointerFine();

  const tipRef = useRef(null);
  const imgRef = useRef(null);
  const monoRef = useRef(null);
  const capRef = useRef(null);

  const shownRef = useRef(false);
  const qxRef = useRef(null);
  const qyRef = useRef(null);
  const qrRef = useRef(null);
  const lxRef = useRef(0);
  const rtRef = useRef(null);

  useGSAP(() => {
    if (!toolboxRef.current) return;
    const panels = toolboxRef.current.querySelectorAll('.pn');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    panels.forEach((p, i) => {
      const nx = panels[i + 1];
      if (!nx) return;
      const shade = p.querySelector('.pn-shade');
      const scrollTrigger = {
        trigger: nx,
        start: 'top 90%',
        end: `top ${5 * 16 + (i + 1) * 18}px`,
        scrub: true
      };

      gsap.timeline({ scrollTrigger })
        .to(p, { scale: 0.88, ease: 'none' }, 0)
        .to(shade, { opacity: 1, ease: 'none' }, 0);
    });
  }, { scope: toolboxRef });

  // Floating tip cursor follow
  useEffect(() => {
    if (!isFine || !tipRef.current) return;
    const tip = tipRef.current;

    gsap.set(tip, { scale: 0.6, rotation: 0, opacity: 0 });
    qxRef.current = gsap.quickTo(tip, 'x', { duration: 0.55, ease: 'power3' });
    qyRef.current = gsap.quickTo(tip, 'y', { duration: 0.55, ease: 'power3' });
    qrRef.current = gsap.quickTo(tip, 'rotation', { duration: 0.7, ease: 'power3' });

    const onMouseMove = (e) => {
      const mx = e.clientX;
      const my = e.clientY;
      if (qxRef.current) qxRef.current(mx + 30);
      if (qyRef.current) qyRef.current(my - 60);
      if (qrRef.current) {
        qrRef.current(gsap.utils.clamp(-14, 14, (mx - lxRef.current) * 0.6));
      }
      lxRef.current = mx;
      clearTimeout(rtRef.current);
      rtRef.current = setTimeout(() => {
        if (qrRef.current) qrRef.current(0);
      }, 90);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Preload icons
    GROUPS.forEach((g) => {
      g.items.forEach((item) => {
        if (item[1]) {
          const img = new Image();
          img.src = item[1];
        }
      });
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(rtRef.current);
    };
  }, [isFine]);

  const showTip = (name, icon, invert, clientX, clientY) => {
    if (!isFine || !tipRef.current || !imgRef.current || !monoRef.current || !capRef.current) return;
    const tip = tipRef.current;
    const img = imgRef.current;
    const mono = monoRef.current;
    const cap = capRef.current;

    cap.textContent = name;
    mono.textContent = name.slice(0, 2);
    img.style.filter = invert ? 'invert(1)' : '';

    img.onload = () => {
      img.style.display = 'block';
      mono.style.display = 'none';
    };
    img.onerror = () => {
      img.style.display = 'none';
      mono.style.display = 'block';
    };

    if (icon) {
      img.src = icon;
      if (img.complete && img.naturalWidth) img.onload();
    } else {
      img.onerror();
    }

    if (!shownRef.current) {
      gsap.set(tip, { x: clientX + 30, y: clientY - 60 });
      shownRef.current = true;
    }

    gsap.to(tip, { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
    gsap.fromTo(
      [img, mono],
      { scale: 0.5, opacity: 0, rotate: -14 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(2.2)', overwrite: true }
    );
  };

  const hideTip = () => {
    if (!tipRef.current) return;
    shownRef.current = false;
    gsap.to(tipRef.current, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power3.in', overwrite: 'auto' });
  };

  const totalTools = GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div id="toolbox" ref={toolboxRef}>
      <ToolTip tipRef={tipRef} imgRef={imgRef} monoRef={monoRef} capRef={capRef} />

      <SectionHead
        number={number}
        title="Toolbox"
        meta={`${totalTools} tools · ${GROUPS.length} shelves`}
      />

      <SplitWords
        as="h2"
        text="Tools that earned their place."
        className="h2 text-[clamp(40px,7vw,104px)] max-w-[14ch] mb-14 md:mb-24"
      />

      <div id="stack" className="flex flex-col gap-6 pb-[8vh]">
        {GROUPS.map((g, i) => (
          <article
            key={g.n}
            className="pn relative min-h-[calc(100vh-9rem)] rounded-lg border border-hair bg-base p-6 md:p-12 grid lg:grid-cols-12 gap-10 lg:gap-16"
            style={{ top: `calc(5rem + ${i * 18}px)` }}
          >
            {/* Cyan corner ticks */}
            <i className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-cyan" />
            <i className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-cyan" />
            <i className="pn-shade absolute inset-0 z-10 rounded-lg bg-black opacity-0 pointer-events-none" aria-hidden="true" />

            <div className="lg:col-span-5 flex flex-col">
              <span className="mono text-cyan">{g.n}.</span>
              <h3 className="h2 text-[clamp(48px,6.4vw,104px)] mt-4">{g.t}</h3>
              <p className="mt-6 text-mute leading-relaxed max-w-[38ch] text-[16px] md:text-[17px]">
                {g.d}
              </p>
              <span className="mono text-dim mt-auto pt-10">
                {String(g.items.length).padStart(2, '0')} tools
                {i === 0 ? ' · hover to preview' : ''}
              </span>
            </div>

            <ul className="lg:col-span-7 border-t border-hair self-start">
              {g.items.map((it, k) => (
                <li
                  key={it[0]}
                  className="sk flex items-center border-b border-hair py-5 md:py-6 outline-none cursor-pointer"
                  tabIndex={0}
                  data-rv
                  onMouseEnter={(e) => showTip(it[0], it[1], it[3], e.clientX, e.clientY)}
                  onMouseLeave={hideTip}
                  onFocus={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    showTip(it[0], it[1], it[3], r.right - 160, r.top + r.height / 2 + 60);
                  }}
                  onBlur={hideTip}
                >
                  <span className="rin flex items-center gap-5 md:gap-8 w-full">
                    <span className="mono text-dim w-6 flex-none">{String(k + 1).padStart(2, '0')}</span>
                    <span className="tt h2 text-[clamp(28px,3.2vw,42px)]">{it[0]}</span>
                    <span className="nt hidden md:block ml-auto mono text-dim normal-case tracking-normal text-[12px]">
                      {it[2]}
                    </span>
                  </span>
                  {/* Inline icon on touch */}
                  {it[1] && (
                    <img
                      className="ti ml-4 flex-none"
                      alt=""
                      src={it[1]}
                      style={it[3] ? { filter: 'invert(1)' } : undefined}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
