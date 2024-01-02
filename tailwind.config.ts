import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite',
        rotate: 'spin 500ms ease-in-out 1'
      }
    }
  }
} satisfies Config
