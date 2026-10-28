import React, { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useClock } from '../../hooks/useClock';
import { SplitWords } from '../ui/SplitWords';
import { Story } from './Story';
import { Experience } from './Experience';
import { Education } from './Education';
import { Certificates } from './Certificates';
import { Marquee } from './Marquee';
import { NextCta } from './NextCta';
import { SITE } from '../../data/site';

export function About({ numbers = { story: '02', experience: '03', education: '04', certificates: '05' } }) {
  const aboutRef = useRef(null);
  const clock = useClock();

  useReveal(aboutRef, '[data-rv]', 28);

  return (
    <section
      id="about"
      ref={aboutRef}
      className="relative pl-6 pr-14 md:pl-20 md:pr-20 pt-32 md:pt-44 pb-28 md:pb-40 flex flex-col gap-32 md:gap-52"
    >
      {/* ========== INTRO ========== */}
      <div className="relative">
        <div
          className="absolute -right-20 -top-24 w-[70%] h-[130%] contour opacity-70 pointer-events-none"
          style={{
            WebkitMaskImage: 'radial-gradient(closest-side, #000 30%, transparent 100%)',
            maskImage: 'radial-gradient(closest-side, #000 30%, transparent 100%)'
          }}
        />

        <div className="relative flex justify-between mono text-dim pb-4">
          <span>Home / About</span>
          <span id="clock">Dhaka {clock}</span>
        </div>

        <div className="hl relative h-px bg-white/10 mb-10 md:mb-16" />

        <SplitWords
          as="h1"
          text="Hi, I’m Aseer."
          className="relative h2 text-[clamp(64px,14vw,232px)]"
          delay={0.2}
        />

        <p
          data-rv
          className="relative mt-8 md:mt-12 max-w-[30ch] md:max-w-[36ch] text-[clamp(20px,2.4vw,34px)] font-light leading-[1.25] tracking-[-.01em] text-ink/90"
        >
          Interface designer and creative developer, building websites that move with intent.
        </p>

        <dl className="relative mt-16 md:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {SITE.facts.map((f) => (
            <div key={f.label} data-rv className="border-t border-hair pt-4">
              <dt className="mono text-dim mb-3">{f.label}</dt>
              {f.isStatus ? (
                <dd className="text-[18px] flex items-center gap-2.5 text-cyan">
                  <i className="dot w-1.5 h-1.5 rounded-full bg-cyan" />
                  {f.value}
                </dd>
              ) : (
                <dd className="text-[18px]">{f.value}</dd>
              )}
            </div>
          ))}
        </dl>
      </div>

      {/* ========== [02] LONG STORY SHORT ========== */}
      <Story number={numbers.story} />

      {/* ========== [03] EXPERIENCE ========== */}
      <Experience number={numbers.experience} />

      {/* ========== [04] EDUCATION ========== */}
      <Education number={numbers.education} />

      {/* ========== [05] CERTIFICATES ========== */}
      <Certificates number={numbers.certificates} />

      {/* ========== Velocity marquee ========== */}
      <Marquee />

      {/* ========== NEXT ========== */}
      <NextCta />
    </section>
  );
}
