import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#2F5D50',
        secondary: '#8FAEA3',
        accent:    '#F6D982',
        bg:        '#F2F4F3',
        divider:   '#C9CECC',
        ink:       '#2E2E2E',
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [forms],
} satisfies Config
