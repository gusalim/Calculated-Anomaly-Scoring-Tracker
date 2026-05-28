/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: 'rgb(var(--terminal-bg) / <alpha-value>)',
          panel: 'rgb(var(--terminal-panel) / <alpha-value>)',
          border: 'rgb(var(--terminal-border) / <alpha-value>)',
          accent: 'rgb(var(--terminal-accent) / <alpha-value>)',
          danger: 'rgb(var(--terminal-danger) / <alpha-value>)',
          warn: 'rgb(var(--terminal-warn) / <alpha-value>)',
          safe: 'rgb(var(--terminal-safe) / <alpha-value>)',
          muted: 'rgb(var(--terminal-muted) / <alpha-value>)',
          text: 'rgb(var(--terminal-text) / <alpha-value>)',
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
