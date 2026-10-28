import React from 'react';
import { usePointerFine } from '../../hooks/usePointerFine';

export function ToolTip({ tipRef, imgRef, monoRef, capRef, idPrefix = 'tip' }) {
  const isFine = usePointerFine();

  if (!isFine) return null;

  return (
    <div
      id={idPrefix}
      ref={tipRef}
      className="fixed left-0 top-0 z-[80] pointer-events-none w-[104px] rounded-lg border border-hair bg-elevated/90 backdrop-blur-[16px] flex flex-col items-center gap-2.5 pt-5 pb-3.5 select-none"
      style={{
        boxShadow: '0 0 40px -10px rgba(91,220,247,.25)',
        opacity: 0
      }}
      aria-hidden="true"
    >
      <div className="relative w-12 h-12 grid place-items-center">
        <img
          id={`${idPrefix}Img`}
          ref={imgRef}
          alt=""
          className="w-full h-full object-contain"
          style={{ display: 'none' }}
        />
        <span
          id={`${idPrefix}Mono`}
          ref={monoRef}
          className="h2 text-[34px] text-cyan"
          style={{ display: 'none' }}
        />
      </div>
      <span id={`${idPrefix}Cap`} ref={capRef} className="mono text-[9px] text-mute" />
    </div>
  );
}
