import React, { useRef } from 'react';
import { LenisProvider } from './lib/LenisProvider';
import { Grain } from './components/Grain';
import { Cursor } from './components/Cursor';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { ScrollRail } from './components/ScrollRail';
import { Hero } from './components/hero/Hero';
import { Projects } from './components/projects/Projects';
import { About } from './components/about/About';
import { Skills } from './components/skills/Skills';
import { Contact } from './components/contact/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const headerRef = useRef(null);
  const railRef = useRef(null);
  const loaderRef = useRef(null);
  const countRef = useRef(null);

  // Sequential numbering across sections in page order
  const sectionNumbers = {
    projects: '01',
    story: '02',
    experience: '03',
    education: '04',
    certificates: '05',
    toolbox: '06',
    brief: '07',
    elsewhere: '08',
    faq: '09'
  };

  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-void text-ink font-sans">
        <Grain />
        <Cursor />
        <Loader loaderRef={loaderRef} countRef={countRef} />
        <Header headerRef={headerRef} />
        <ScrollRail railRef={railRef} />

        <main id="main-content" tabIndex={-1} className="outline-none">
          <Hero
            loaderRef={loaderRef}
            countRef={countRef}
            headerRef={headerRef}
            railRef={railRef}
          />
          <Projects number={sectionNumbers.projects} />
          <About
            numbers={{
              story: sectionNumbers.story,
              experience: sectionNumbers.experience,
              education: sectionNumbers.education,
              certificates: sectionNumbers.certificates
            }}
          />
          <Skills number={sectionNumbers.toolbox} />
          <Contact
            numbers={{
              brief: sectionNumbers.brief,
              elsewhere: sectionNumbers.elsewhere,
              faq: sectionNumbers.faq
            }}
          />
        </main>

        <Footer />
      </div>
    </LenisProvider>
  );
}
