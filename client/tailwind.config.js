/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06070a',
          900: '#0b0d13',
          850: '#10141c',
          800: '#161b26',
          750: '#1e2433',
          700: '#262e40',
          600: '#38435d',
        },
        neon: {
          purple: '#9d4edd',
          violet: '#7b2cbf',
          indigo: '#5a189a',
          cyan: '#00f0ff',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar-sweep 3s linear infinite',
        'radar-ripple': 'radar-ripple 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'radar-ripple': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        'neon-purple': '0 0 25px -5px rgba(157, 78, 221, 0.4)',
        'neon-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'neon-glow': '0 0 35px -8px rgba(123, 44, 191, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
