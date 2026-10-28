import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { EDU as CUSTOM_EDU } from '../../data/education';

// Exactly as in aboutme.html lines 150-154
const ABOUTME_EDU = [
  {
    y: '2018–2020',
    t: 'Higher Secondary',
    s: 'College Name',
    l: 'Dhaka, BD',
    n: 'One line on your focus or a result you’re proud of.'
  },
  {
    y: '2008–2018',
    t: 'Secondary School',
    s: 'School Name',
    l: 'Dhaka, BD',
    n: 'One line on where the interest in design started.'
  }
];

export function Education({ number = '02', items = ABOUTME_EDU }) {
  const eduRef = useRef(null);
  const tlRef = useRef(null);
  const tlpRef = useRef(null);
  const hlRef = useRef(null);
  const splitRef = useRef(null);

  useGSAP(() => {
    if (!eduRef.current) return;

    // Line reveal (.hl)
    if (hlRef.current) {
      gsap.set(hlRef.current, { scaleX: 0, transformOrigin: 'left' });
      ScrollTrigger.create({
        trigger: hlRef.current,
        start: 'top 92%',
        once: true,
        onEnter: () => gsap.to(hlRef.current, { scaleX: 1, duration: 1.5, ease: 'expo.inOut' })
      });
    }

    // Heading reveal ([data-split])
    if (splitRef.current) {
      const el = splitRef.current;
      const t = el.textContent.trim();
      el.setAttribute('aria-label', t);
      el.innerHTML = t
        .split(' ')
        .map((w) => `<span class="w" aria-hidden="true"><span class="wi">${w}</span></span>`)
        .join(' ');
      const wi = el.querySelectorAll('.wi');
      gsap.set(wi, { yPercent: 115 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(wi, { yPercent: 0, duration: 1.3, stagger: 0.07, ease: 'expo.out' })
      });
    }

    // Timeline: the cyan line draws down the page and lights each chapter as it arrives
    gsap.fromTo(
      tlpRef.current || '.tlp',
      { scaleY: 0, transformOrigin: 'top' },
      {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: tlRef.current || '#tl',
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );

    // Each node lights up at top 62%
    const edList = eduRef.current.querySelectorAll('.ed');
    edList.forEach((li) => {
      const n = li.querySelector('.nd');
      if (!n) return;
      n.classList.add('off');
      ScrollTrigger.create({
        trigger: li,
        start: 'top 62%',
        invalidateOnRefresh: true,
        onEnter: () => n.classList.remove('off'),
        onLeaveBack: () => n.classList.add('off'),
        onEnterBack: () => n.classList.remove('off')
      });
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(refreshTimer);
  }, { scope: eduRef });

  return (
    <div id="education" ref={eduRef}>
      <div className="flex justify-between mono text-dim pb-4">
        <span>
          <span className="text-cyan">[{number}]</span>&nbsp;&nbsp;Education
        </span>
        <span id="eduMeta">{items.length} chapters · newest first</span>
      </div>
      <div ref={hlRef} className="hl h-px bg-white/10 mb-10 md:mb-16"></div>
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
        <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
          <h2 ref={splitRef} data-split className="h2 text-[clamp(40px,5.5vw,80px)]">
            Where the craft began.
          </h2>
          <p data-rv className="mt-8 text-mute leading-relaxed max-w-[34ch]">
            Formal study, newest first. The line fills in as you scroll.
          </p>
        </div>
        <div id="tl" ref={tlRef} className="lg:col-span-7 relative">
          <i className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10"></i>
          <i
            ref={tlpRef}
            className="tlp absolute left-[5px] top-2 bottom-2 w-px bg-cyan"
            style={{ boxShadow: '0 0 12px rgba(91,220,247,.5)' }}
          ></i>
          <ol id="edu">
            {items.map((e, i) => (
              <li
                key={i}
                className="ed relative pl-10 md:pl-14 pb-14 md:pb-20 last:pb-0"
                data-rv
              >
                <i className="nd absolute left-0 top-2 w-[11px] h-[11px] rounded-full"></i>
                <span
                  className="gh absolute right-0 top-0 font-mono text-[clamp(72px,9vw,132px)] leading-none select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mono text-dim">{e.y}</span>
                <h3 className="tt h2 text-[clamp(30px,3.8vw,54px)] mt-3 max-w-[16ch]">{e.t}</h3>
                <p className="mono text-cyan mt-4">
                  {e.s}
                  <span className="text-dim"> · {e.l}</span>
                </p>
                <p className="text-mute leading-relaxed max-w-[46ch] mt-4">{e.n}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export { ABOUTME_EDU };
