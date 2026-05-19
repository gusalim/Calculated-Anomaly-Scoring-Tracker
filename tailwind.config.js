/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: '#080c10',
          panel: '#0d1117',
          border: '#1a2332',
          accent: '#00e5ff',
          danger: '#ff1744',
          warn: '#ffab00',
          safe: '#00e676',
          muted: '#37474f',
          text: '#b0bec5',
        }
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'pulse-danger': 'pulse-danger 1.5s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-danger': {
          '0%, 100%': { boxShadow: '0 0 5px #ff1744, 0 0 20px #ff174440' },
          '50%': { boxShadow: '0 0 20px #ff1744, 0 0 60px #ff174480' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
