const dv = s => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${s}/${s}-original.svg`;
const si = (s, c) => c ? `https://cdn.simpleicons.org/${s}/${c}` : `https://cdn.simpleicons.org/${s}`;

export const GROUPS = [
  {
    n: '01',
    t: 'Design',
    d: 'I start design with a feeling, then turn it into a system: type, spacing, states and motion notes that a browser can actually keep.',
    items: [
      ['Claude', si('claude'), 'AI · LLM · Assistant'],
      ['v0 by Vercel', si('v0', "fff"), 'App Builder · No Code'],
      ['Figma', dv('figma'), 'Interfaces · systems · prototypes'],
      ['Photoshop', dv('photoshop'), 'Image work · retouching'],
      ['Canva', dv('canva'), 'Design · Graphic · Presentation'],
    ]
  },
  {
    n: '02',
    t: 'Development',
    d: 'Hand-built, semantic and fast. I write the markup and the styles myself, so every detail in the design survives the build.',
    items: [
      ['HTML', dv('html5'), 'Semantic · accessible markup'],
      ['CSS', dv('css3'), 'Grid · layers · modern CSS'],
      ['JavaScript', dv('javascript'), 'Interaction · state · APIs'],
      ['TypeScript', dv('typescript'), 'Typed · safer builds'],
      ['React', dv('react'), 'Components · hooks'],
      ['Tailwind CSS', dv('tailwindcss'), 'Tokens · utility-first']
    ]
  },
  {
    n: '03',
    t: 'Motion & tooling',
    d: 'Scroll-linked stories, smooth cursors and 60 fps transitions, shipped with a workflow that keeps them maintainable.',
    items: [
      ['GSAP', si('greensock'), 'ScrollTrigger · timelines'],
      ['Framer Motion', si('framer'), 'Springs · layout transitions'],
      ['Vite', dv('vitejs'), 'Build Tool · Frontend'],
      ['Git', dv('git'), 'Version control · Development'],
      ['npm', si('npm'), 'Package management · Registry'],
      ['VS Code', dv('vscode'), 'Editor · workflow']
    ]
  }
];

export const PRINCIPLES = [
  {
    title: 'Considered.',
    index: '01',
    note: 'Every pixel earns its place'
  },
  {
    title: 'Fluid.',
    index: '02',
    note: '60 fps · motion profiled'
  },
  {
    title: 'Accessible.',
    index: '03',
    note: 'WCAG 2.1 AA · keyboard first'
  }
];
