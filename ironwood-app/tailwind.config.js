/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        "deep-space-blue": "#0B1026",
        "medical-teal": "#00B8D4",
        "neon-purple": "#6E56CF",
        "clinical-white": "#F8FAFC",
        
        // Secondary Colors
        "soft-mint": "#42E695",
        "electric-coral": "#FF6B6B",
        "amber-gold": "#FFD166",
        "lavender-mist": "#B8C0FF",
        
        // Neutral Colors
        "space-black": "#000814",
        "cosmic-gray": "#1E293B",
        "nebula-gray": "#475569",
        "stellar-gray": "#94A3B8",
        "lunar-light": "#E2E8F0",
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', 'Roboto', 'system-ui', 'sans-serif'],
        numeric: ['Space Grotesk', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        'micro': '0.75rem',
        'small': '0.875rem',
        'base': '1rem',
        'h4': '1.25rem',
        'h3': '1.5rem',
        'h2': '2rem',
        'h1': '3rem',
      },
      spacing: {
        '2xs': '0.25rem',
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
      },
      backdropBlur: {
        'card': '10px',
        'modal': '20px',
      },
    },
  },
  plugins: [],
}

