import React from 'react';
import { usePointerFine } from '../../hooks/usePointerFine';

export function ProjectBubble({ bubbleRef, textRef }) {
  const isFine = usePointerFine();
  if (!isFine) return null;

  return (
    <div
      id="bub"
      ref={bubbleRef}
      className="fixed left-0 top-0 z-[80] pointer-events-none h-10 px-4 rounded-full bg-cyan text-void flex items-center mono text-[10px] font-medium whitespace-nowrap select-none"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <span ref={textRef} id="bubT">
        Visit live ↗
      </span>
    </div>
  );
}
