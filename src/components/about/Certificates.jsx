import React, { useRef, useEffect, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { SectionHead } from '../ui/SectionHead';
import { SplitWords } from '../ui/SplitWords';
import { usePointerFine } from '../../hooks/usePointerFine';
import { CERTS } from '../../data/certificates';

export function Certificates({ number = '04' }) {
  const isFine = usePointerFine();
  const certsRef = useRef(null);
  const ctipRef = useRef(null);
  const [previewCert, setPreviewCert] = useState(null);
  const shownRef = useRef(false);
  const qxRef = useRef(null);
  const qyRef = useRef(null);
  const qrRef = useRef(null);
  const lxRef = useRef(0);
  const rtRef = useRef(null);

  const previewWidth = 320;
  const previewHeight = 185;
  const px = (x) => Math.max(12, Math.min(x + 30, window.innerWidth - previewWidth - 12));
  const py = (y) => Math.max(12, Math.min(y - 70, window.innerHeight - previewHeight - 12));

  useEffect(() => {
    if (!isFine || !ctipRef.current) return;
    const ct = ctipRef.current;

    gsap.set(ct, { scale: 0.6, opacity: 0 });
    qxRef.current = gsap.quickTo(ct, 'x', { duration: 0.55, ease: 'power3' });
    qyRef.current = gsap.quickTo(ct, 'y', { duration: 0.55, ease: 'power3' });
    qrRef.current = gsap.quickTo(ct, 'rotation', { duration: 0.7, ease: 'power3' });

    const onMouseMove = (e) => {
      if (qxRef.current) qxRef.current(px(e.clientX));
      if (qyRef.current) qyRef.current(py(e.clientY));
      if (qrRef.current) {
        qrRef.current(gsap.utils.clamp(-12, 12, (e.clientX - lxRef.current) * 0.5));
      }
      lxRef.current = e.clientX;
      clearTimeout(rtRef.current);
      rtRef.current = setTimeout(() => {
        if (qrRef.current) qrRef.current(0);
      }, 90);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(rtRef.current);
    };
  }, [isFine]);

  const show = (cert, clientX, clientY) => {
    if (!isFine || !cert.image || !ctipRef.current) return;
    const ct = ctipRef.current;
    setPreviewCert(cert);

    if (!shownRef.current) {
      gsap.set(ct, { x: px(clientX), y: py(clientY) });
      shownRef.current = true;
    }

    gsap.to(ct, { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
  };

  const hide = () => {
    if (!ctipRef.current) return;
    shownRef.current = false;
    gsap.to(ctipRef.current, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power3.in', overwrite: 'auto' });
  };

  return (
    <div id="certificates" ref={certsRef} className="relative">
      {isFine && (
        <div
          id="ctip"
          ref={ctipRef}
          className="fixed left-0 top-0 z-[80] pointer-events-none overflow-hidden rounded-lg border border-hair select-none"
          style={{
            width: `${previewWidth}px`,
            aspectRatio: '2000 / 1154',
            boxShadow: '0 0 40px -10px rgba(91,220,247,.25)',
            opacity: 0
          }}
          aria-hidden="true"
        >
          {previewCert && (
            <img
              src={previewCert.image}
              alt={`${previewCert.n} certificate`}
              className="block h-full w-full object-cover"
            />
          )}
        </div>
      )}

      <SectionHead
        number={number}
        title="Certificates"
        meta={`${CERTS.length} credentials`}
      />

      <SplitWords
        as="h2"
        text="Proof of Credentials."
        className="h2 text-[clamp(40px,7vw,104px)] max-w-[14ch]"
      />

      <div className="mt-14 md:mt-24">
        <div className="hidden md:grid grid-cols-12 gap-4 mono text-dim pb-3 pr-8">
          <span>No.</span>
          <span className="col-span-6">Credential</span>
          <span className="col-span-3">Issuer</span>
          <span className="col-span-2 text-right">Year</span>
        </div>

        <ul id="certs" className="border-t border-hair">
          {CERTS.map((c, k) => (
            <li key={c.id} data-rv className="border-b border-hair">
              <a
                href={c.u}
                className="cr relative flex items-center py-6 md:py-7 pr-8 outline-none cursor-pointer"
                data-cursor="link"
                data-i={k}
                onMouseEnter={(e) => show(c, e.clientX, e.clientY)}
                onMouseLeave={hide}
                onFocus={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  show(c, r.right - 300, r.top + r.height / 2 + 70);
                }}
                onBlur={hide}
                target="_blank"
              >
                <span className="rin grid grid-cols-12 items-center gap-4 w-full">
                  <span className="mono text-dim col-span-2 md:col-span-1">
                    {String(k + 1).padStart(2, '0')}
                  </span>
                  <span className="col-span-10 md:col-span-6">
                    <span className="tt h2 block text-[clamp(26px,3.2vw,44px)]">
                      {c.n}
                    </span>
                    <span className="md:hidden block mono text-dim normal-case tracking-normal text-[12px] mt-2">
                      {c.i} · {c.y}
                    </span>
                  </span>
                  <span className="hidden md:block col-span-3 mono text-mute normal-case tracking-normal text-[12px]">
                    {c.i}
                  </span>
                  <span className="hidden md:block col-span-2 mono text-dim text-right">
                    {c.y}
                  </span>
                </span>
                <span className="ar absolute right-0 text-xl text-mute">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
