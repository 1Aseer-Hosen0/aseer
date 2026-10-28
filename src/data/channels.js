const si = (s, c) => c ? `https://cdn.simpleicons.org/${s}/${c}` : `https://cdn.simpleicons.org/${s}`;

export const CHANNELS = [
  {
    index: '01',
    name: 'Email',
    handle: 'aseerhosen213@gmail.com',
    url: 'mailto:aseerhosen213@gmail.com',
    note: 'Briefs, questions, confusions. The fastest way.',
    icon: si('gmail'),
    isEmail: true
  },
  {
    index: '02',
    name: 'Instagram',
    handle: '_critical._.thinker_',
    url: 'https://www.instagram.com/_critical._.thinker_/',
    note: 'Best for knowing my taste.',
    icon: si('instagram')
  },
  {
    index: '03',
    name: 'GitHub',
    handle: 'aseerhosen',
    url: 'https://github.com/1Aseer-Hosen0/',
    note: 'Code, experiments, open-source bits.',
    icon: si('github', 'fff')
  },
  {
    index: '04',
    name: 'Linktree',
    handle: 'aseerhosen',
    url: 'https://linktr.ee/aseerhosen',
    note: 'You can find all the link here.',
    icon: si('linktree')
  },
];

export const FOOTER_LINKS = {
  site: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' }
  ],
  elsewhere: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aseerhosen27/', external: true },
    { label: 'GitHub', href: 'https://github.com/1Aseer-Hosen0/', external: true },
    { label: 'Instagram', href: 'https://www.instagram.com/_critical._.thinker_/', external: true }
  ],
  contact: [
    { label: 'Send a brief', href: 'mailto:aseerhosen213@gmail.com', external: true },
    { label: 'Linktree', href: 'https://linktr.ee/aseerhosen', external: true }
  ]
};
