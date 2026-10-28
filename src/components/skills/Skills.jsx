import React, { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { Toolbox } from './Toolbox';

export function Skills({ number = '05' }) {
  const skillsRef = useRef(null);

  useReveal(skillsRef, '[data-rv]', 32);

  return (
    <section
      id="skills"
      ref={skillsRef}
      className="relative pl-6 pr-14 md:pl-20 md:pr-20 pt-28 md:pt-40 pb-28 md:pb-40"
    >
      <Toolbox number={number} />
    </section>
  );
}
