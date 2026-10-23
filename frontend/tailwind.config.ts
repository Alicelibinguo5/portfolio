import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        cobalt: '#0048AC',
        rust: '#AB4200',
        'rust-deep': '#8A3500',
        navy: '#020E1C',
        sand: '#E9E6DF',
        panel: '#F5F4F0',
        line: '#E4E2DC',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-source-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif-zh': ['var(--font-noto-serif-sc)', 'Songti SC', 'STSong', 'serif'],
      },
      boxShadow: {
        botanical: '0 4px 6px -1px rgba(2, 14, 28, 0.05)',
        'botanical-md': '0 10px 15px -3px rgba(2, 14, 28, 0.05)',
        'botanical-lg': '0 20px 40px -10px rgba(2, 14, 28, 0.05)',
        'botanical-xl': '0 25px 50px -12px rgba(2, 14, 28, 0.15)',
      },
      borderRadius: { '3xl': '24px' },
      transitionDuration: { '500': '500ms', '700': '700ms', '1000': '1000ms' },
      transitionTimingFunction: { 'out-botanical': 'cubic-bezier(0.33, 1, 0.68, 1)' },
      animationDelay: { '100': '100ms', '200': '200ms', '300': '300ms' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
