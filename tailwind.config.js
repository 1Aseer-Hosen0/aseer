/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        base: '#0A0A0A',
        elevated: '#141414',
        card: '#1A1A1A',
        ink: '#F5F5F7',
        cyan: {
          DEFAULT: '#5bdcf7'
        },
        spark: '#fff14a',
        mute: '#A1A1AA',
        dim: '#737373'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Geist', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderColor: {
        hair: 'rgba(255,255,255,0.08)'
      }
    },
  },
  plugins: [],
}
