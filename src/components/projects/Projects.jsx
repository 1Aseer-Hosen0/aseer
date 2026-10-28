import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useLenis } from '../../lib/LenisProvider';
import { usePointerFine } from '../../hooks/usePointerFine';
import { SectionHead } from '../ui/SectionHead';
import { RollWord } from '../ui/RollWord';
import { ProjectSheet } from './ProjectSheet';
import { ProjectRuler } from './ProjectRuler';
import { ProjectBubble } from './ProjectBubble';
import { PROJECTS } from '../../data/projects';
import { SITE } from '../../data/site';

export function Projects({ number = '01' }) {
  const lenis = useLenis();
  const isFine = usePointerFine();
  const [currentIndex, setCurrentIndex] = useState(0);

  const projectsRef = useRef(null);
  const pinRef = useRef(null);
  const artsRef = useRef(null);
  const rulerRef = useRef(null);
  const counterRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const matchMediaRef = useRef(null);
  const bubbleRef = useRef(null);
  const bubbleTextRef = useRef(null);

  const N = PROJECTS.length;
  const pad = (n) => String(n).padStart(2, '0');
  const liveCount = PROJECTS.filter((p) => p.live).length;
  const repoCount = PROJECTS.filter((p) => !p.live).length;

  const contour = (i) => {
    const a = [[28, 38], [72, 30], [40, 74], [78, 70]][i % 4];
    const b = [[70, 66], [24, 70], [76, 28], [30, 34]][i % 4];
    return `repeating-radial-gradient(circle at ${a[0]}% ${a[1]}%,transparent 0 17px,rgba(255,255,255,.08) 17px 18px),repeating-radial-gradient(circle at ${b[0]}% ${b[1]}%,transparent 0 23px,rgba(91,220,247,.14) 23px 24px)`;
  };

  useEffect(() => () => {
    matchMediaRef.current?.revert();
    matchMediaRef.current = null;
    scrollTriggerRef.current = null;
  }, []);

  useGSAP(() => {
    if (!projectsRef.current || !pinRef.current || !artsRef.current) return;
    const workPin = pinRef.current;
    const arts = artsRef.current.querySelectorAll('.art');
    const segs = rulerRef.current ? rulerRef.current.querySelectorAll('.seg') : [];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(workPin, { height: 'auto' });
      gsap.set(artsRef.current, {
        position: 'relative',
        inset: 'auto',
        overflow: 'visible'
      });
      if (rulerRef.current) gsap.set(rulerRef.current, { display: 'none' });

      arts.forEach((a) => {
        gsap.set(a, {
          position: 'relative',
          inset: 'auto',
          clipPath: 'none',
          clearProps: 'transform,opacity'
        });
        const chars = a.querySelectorAll('.ch');
        const pms = a.querySelectorAll('.pm');
        gsap.set(chars, { yPercent: 0 });
        gsap.set(pms, { opacity: 1, y: 0 });
      });
      return;
    }

    const mm = gsap.matchMedia();
    matchMediaRef.current = mm;

    mm.add('(min-width: 1024px)', () => {
      let cur = 0;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: workPin,
          start: 'top 64px',
          end: () => `+=${(N - 1) * window.innerHeight}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 'labels',
            duration: { min: 0.2, max: 0.8 },
            ease: 'power2.inOut'
          },
          onUpdate: (s) => {
            const k = Math.round(s.progress * (N - 1));
            if (k !== cur) {
              cur = k;
              setCurrentIndex(k);
              segs.forEach((b, j) => b.classList.toggle('on', j === k));
              if (counterRef.current) {
                gsap.fromTo(
                  counterRef.current,
                  { yPercent: 70, opacity: 0 },
                  { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }
                );
                counterRef.current.textContent = pad(k + 1);
              }
            }
          }
        }
      });

      tl.addLabel('p0', 0);
      gsap.set(Array.from(arts).slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(arts[0].querySelectorAll('.ch'), { yPercent: 115 });

      ScrollTrigger.create({
        trigger: workPin,
        start: 'top 80%',
        once: true,
        onEnter: () =>
          gsap.to(arts[0].querySelectorAll('.ch'), {
            yPercent: 0,
            duration: 1.3,
            stagger: 0.06,
            ease: 'expo.out'
          })
      });

      for (let i = 1; i < N; i++) {
        const a = arts[i];
        const prevA = arts[i - 1];
        const t = i - 1;

        tl.fromTo(a, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, t)
          .fromTo(a.querySelector('.pin-in'), { yPercent: 9 }, { yPercent: 0, ease: 'power2.out', duration: 1 }, t)
          .to(prevA.querySelector('.pin-in'), { yPercent: -9, opacity: 0.25, ease: 'power2.in', duration: 1 }, t)
          .fromTo(a.querySelector('.stg'), { scale: 0.92 }, { scale: 1, ease: 'power2.out', duration: 1 }, t)
          .fromTo(a.querySelectorAll('.ch'), { yPercent: 115 }, { yPercent: 0, ease: 'power3.out', duration: 0.45, stagger: 0.03 }, t + 0.25)
          .fromTo(a.querySelectorAll('.pm'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4, stagger: 0.05 }, t + 0.4);

        if (segs[i]) {
          const sf = segs[i].querySelector('.sf');
          if (sf) {
            tl.fromTo(sf, { scaleX: 0 }, { scaleX: 1, duration: 1 }, t);
          }
        }

        tl.addLabel(`p${i}`, i);
      }

      scrollTriggerRef.current = tl.scrollTrigger;

      return () => {
        if (scrollTriggerRef.current === tl.scrollTrigger) {
          scrollTriggerRef.current = null;
        }
      };
    });

    mm.add('(max-width: 1023px)', () => {
      arts.forEach((a) => {
        gsap.from(a.querySelectorAll('.ch'), {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.04,
          ease: 'expo.out',
          scrollTrigger: { trigger: a, start: 'top 75%', once: true }
        });
        gsap.from(a.querySelectorAll('.pm, .stg'), {
          opacity: 0,
          y: 28,
          duration: 1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: a, start: 'top 75%', once: true }
        });
      });
    });

  }, { scope: projectsRef, dependencies: [N] });

  // Handle segment jump
  const handleSegmentClick = (i) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const y = st.start + (i / (N - 1)) * (st.end - st.start);
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.6 });
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Stage mouse parallax & cursor bubble
  const bxRef = useRef(null);
  const byRef = useRef(null);

  const onStageEnter = (e, label) => {
    if (!isFine || !bubbleRef.current || !bubbleTextRef.current) return;
    bubbleTextRef.current.textContent = label;
    gsap.set(bubbleRef.current, { x: e.clientX + 18, y: e.clientY + 18, scale: 0.5 });
    gsap.to(bubbleRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });

    if (!bxRef.current) {
      bxRef.current = gsap.quickTo(bubbleRef.current, 'x', { duration: 0.45, ease: 'power3' });
      byRef.current = gsap.quickTo(bubbleRef.current, 'y', { duration: 0.45, ease: 'power3' });
    }
  };

  const onStageMove = (e) => {
    if (!isFine) return;
    if (bxRef.current) bxRef.current(e.clientX + 18);
    if (byRef.current) byRef.current(e.clientY + 18);

    const stg = e.currentTarget;
    const shot = stg.querySelector('.shot');
    if (shot) {
      const r = stg.getBoundingClientRect();
      const nx = -((e.clientX - r.left) / r.width - 0.5) * 36;
      const ny = -((e.clientY - r.top) / r.height - 0.5) * 28;
      gsap.to(shot, { x: nx, y: ny, duration: 1, ease: 'power3', overwrite: 'auto' });
    }
  };

  const onStageLeave = (e) => {
    if (!isFine || !bubbleRef.current) return;
    gsap.to(bubbleRef.current, { opacity: 0, scale: 0.5, duration: 0.3, overwrite: 'auto' });
    const shot = e.currentTarget?.querySelector('.shot');
    if (shot) {
      gsap.to(shot, { x: 0, y: 0, duration: 1, ease: 'power3', overwrite: 'auto' });
    }
  };

  return (
    <section
      id="work"
      ref={projectsRef}
      className="relative pl-6 pr-14 md:pl-20 md:pr-20 pt-28 md:pt-40 pb-28 md:pb-40"
    >
      <ProjectBubble bubbleRef={bubbleRef} textRef={bubbleTextRef} />

      <SectionHead
        number={number}
        title="Selected work"
        meta={`${N} projects · ${liveCount} live · ${repoCount} repos`}
        mb="mb-8 md:mb-10"
      />

      <div id="workPin" ref={pinRef} className="relative lg:h-[calc(100vh-4rem)]">
        <div id="arts" ref={artsRef} className="relative lg:absolute lg:inset-0 overflow-hidden">
          {PROJECTS.map((p, i) => (
            <ProjectSheet
              key={p.name}
              project={p}
              index={i}
              total={N}
              contourBg={contour(i)}
              onStageEnter={onStageEnter}
              onStageMove={onStageMove}
              onStageLeave={onStageLeave}
            />
          ))}
        </div>

        <ProjectRuler
          rulerRef={rulerRef}
          projects={PROJECTS}
          currentIndex={currentIndex}
          counterRef={counterRef}
          onSegmentClick={handleSegmentClick}
        />
      </div>

      {/* More on GitHub rolling link */}
      <a
        href={SITE.githubUrl}
        data-rv
        className="more mt-24 md:mt-40 flex items-end justify-between gap-6 border-y border-hair py-8 md:py-10 cursor-pointer"
        data-cursor="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="h2 text-[clamp(40px,8vw,120px)]" aria-label="More on GitHub">
          <RollWord text="More on GitHub" />
        </span>
        <span className="mono text-mute pb-3 flex-none">
          Experiments &amp; repositories ↗
        </span>
      </a>
    </section>
  );
}
