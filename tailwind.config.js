/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — deep indigo/violet blend
        primary: {
          50:  '#f0edff',
          100: '#e2d9ff',
          200: '#c8b5ff',
          300: '#a886ff',
          400: '#8a55ff',
          500: '#6e2fff',
          600: '#5a18f0',
          700: '#4910cc',
          800: '#3a0da3',
          900: '#2c0a7a',
          950: '#190654',
        },
        // Accent — warm rose/coral
        accent: {
          50:  '#fff1f3',
          100: '#ffe0e5',
          200: '#ffc5ce',
          300: '#ff97a8',
          400: '#ff5f7a',
          500: '#ff2d55',
          600: '#ed1042',
          700: '#c80737',
          800: '#a60833',
          900: '#8c0b32',
        },
        // Surface colors
        surface: {
          50:  '#fafafa',
          100: '#f4f4f8',
          200: '#ebebf2',
          300: '#d8d8e8',
        },
        // Dark
        dark: {
          900: '#0d0b18',
          800: '#141224',
          700: '#1e1b33',
          600: '#2a2647',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(110, 47, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(110, 47, 255, 0.6)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-primary': 'radial-gradient(at 40% 20%, hsla(258, 100%, 70%, 0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(330, 100%, 70%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(258, 100%, 60%, 0.2) 0px, transparent 50%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(110, 47, 255, 0.25)',
        'glow-accent': '0 0 30px rgba(255, 45, 85, 0.2)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.08)',
        'elevated': '0 20px 60px rgba(0, 0, 0, 0.12)',
        'message-out': '0 2px 8px rgba(110, 47, 255, 0.3)',
        'message-in': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}