import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        alabaster: '#F9F8F4',
        forest: '#2D3A31',
        sage: '#8C9A84',
        clay: '#DCCFC2',
        'soft-clay': '#F2F0EB',
        stone: '#E6E2DA',
        terracotta: '#C27B66',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        botanical: '0 4px 6px -1px rgba(45, 58, 49, 0.05)',
        'botanical-md': '0 10px 15px -3px rgba(45, 58, 49, 0.05)',
        'botanical-lg': '0 20px 40px -10px rgba(45, 58, 49, 0.05)',
        'botanical-xl': '0 25px 50px -12px rgba(45, 58, 49, 0.15)',
      },
      borderRadius: {
        '3xl': '24px',
      },
      transitionDuration: {
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
