import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { SectionHead } from '../ui/SectionHead';

export function Story({ number = '02' }) {
  const storyRef = useRef(null);
  const portraitRef = useRef(null);
  const pimgRef = useRef(null);
  const leadRef = useRef(null);

  const leadText =
    "I’m a designer who writes code, or a developer who can’t stop moving pixels. Either way, I care about the space between a design file and a living website, and I like to close it myself.";

  useGSAP(() => {
    if (!storyRef.current || !portraitRef.current || !pimgRef.current || !leadRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(portraitRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(pimgRef.current, { scale: 1, yPercent: 0 });
      gsap.set(leadRef.current.querySelectorAll('.sw'), { opacity: 1 });
      return;
    }

    // Lead scrubbed opacity
    const words = leadRef.current.querySelectorAll('.sw');
    gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: leadRef.current,
          start: 'top 82%',
          end: 'bottom 48%',
          scrub: 0.5
        }
      }
    );

    // Portrait reveal & scrub
    gsap.fromTo(
      portraitRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.7,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: portraitRef.current, start: 'top 85%', once: true }
      }
    );

    gsap.fromTo(
      pimgRef.current,
      { scale: 1.25 },
      {
        scale: 1,
        duration: 2.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: portraitRef.current, start: 'top 85%', once: true }
      }
    );

    gsap.to(pimgRef.current, {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: portraitRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }, { scope: storyRef });

  return (
    <div id="story" ref={storyRef}>
      <SectionHead number={number} title="Long story short" meta="Dhaka, BD" />

      <div className="grid lg:grid-cols-12 gap-14 lg:gap-24">
        <figure className="lg:col-span-5 lg:sticky lg:top-24 self-start m-0">
          <div
            id="portrait"
            ref={portraitRef}
            className="relative aspect-[4/5] overflow-hidden rounded-lg border border-hair bg-base contour"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent z-10 pointer-events-none" />
            <div id="pimg" ref={pimgRef} className="absolute inset-0 origin-bottom">
              <img
                src="/aseer.png"
                alt="Portrait of Aseer Hosen"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[94%] w-auto aspect-square max-w-none"
                style={{ filter: 'contrast(1.05) saturate(.9)' }}
              />
            </div>
          </div>
          <figcaption data-rv className="flex justify-between mono text-dim mt-4">
            <span>fig. 01 · portrait</span>
            <span>4 : 5</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-7">
          <p
            id="lead"
            ref={leadRef}
            className="text-[clamp(26px,3.4vw,50px)] font-light leading-[1.18] tracking-[-.02em]"
          >
            {leadText.split(' ').map((w, i) => (
              <React.Fragment key={i}>
                <span className="sw">{w}</span>
                {i < leadText.split(' ').length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </p>

          <div className="mt-16 md:mt-28 flex flex-col">
            <div data-rv className="grid md:grid-cols-[150px_1fr] gap-3 md:gap-8 border-t border-hair py-8">
              <span className="mono text-dim">Start</span>
              <p className="text-mute text-[17px] leading-[1.7] max-w-[56ch]">
                I fell for the web by taking it apart: view source, change a value, watch the page respond. That curiosity never left.
              </p>
            </div>
            <div data-rv className="grid md:grid-cols-[150px_1fr] gap-3 md:gap-8 border-t border-hair py-8">
              <span className="mono text-dim">Craft</span>
              <p className="text-mute text-[17px] leading-[1.7] max-w-[56ch]">
                Today I design interfaces in Figma and build them by hand, with GSAP and Lenis for motion and Tailwind for structure. Type, spacing and timing get the same care as the code.
              </p>
            </div>
            <div data-rv className="grid md:grid-cols-[150px_1fr] gap-3 md:gap-8 border-y border-hair py-8">
              <span className="mono text-dim">Now</span>
              <p className="text-mute text-[17px] leading-[1.7] max-w-[56ch]">
                I work remotely from Dhaka and take on a few projects at a time, so each one gets my full attention.
              </p>
            </div>
          </div>

          <blockquote
            data-rv
            className="mt-16 md:mt-24 pl-6 border-l border-cyan/60 text-[clamp(20px,2vw,28px)] font-light leading-[1.4] text-ink/90 max-w-[34ch]"
          >
            I like it best when a screen feels inevitable, as if it could never have been drawn any other way.
          </blockquote>
        </div>
      </div>
    </div>
  );
}
