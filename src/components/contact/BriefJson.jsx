import React, { useRef, useEffect, useState } from 'react';

export function BriefJson({ formData, isReady, okFlags }) {
  const prevRef = useRef({});
  const [flashKeys, setFlashKeys] = useState({});

  const { from, email, company, needs, words } = formData;

  const currentData = {
    from: from || null,
    email: email || null,
    company: company || null,
    needs: needs?.size ? Array.from(needs) : null,
    words: words || null
  };

  const keys = Object.keys(currentData);

  useEffect(() => {
    const newFlashes = {};
    keys.forEach((k) => {
      const s = JSON.stringify(currentData[k]);
      if (prevRef.current[k] !== undefined && prevRef.current[k] !== s) {
        newFlashes[k] = Date.now();
      }
      prevRef.current[k] = s;
    });
    if (Object.keys(newFlashes).length > 0) {
      setFlashKeys((prev) => ({ ...prev, ...newFlashes }));
    }
  }, [from, email, company, needs, words]);

  const getCls = (v) => {
    if (v === null) return 'text-dim';
    if (typeof v === 'string' || Array.isArray(v)) return 'text-ink';
    return 'text-cyan';
  };

  const requiredCount = okFlags.filter(Boolean).length;

  return (
    <aside className="lg:col-span-5" data-rv>
      <div className="lg:sticky lg:top-24 relative rounded-lg border border-hair bg-base">
        <i className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-cyan" />
        <i className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-cyan" />

        <div className="flex items-center justify-between px-5 py-3.5 border-b border-hair mono text-mute">
          <span>brief.json</span>
          <span
            id="state"
            className={`px-2.5 py-1 rounded-full border ${
              isReady
                ? 'border-cyan/40 bg-cyan/[.06] text-cyan'
                : 'border-hair text-dim'
            }`}
          >
            {isReady ? 'ready' : 'draft'}
          </span>
        </div>

        <pre id="json" className="px-5 py-5 font-mono text-[13px] leading-[1.75] text-mute whitespace-pre-wrap" aria-live="off">
          <div>{'{'}</div>
          {keys.map((k, i) => {
            const val = currentData[k];
            const jsonStr = JSON.stringify(val);
            const flashTime = flashKeys[k];
            return (
              <div
                key={`${k}-${flashTime || 'init'}`}
                className={`jl ${flashTime ? 'flash' : ''}`}
              >
                &nbsp;&nbsp;<span className="text-mute">"{k}"</span>: <span className={getCls(val)}>{jsonStr}</span>
                {i < keys.length - 1 ? ',' : ''}
              </div>
            );
          })}
          <div>{'}'}</div>
        </pre>

        <div className="px-5 py-4 border-t border-hair">
          <div className="flex items-center justify-between mono text-mute mb-3">
            <span id="req">Required {requiredCount}/4</span>
            <span className="flex gap-1.5" id="ticks">
              {okFlags.map((ok, idx) => (
                <i
                  key={idx}
                  className="w-6 h-[3px] rounded-full transition-colors duration-500"
                  style={{ background: ok ? '#5bdcf7' : 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </span>
          </div>
          <p className="mono text-dim normal-case tracking-normal text-[11px]">
            Compiled locally · sent only on submit
          </p>
        </div>
      </div>
    </aside>
  );
}
