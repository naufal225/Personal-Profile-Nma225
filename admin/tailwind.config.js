/** @type {import('tailwindcss').Config} */

// Map a design CSS variable onto a Tailwind color token, with alpha-modifier
// support via color-mix (design tokens are full colors, not HSL triplets).
const v = (name) => ({ opacityValue }) =>
  opacityValue === undefined || opacityValue === null
    ? `var(${name})`
    : `color-mix(in oklch, var(${name}) ${Math.round(Number(opacityValue) * 100)}%, transparent)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: v('--border'),
        input: v('--border-strong'),
        ring: v('--accent'),
        background: v('--bg'),
        foreground: v('--text'),
        primary: { DEFAULT: v('--accent'), foreground: v('--accent-contrast') },
        secondary: { DEFAULT: v('--panel-2'), foreground: v('--text') },
        destructive: { DEFAULT: v('--danger'), foreground: () => '#ffffff' },
        muted: { DEFAULT: v('--panel-2'), foreground: v('--muted') },
        accent: { DEFAULT: v('--accent-soft'), foreground: v('--accent') },
        popover: { DEFAULT: v('--panel'), foreground: v('--text') },
        card: { DEFAULT: v('--panel'), foreground: v('--text') },
        ink: {
          950: '#08080c',
          900: '#101017',
          800: '#14141d',
          700: '#181822',
        },
      },
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'var(--radius-sm)',
        sm: 'calc(var(--radius-sm) - 3px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
