import React, { useState, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { SectionHead } from '../ui/SectionHead';
import { FAQ } from '../../data/faq';

export function Faq({ number = '09' }) {
  const [openIndices, setOpenIndices] = useState(new Set());
  const bodyRefs = useRef({});
  const pvRefs = useRef({});

  const toggle = (idx) => {
    const isCurrentlyOpen = openIndices.has(idx);
    const nextSet = new Set(openIndices);
    if (isCurrentlyOpen) {
      nextSet.delete(idx);
    } else {
      nextSet.add(idx);
    }
    setOpenIndices(nextSet);

    const bodyEl = bodyRefs.current[idx];
    const pvEl = pvRefs.current[idx];

    if (bodyEl) {
      if (isCurrentlyOpen) {
        gsap.to(bodyEl, {
          height: 0,
          duration: 0.8,
          ease: 'expo.out',
          onComplete: () => ScrollTrigger.refresh()
        });
      } else {
        gsap.to(bodyEl, {
          height: 'auto',
          duration: 0.8,
          ease: 'expo.out',
          onComplete: () => ScrollTrigger.refresh()
        });
      }
    }

    if (pvEl) {
      gsap.to(pvEl, {
        scaleY: isCurrentlyOpen ? 1 : 0,
        duration: 0.5,
        ease: 'expo.out'
      });
    }
  };

  return (
    <div id="faq">
      <SectionHead number={number} title="Before you write" meta="Updated · Oct 2026" />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
        <h2 data-split className="h2 lg:col-span-5 lg:sticky lg:top-28 self-start text-[clamp(40px,5.5vw,80px)]">
          Questions people ask first.
        </h2>

        <div className="lg:col-span-7 border-t border-hair" id="faqList">
          {FAQ.map((item, idx) => {
            const isOpen = openIndices.has(idx);
            return (
              <div key={item.index} data-rv className="border-b border-hair">
                <button
                  type="button"
                  className="q w-full flex items-center gap-5 md:gap-8 py-7 text-left outline-none cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-btn-${idx}`}
                  onClick={() => toggle(idx)}
                  data-cursor="link"
                >
                  <span className="mono text-dim w-6 flex-none">{item.index}</span>
                  <span className="qt flex-1 text-[19px] md:text-[22px] transition-colors">
                    {item.q}
                  </span>
                  <span className="relative w-4 h-4 flex-none" aria-hidden="true">
                    <i className="absolute left-0 right-0 top-1/2 h-px bg-ink" />
                    <i
                      ref={(el) => (pvRefs.current[idx] = el)}
                      className="pv absolute top-0 bottom-0 left-1/2 w-px bg-ink origin-center"
                    />
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  ref={(el) => (bodyRefs.current[idx] = el)}
                  className="a h-0 overflow-hidden"
                >
                  <p className="pl-11 md:pl-14 pr-10 pb-7 max-w-[62ch] text-mute leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
