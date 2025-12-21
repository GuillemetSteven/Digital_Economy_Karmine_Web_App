/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        karmine: {
          bg: '#020617',
          surface: '#0a1428',
          surfaceAlt: '#050b14',
          darker: '#0f172a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'letter-appear': 'letterAppear 0.1s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        letterAppear: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 20px rgba(37, 99, 235, 0.5), 0 0 40px rgba(37, 99, 235, 0.3)' },
          '50%': { textShadow: '0 0 30px rgba(37, 99, 235, 0.8), 0 0 60px rgba(37, 99, 235, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
