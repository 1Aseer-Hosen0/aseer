import React, { useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { SectionHead } from '../ui/SectionHead';
import { SplitWords } from '../ui/SplitWords';
import { BriefForm } from './BriefForm';
import { BriefJson } from './BriefJson';
import { Elsewhere } from './Elsewhere';
import { Faq } from './Faq';

export function Contact({ numbers = { brief: '06', elsewhere: '07', faq: '08' } }) {
  const contactRef = useRef(null);

  const [formData, setFormData] = useState({
    from: '',
    email: '',
    company: '',
    needs: new Set(),
    brief: '',
    consent: false,
    words: 0
  });

  const countWords = (s) => (s.trim().match(/\S+/g) || []).length;
  const isEmailValid = /^\S+@\S+\.\S+$/.test(formData.email.trim());

  const okFlags = [
    !!formData.from.trim(),
    isEmailValid,
    countWords(formData.brief) > 0,
    formData.consent
  ];
  const isReady = okFlags.every(Boolean);

  useReveal(contactRef);

  return (
    <section
      id="contact"
      ref={contactRef}
      className="relative pl-6 pr-14 md:pl-20 md:pr-20 pt-28 md:pt-36 pb-28 md:pb-40 flex flex-col gap-32 md:gap-52"
    >
      {/* ========== [07] Contact ME ========== */}
      <div id="brief">
        <SectionHead number={numbers.brief} title="Contact Me" meta="≈ 2 min · 6 fields" />
        <SplitWords
          as="h2"
          text="Tell me things in Brief and Chill"
          className="h2 text-[clamp(40px,7vw,104px)] max-w-[14ch]"
        />

        <div className="mt-14 md:mt-24 grid lg:grid-cols-12 gap-14 lg:gap-20">
          <BriefForm
            formData={formData}
            setFormData={setFormData}
            isReady={isReady}
          />
          <BriefJson
            formData={formData}
            isReady={isReady}
            okFlags={okFlags}
          />
        </div>
      </div>

      {/* ========== [08] ELSEWHERE ========== */}
      <Elsewhere number={numbers.elsewhere} />

      {/* ========== [09] BEFORE YOU WRITE ========== */}
      <Faq number={numbers.faq} />
    </section>
  );
}
