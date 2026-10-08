import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hilunia: {
          violet: '#7C5CFF',
          'violet-dark': '#6344E8',
          'violet-light': '#9B7FFF',
          rose: '#FF4FA3',
          'rose-dark': '#E8388A',
          'rose-light': '#FF79BE',
          'light-rose': '#FFD6EA',
          coral: '#FF7A6B',
          'coral-dark': '#E8634F',
          'bg-light': '#FAF7FF',
          'bg-dark': '#14101F',
          'surface': '#1E1836',
          'surface-2': '#251F3A',
          'border': '#2D2550',
          'text-muted': '#9B8FC4',
          'text-dim': '#6B5F8A',
        }
      },
      backgroundImage: {
        'hilunia-gradient': 'linear-gradient(135deg, #7C5CFF 0%, #FF4FA3 100%)',
        'hilunia-gradient-v': 'linear-gradient(180deg, #7C5CFF 0%, #FF4FA3 100%)',
        'hilunia-gradient-soft': 'linear-gradient(135deg, rgba(124,92,255,0.15) 0%, rgba(255,79,163,0.15) 100%)',
        'hilunia-card': 'linear-gradient(180deg, transparent 30%, rgba(20,16,31,0.95) 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-soft': 'bounceSoft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'card-swipe-left': 'swipeLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'card-swipe-right': 'swipeRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 92, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 79, 163, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        swipeLeft: {
          '0%': { opacity: '1', transform: 'translateX(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translateX(-120%) rotate(-20deg)' },
        },
        swipeRight: {
          '0%': { opacity: '1', transform: 'translateX(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translateX(120%) rotate(20deg)' },
        },
      },
      boxShadow: {
        'hilunia': '0 4px 24px rgba(124, 92, 255, 0.25)',
        'hilunia-lg': '0 8px 48px rgba(124, 92, 255, 0.35)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.35)',
        'glow-violet': '0 0 30px rgba(124, 92, 255, 0.5)',
        'glow-rose': '0 0 30px rgba(255, 79, 163, 0.5)',
        'glow-coral': '0 0 30px rgba(255, 122, 107, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(124, 92, 255, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      screens: {
        'xs': '380px',
      },
    },
  },
  plugins: [],
}
export default config
