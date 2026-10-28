import React from 'react';

export function ProjectRuler({
  projects,
  currentIndex,
  counterRef,
  onSegmentClick,
  rulerRef
}) {
  const N = projects.length;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <nav
      id="ruler"
      ref={rulerRef}
      className="hidden lg:flex absolute inset-x-0 bottom-0 z-20 items-end gap-3 h-16 bg-void"
      aria-label="Projects Navigation"
    >
      <span className="flex items-baseline gap-2 pb-0.5 pr-4 font-mono text-dim">
        <span
          id="cnt"
          ref={counterRef}
          className="inline-block text-ink text-[22px] leading-none tabular-nums overflow-hidden"
        >
          {pad(currentIndex + 1)}
        </span>
        <span className="text-[11px]">/ {pad(N)}</span>
      </span>

      {projects.map((p, i) => (
        <button
          key={p.name}
          className={`seg ${i === currentIndex ? 'on' : ''} relative flex-1 text-left pt-3 border-t border-white/10 outline-none cursor-pointer`}
          data-i={i}
          data-cursor="link"
          onClick={() => onSegmentClick(i)}
          aria-label={`Jump to project ${i + 1}: ${p.name}`}
        >
          <i
            className="sf absolute -top-px left-0 right-0 h-px bg-cyan origin-left"
            style={{ transform: i === 0 ? 'scaleX(1)' : 'scaleX(0)' }}
          />
          <span className="lab mono text-dim">
            <span className="no mr-3">{pad(i + 1)}</span>
            {p.name}
          </span>
        </button>
      ))}
    </nav>
  );
}
