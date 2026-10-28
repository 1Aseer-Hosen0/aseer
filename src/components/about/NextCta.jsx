import React from 'react';
import { SplitWords } from '../ui/SplitWords';
import { Button } from '../ui/Button';
import { SITE } from '../../data/site';

export function NextCta() {
  return (
    <div className="text-center flex flex-col items-center">
      <p data-rv className="mono text-dim mb-8">
        What are you thinking?
      </p>
      <SplitWords
        as="h2"
        text="That’s me. Your move."
        className="h2 text-[clamp(48px,9vw,148px)] max-w-[12ch]"
      />
      <div data-rv className="mt-12 flex flex-wrap justify-center gap-3">
        <Button as="a" href="#contact" size="about" data-cursor="link" magnetic>
          Send a brief →
        </Button>
        <Button
          as="a"
          variant="ghost"
          size="about"
          href={SITE.cvPath}
          download
          data-cursor="link"
          magnetic
        >
          Download CV (PDF)
        </Button>
      </div>
    </div>
  );
}
