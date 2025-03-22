/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a84ff',
          dark: '#0066cc',
          light: '#5eb5ff',
        },
        secondary: {
          DEFAULT: '#ff375f',
          dark: '#cc0033',
          light: '#ff708c',
        },
        background: {
          DEFAULT: '#121212',
          glass: 'rgba(18, 18, 18, 0.7)',
          card: 'rgba(30, 30, 30, 0.6)',
        },
        accent: {
          green: '#30d158',
          yellow: '#ffd60a',
          purple: '#bf5af2',
          teal: '#64d2ff',
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 