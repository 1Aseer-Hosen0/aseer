import React, { useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { SectionHead } from '../ui/SectionHead';
import { SplitWords } from '../ui/SplitWords';
import { EXPERIENCE } from '../../data/experience';

const clamp = gsap.utils.clamp(0, 1);

function getRoutePath(width, baseY, points) {
  const routePoints = [
    { x: 0, y: baseY - 22 },
    ...points,
    { x: width, y: points[points.length - 1].y - 20 }
  ];

  return routePoints.reduce((path, point, index) => {
    if (index === 0) return `M${point.x},${point.y}`;
    const previous = routePoints[index - 1];
    const middle = (previous.x + point.x) / 2;
    return `${path} C${middle},${previous.y} ${middle},${point.y} ${point.x},${point.y}`;
  }, '');
}

function ExperienceCard({ item, index, cardRef, positioned }) {
  return (
    <article
      ref={cardRef}
      className={`xc relative pl-7 border-l border-white/10 pb-12 lg:pb-8 lg:pl-8 lg:pt-8 lg:pr-8 lg:border lg:border-hair lg:rounded-lg lg:bg-base/85 lg:backdrop-blur-[10px] ${positioned ? 'lg:absolute lg:w-[min(440px,36vw)]' : ''
        }`}
    >
      <i className="hidden lg:block absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-cyan" />
      <i className="hidden lg:block absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-cyan" />
      <div className="flex items-center justify-between gap-3 mono text-dim">
        <span><span className="text-cyan">0{index + 1}</span> · {item.span}</span>
        <span className="chipx">
          {item.type}
        </span>
      </div>
      <h3 className="h2 text-[clamp(30px,3.2vw,48px)] mt-5">{item.role}</h3>
      <p className="mt-3 text-[16px] text-ink/90">
        {item.organization}
        <span className="block sm:inline sm:ml-2 mono text-dim">{item.location}</span>
      </p>
      <ul className="mt-5 flex flex-col gap-2.5 text-mute text-[14.5px] leading-relaxed">
        {item.points.map((point) => (
          <li key={point} className="flex gap-3">
            <i className="mt-[10px] w-3 h-px bg-cyan/60 flex-none" />
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.stack.map((skill) => (
          <i key={skill} className="chipx n not-italic">{skill}</i>
        ))}
      </div>
    </article>
  );
}

export function Experience({ number = '03' }) {
  const experienceRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const backgroundRef = useRef(null);
  const routeRef = useRef(null);
  const clipRef = useRef(null);
  const markerRef = useRef(null);
  const roleRef = useRef(null);
  const indexRef = useRef(null);
  const elevationRef = useRef(null);
  const cardRefs = useRef([]);
  const nodeRefs = useRef([]);
  const yearRefs = useRef([]);
  const [layout, setLayout] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener('change', updateMotionPreference);

    const updateLayout = () => {
      if (!stageRef.current) return;
      const width = window.innerWidth;
      const height = stageRef.current.clientHeight;
      if (!height) return;

      setLayout((previous) => {
        if (previous?.width === width && previous?.height === height) return previous;
        const spacing = Math.max(560, width * 0.58);
        const baseY = height - 86;
        const amplitude = Math.min(height * 0.22, 170);
        const xs = EXPERIENCE.map((_, index) => width * 0.3 + index * spacing);
        const points = EXPERIENCE.map((item, index) => ({
          x: xs[index],
          y: baseY - 22 - item.elevation * amplitude
        }));
        const trackWidth = width + (EXPERIENCE.length - 1) * spacing;

        return {
          width,
          height,
          baseY,
          amplitude,
          spacing,
          trackWidth,
          points,
          path: getRoutePath(trackWidth, baseY, points)
        };
      });
    };

    const observer = new ResizeObserver(updateLayout);
    if (stageRef.current) observer.observe(stageRef.current);
    window.addEventListener('resize', updateLayout);
    updateLayout();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLayout);
      motionQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useGSAP(() => {
    if (!layout || !experienceRef.current) return;

    if (reducedMotion) {
      gsap.set(cardRefs.current, { clearProps: 'all', opacity: 1, y: 0 });
      return;
    }

    const media = gsap.matchMedia();

    media.add('(min-width: 1024px)', () => {
      if (
        !stageRef.current ||
        !trackRef.current ||
        !routeRef.current ||
        !clipRef.current ||
        !markerRef.current
      ) return;

      const cards = cardRefs.current.filter(Boolean);
      const nodes = nodeRefs.current.filter(Boolean);
      const years = yearRefs.current.filter(Boolean);
      const routeLength = routeRef.current.getTotalLength();
      const samples = Array.from({ length: 701 }, (_, index) => {
        const point = routeRef.current.getPointAtLength(routeLength * index / 700);
        return { x: point.x, y: point.y };
      });
      const spacing = layout.spacing;
      const cardWidth = Math.min(440, layout.width * 0.36);
      const active = { index: -1 };

      cards.forEach((card, index) => {
        gsap.set(card, {
          left: layout.points[index].x - cardWidth / 2,
          top: 96
        });
      });

      const yAt = (x) => {
        let low = 0;
        let high = samples.length - 1;
        while (high - low > 1) {
          const middle = (low + high) >> 1;
          if (samples[middle].x < x) low = middle;
          else high = middle;
        }
        const progress = (x - samples[low].x) /
          ((samples[high].x - samples[low].x) || 1);
        return samples[low].y + (samples[high].y - samples[low].y) * clamp(progress);
      };

      const render = (progress) => {
        const translateX = -progress * (layout.trackWidth - layout.width);
        const markerX = -translateX + layout.width * 0.3;
        const markerY = yAt(markerX);
        let nearest = 0;

        trackRef.current.style.transform = `translate3d(${translateX}px,0,0)`;
        if (backgroundRef.current) {
          backgroundRef.current.style.transform = `translate3d(${translateX * 0.22}px,0,0)`;
        }
        markerRef.current.setAttribute('transform', `translate(${markerX},${markerY})`);
        clipRef.current.setAttribute('width', markerX);

        EXPERIENCE.forEach((_, index) => {
          const distance = Math.abs(markerX - layout.points[index].x);
          const emphasis = clamp(1 - distance / spacing * 1.5);
          const eased = emphasis * emphasis * (3 - 2 * emphasis);
          cards[index].style.opacity = String(0.12 + 0.88 * eased);
          cards[index].style.transform =
            `translateY(${(1 - eased) * 34}px) scale(${0.95 + 0.05 * eased})`;
          nodes[index].classList.toggle('on', markerX >= layout.points[index].x - 1);

          if (
            distance <
            Math.abs(markerX - layout.points[nearest].x)
          ) nearest = index;
        });

        years.forEach((year, index) => year.classList.toggle('on', index === nearest));
        if (elevationRef.current) {
          elevationRef.current.textContent =
            ((layout.baseY - 22 - markerY) / layout.amplitude).toFixed(2);
        }
        if (active.index !== nearest) {
          active.index = nearest;
          if (roleRef.current) roleRef.current.textContent = EXPERIENCE[nearest].role;
          if (indexRef.current) {
            indexRef.current.textContent =
              `0${nearest + 1} / 0${EXPERIENCE.length}`;
          }
        }
      };

      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top 64px',
        end: () => `+=${(layout.trackWidth - layout.width) * 1.15}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress)
      });
      render(trigger.progress);
    });

    media.add('(max-width: 1023px)', () => {
      const cards = cardRefs.current.filter(Boolean);
      gsap.set(cards, { opacity: 0, y: 36 });
      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: 'expo.out'
        })
      });
    });

    return () => media.revert();
  }, {
    scope: experienceRef,
    dependencies: [layout, reducedMotion],
    revertOnUpdate: true
  });

  const hasRoute = layout && !reducedMotion;

  return (
    <div id="experience" ref={experienceRef}>
      <SectionHead
        number={number}
        title="Work & Experience"
        meta={`${EXPERIENCE[0].year} → now · ${EXPERIENCE.length} waypoints`}
      />

      <SplitWords
        as="h2"
        text="The route so far."
        className="h2 text-[clamp(40px,7vw,104px)] max-w-[12ch] mb-12 lg:mb-16"
      />

      <div
        id="experience-stage"
        ref={stageRef}
        className={`relative ml-[-25px] ${hasRoute ? 'lg:h-[calc(100vh-4rem)] lg:overflow-hidden' : ''
          }`}
      >
        {hasRoute && (
          <>
            <div
              ref={backgroundRef}
              className="contour hidden lg:block absolute -left-[10%] -right-[10%] inset-y-0 pointer-events-none"
              style={{
                WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)',
                maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)'
              }}
            />

            <div className="hidden lg:flex absolute top-10 inset-x-20 z-20 justify-between pointer-events-none mono text-dim">
              <div>
                <span>Now at</span>
                <br />
                <span ref={roleRef} className="text-ink normal-case tracking-normal font-sans text-[15px]">
                  {EXPERIENCE[0].role}
                </span>
              </div>
              <div className="text-right">
                <span ref={indexRef} className="text-ink">01 / {String(EXPERIENCE.length).padStart(2, '0')}</span>
                <br />
                <span>Elev <span ref={elevationRef} className="text-cyan tabular-nums">0.00</span></span>
              </div>
            </div>
            <div
              ref={trackRef}
              className="lg:absolute lg:left-0 lg:top-0 lg:bottom-0 will-change-transform"
            >
              <svg
                className="hidden lg:block absolute left-0 top-0 pointer-events-none"
                width={layout.trackWidth}
                height={layout.height}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="experience-route-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5bdcf7" stopOpacity=".22" />
                    <stop offset="1" stopColor="#5bdcf7" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="experience-route-clip">
                    <rect ref={clipRef} x="0" y="0" width="0" height={layout.height} />
                  </clipPath>
                </defs>
                <line
                  x1="0"
                  x2={layout.trackWidth}
                  y1={layout.baseY}
                  y2={layout.baseY}
                  stroke="rgba(255,255,255,.18)"
                />
                {Array.from({ length: Math.ceil(layout.trackWidth / 60) }, (_, index) => (
                  <line
                    key={`tick-${index}`}
                    x1={index * 60}
                    x2={index * 60}
                    y1={layout.baseY}
                    y2={layout.baseY + (index % 5 ? 5 : 9)}
                    stroke={`rgba(255,255,255,${index % 5 ? 0.14 : 0.28})`}
                  />
                ))}
                <path d={layout.path} fill="none" stroke="rgba(255,255,255,.2)" strokeDasharray="2 7" />
                <g clipPath="url(#experience-route-clip)">
                  <path
                    d={`${layout.path} L${layout.trackWidth},${layout.baseY} L0,${layout.baseY} Z`}
                    fill="url(#experience-route-gradient)"
                  />
                  <path
                    ref={routeRef}
                    d={layout.path}
                    fill="none"
                    stroke="#5bdcf7"
                    strokeWidth="2"
                  />
                </g>
                {layout.points.map((point, index) => (
                  <g key={EXPERIENCE[index].year}>
                    <line
                      x1={point.x}
                      x2={point.x}
                      y1={96 + 300 + 12}
                      y2={point.y - 12}
                      stroke="rgba(255,255,255,.18)"
                      strokeDasharray="2 5"
                    />
                    <line
                      x1={point.x}
                      x2={point.x}
                      y1={point.y + 12}
                      y2={layout.baseY}
                      stroke="rgba(255,255,255,.12)"
                    />
                    <circle ref={(element) => { nodeRefs.current[index] = element; }} className="nd" cx={point.x} cy={point.y} r="7" />
                    <text
                      ref={(element) => { yearRefs.current[index] = element; }}
                      className="yt"
                      x={point.x}
                      y={layout.baseY + 30}
                    >
                      {EXPERIENCE[index].year}
                    </text>
                  </g>
                ))}
                <g ref={markerRef}>
                  <circle className="mk-h" r="16" fill="none" stroke="#5bdcf7" />
                  <circle r="5" fill="#5bdcf7" />
                </g>
              </svg>
              <div className="flex flex-col gap-2">
                {EXPERIENCE.map((item, index) => (
                  <ExperienceCard
                    key={item.span}
                    item={item}
                    index={index}
                    positioned={hasRoute}
                    cardRef={(element) => { cardRefs.current[index] = element; }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        {!hasRoute && (
          <div className="flex flex-col gap-2">
            {EXPERIENCE.map((item, index) => (
              <ExperienceCard
                key={item.span}
                item={item}
                index={index}
                cardRef={(element) => { cardRefs.current[index] = element; }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
