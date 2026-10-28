import React, { useRef, useState } from 'react';
import { SectionHead } from '../ui/SectionHead';
import { ToolTip } from '../skills/ToolTip';
import { CHANNELS } from '../../data/channels';
import { SITE } from '../../data/site';
import { gsap } from '../../lib/gsap';
import { useFollowTip } from '../../hooks/useFollowTip';
import { usePointerFine } from '../../hooks/usePointerFine';

export function Elsewhere({ number = '08' }) {
  const [copied, setCopied] = useState(false);
  const isFine = usePointerFine();
  const tipRef = useRef(null);
  const imgRef = useRef(null);
  const monoRef = useRef(null);
  const capRef = useRef(null);
  const tip = useFollowTip({ tipRef, enabled: isFine });

  const showTip = (channel, clientX, clientY) => {
    if (!isFine || !tipRef.current || !imgRef.current || !monoRef.current || !capRef.current) return;

    const img = imgRef.current;
    const mono = monoRef.current;
    capRef.current.textContent = channel.name;
    mono.textContent = channel.name.slice(0, 2);
    img.dataset.previewIcon = channel.icon;
    img.style.display = 'none';
    mono.style.display = 'block';

    img.onload = () => {
      if (img.dataset.previewIcon !== channel.icon) return;
      img.style.display = 'block';
      mono.style.display = 'none';
      gsap.fromTo(
        img,
        { scale: 0.5, opacity: 0, rotate: -14 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(2.2)', overwrite: true }
      );
    };
    img.onerror = () => {
      if (img.dataset.previewIcon !== channel.icon) return;
      img.style.display = 'none';
      mono.style.display = 'block';
      gsap.fromTo(
        mono,
        { scale: 0.5, opacity: 0, rotate: -14 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(2.2)', overwrite: true }
      );
    };
    img.src = channel.icon;
    if (img.complete) {
      if (img.naturalWidth) img.onload();
      else img.onerror();
    }

    tip.show(clientX, clientY);
  };

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(SITE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div id="elsewhere">
      <ToolTip tipRef={tipRef} imgRef={imgRef} monoRef={monoRef} capRef={capRef} idPrefix="elsewhereTip" />
      <SectionHead number={number} title="Elsewhere" meta={`${CHANNELS.length} channels`} />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
        <h2 data-split class="h2 lg:col-span-5 lg:sticky lg:top-28 self-start text-[clamp(40px,5.5vw,80px)]">
          Or find me here.
        </h2>

        <ul className="lg:col-span-7 border-t border-hair">
          {CHANNELS.map((ch) => (
            <li key={ch.index} data-rv className="flex items-stretch border-b border-hair">
              <a
                href={ch.url}
                className="lr flex-1 flex items-center gap-5 md:gap-8 py-7 pr-2"
                data-cursor="link"
                onMouseEnter={(e) => showTip(ch, e.clientX, e.clientY)}
                onMouseLeave={tip.hide}
                onFocus={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  showTip(ch, rect.right - 160, rect.top + rect.height / 2 + 60);
                }}
                onBlur={tip.hide}
                {...(ch.isEmail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <span className="rin flex items-center gap-5 md:gap-8 w-full">
                  <span className="mono text-dim w-6 flex-none">{ch.index}</span>
                  <span className="tt font-display text-[28px] md:text-[34px] font-semibold tracking-tight w-28 md:w-40 [font-variation-settings:'wdth'_75] transition-colors flex-none">
                    {ch.name}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-mono text-[13px] text-ink truncate">
                      {ch.handle}
                    </span>
                    <span className="block text-[14px] text-mute mt-1">
                      {ch.note}
                    </span>
                  </span>
                </span>
                <span className="ar text-xl text-mute flex-none">
                  {ch.isEmail ? '→' : '↗'}
                </span>
              </a>

              {ch.isEmail && (
                <button
                  id="copy"
                  onClick={handleCopy}
                  className="mono text-mute hover:text-cyan transition-colors px-4 self-center cursor-pointer"
                  data-cursor="link"
                  aria-label="Copy email address"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
