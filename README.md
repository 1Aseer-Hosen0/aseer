# Aseer Hosen — Portfolio (React Single-Page Application)

A faithful React 18 single-page port of the Obsidian Atelier portfolio design, built with Vite, Tailwind CSS 3.4, GSAP 3.12 (ScrollTrigger + `@gsap/react`), and Lenis 1.1 smooth scroll.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Development
```bash
# Navigate to the portfolio directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
portfolio/
├── index.html                   # HTML template with Google Fonts (Bricolage Grotesque, Geist, JetBrains Mono)
├── package.json                 # Dependencies (React 18, GSAP, Lenis, Tailwind 3.4)
├── tailwind.config.js           # Design tokens (void, base, elevated, card, ink, cyan, mute, dim, hair)
├── postcss.config.js            # PostCSS pipeline for Tailwind CSS
├── public/
│   └── aseer.png                # Transparent cutout portrait used by Hero and About
├── src/
│   ├── main.jsx                 # React root mount (StrictMode enabled)
│   ├── App.jsx                  # Main page composer in sequential order
│   ├── styles/
│   │   └── index.css            # Tailwind directives + global utility and interaction styles
│   ├── lib/
│   │   ├── gsap.js              # Registers ScrollTrigger & useGSAP once
│   │   └── LenisProvider.jsx    # Lenis smooth-scroll context synced with GSAP ticker
│   ├── hooks/
│   │   ├── useReveal.js         # Scoped data-rv batch reveal hook
│   │   ├── useClock.js          # Live Dhaka (UTC+6) time clock
│   │   ├── usePointerFine.js    # (hover: hover) & (pointer: fine) touch detection
│   │   └── useFollowTip.js      # Reusable cursor-following floating preview hook
│   ├── data/
│   │   ├── site.js              # Site-wide meta, bio, email, endpoint, and facts
│   │   ├── projects.js          # Showcase projects (live/repo variants, tags, descriptions)
│   │   ├── toolbox.js           # Principles and tools grouped into sticky shelves
│   │   ├── education.js         # Academic timeline chapters
│   │   ├── certificates.js      # Credentials and issuers
│   │   ├── faq.js               # Questions & answers accordion data
│   │   └── channels.js          # Social channels and footer navigation links
│   └── components/
│       ├── ui/                  # SplitWords, SplitChars, SectionHead, Reveal, Button, Chip, RollWord, IndexRow
│       ├── Grain.jsx            # Fixed 6% SVG noise overlay
│       ├── Cursor.jsx           # Blend-difference custom cursor with event delegation
│       ├── Loader.jsx           # 0–100 intro counter and lifting curtain
│       ├── Header.jsx           # Frosted glass header with centered LOGO & skip link
│       ├── ScrollRail.jsx       # Fixed right rail with 000–100 readout & draggable thumb
│       ├── hero/
│       │   ├── Hero.jsx         # Hero section (depth parallax, name behind portrait, intro timeline)
│       │   └── TopoCanvas.jsx   # Marching-squares contour field renderer
│       ├── about/
│       │   ├── About.jsx        # About section composer
│       │   ├── Story.jsx        # Long story short with scrub-lit lead and drifting portrait
│       │   ├── Education.jsx    # Education timeline with scrub-filled cyan spine and lighting nodes
│       │   ├── Certificates.jsx # Credentials list with cursor-following card preview
│       │   ├── Marquee.jsx      # Continuous velocity marquee with scroll skew
│       │   └── NextCta.jsx      # Closing CTA with brief link and CV download
│       ├── skills/
│       │   ├── Skills.jsx       # Skills section composer
│       │   ├── Principles.jsx   # Principles with scroll-illuminating rolling words
│       │   ├── Toolbox.jsx      # Sticky stacked shelves and devicon tools
│       │   └── ToolTip.jsx      # Cursor-following floating icon preview tile
│       ├── projects/
│       │   ├── Projects.jsx     # Selected work (desktop pinned sheet-wipe, mobile stacked cards)
│       │   ├── ProjectSheet.jsx # Individual project card with contour/screenshot preview
│       │   ├── ProjectRuler.jsx # Segmented progress navigation with roll counter
│       │   └── ProjectBubble.jsx# Cursor bubble for project preview hover
│       ├── contact/
│       │   ├── Contact.jsx      # Contact section composer
│       │   ├── BriefForm.jsx    # Controlled interactive form (needs, word count)
│       │   ├── BriefJson.jsx    # Live reactive JSON preview with flashing diffs
│       │   ├── Elsewhere.jsx    # Social channels with copy email button
│       │   └── Faq.jsx          # Accessible animated accordion with height tweens
│       └── Footer.jsx           # Fitted container-width name with proximity hover
```

---

## ✏️ Editing Content & Placeholders

All portfolio content is decoupled from components and lives in `src/data/`:

| What to change | File | Notes |
|---|---|---|
| **Site meta, email, endpoint, bio** | `src/data/site.js` | Update `email`, `endpoint` (Formspree/Netlify), `bio`, and `moto`. |
| **Projects (Selected work)** | `src/data/projects.js` | Add/edit projects in `PROJECTS`. Set `live: true` for live sites or `false` for repos. Add screenshot paths to `shot: 'assets/<name>.jpg'`. |
| **Skills & Principles** | `src/data/toolbox.js` | Modify `PRINCIPLES` and tools inside `GROUPS` (supports Devicon slugs and custom URLs). |
| **Education history** | `src/data/education.js` | Edit chapters in `EDU`. |
| **Certifications** | `src/data/certificates.js` | Edit credentials, issuers, and years in `CERTS`. |
| **FAQ questions & answers** | `src/data/faq.js` | Add or update items in `FAQ`. |
| **Social handles & Footer links** | `src/data/channels.js` | Update URLs, handles, and footer navigation links in `CHANNELS` and `FOOTER_LINKS`. |
| **Cutout portrait** | `public/aseer.png` | Replace with your transparent cut-out portrait PNG (recommended 800×800+). |
| **Resume file** | `public/cv.pdf` | Place your downloadable resume PDF in `public/cv.pdf`. |

---

## 🎨 Design System & Motion Features

- **Obsidian Palette:** Void `#050505`, Base `#0A0A0A`, Elevated `#141414`, Card `#1A1A1A`, Ink `#F5F5F7`, Cyan `#5bdcf7`.
- **Display Typography:** Bricolage Grotesque (condensed, axes `wdth 75`, weights 700/800).
- **Body & Code Typography:** Geist (body) & JetBrains Mono (labels/indices/buttons).
- **Motion Parity:**
  - One synchronized Lenis instance (`lerp: 0.08`) registered with ScrollTrigger and GSAP ticker.
  - Interactive right scrollbar rail (000–100 numerical readout + draggable/seekable cyan thumb).
  - Custom difference blend cursor with event delegation (`data-cursor="link"` and `data-cursor="hello"`).
  - Marching-squares topographic canvas with mouse bulge, value noise, and live contour elevation readout.
  - Hero mouse depth parallax and magnetic buttons.
  - Desktop pinned sheet-wipe project showcase with segmented navigation ruler.
  - Sticky stacked toolbox shelves with brightness/scale recession.
  - Cursor-following floating previews: tool icon tile with velocity tilt, credential card, and project bubble.
  - Reactive `brief.json` panel that compares previous render and flashes changed lines.
  - Footer giant name "ASEER HOSEN" dynamically fitted to viewport width with cursor proximity hover.
- **Accessibility:**
  - Full `prefers-reduced-motion` support: disables pins, scrubs, and parallax while presenting content immediately.
  - Keyboard accessible: `focus-visible` rings, `tabIndex` triggers, skip to content link, and ARIA landmarks.
