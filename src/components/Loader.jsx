import React from 'react';

export function Loader({ loaderRef, countRef }) {
  return (
    <div
      ref={loaderRef}
      id="loader"
      className="fixed inset-0 z-[95] bg-void flex items-end justify-between p-6 md:p-12 select-none"
    >
      <span className="font-mono text-xs tracking-[.08em] text-dim">
        Aseer Hosen, portfolio 2026
      </span>
      <span
        ref={countRef}
        id="count"
        className="name text-[26vw] md:text-[16vw] leading-[.8] text-ink tabular-nums"
      >
        0
      </span>
    </div>
  );
}
