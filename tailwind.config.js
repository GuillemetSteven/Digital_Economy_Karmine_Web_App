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
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'letter-appear': 'letterAppear 0.1s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'progress-charge': 'progressCharge 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'key-blink': 'keyBlink 0.15s ease-out',
        'border-glow': 'borderGlow 0.3s ease-out forwards',
        'text-pulse': 'textPulse 0.3s ease-in-out',
        'counter-glow': 'counterGlow 2s ease-in-out infinite',
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
        progressCharge: {
          '0%': { width: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { width: '100%', opacity: '1' }
        },
        pulseDot: {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 10px rgba(191, 219, 254, 0.8)'
          },
          '50%': {
            opacity: '0.6',
            boxShadow: '0 0 20px rgba(191, 219, 254, 0.4)'
          }
        },
        keyBlink: {
          '0%': { backgroundColor: 'rgba(191, 219, 254, 0.3)' },
          '50%': { backgroundColor: 'rgba(191, 219, 254, 0.6)' },
          '100%': { backgroundColor: 'rgba(191, 219, 254, 0.1)' }
        },
        borderGlow: {
          '0%': {
            borderColor: 'rgba(59, 130, 246, 0.3)',
            boxShadow: 'none'
          },
          '100%': {
            borderColor: 'rgba(191, 219, 254, 0.8)',
            boxShadow: '0 0 20px rgba(191, 219, 254, 0.4)'
          }
        },
        textPulse: {
          '0%': { opacity: '0.5' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.5' }
        },
        counterGlow: {
          '0%, 100%': {
            textShadow: '0 0 4px rgba(147, 197, 253, 0.4)'
          },
          '50%': {
            textShadow: '0 0 10px rgba(147, 197, 253, 0.8), 0 0 20px rgba(147, 197, 253, 0.4)'
          }
        }
      },
    },
  },
  plugins: [],
}
