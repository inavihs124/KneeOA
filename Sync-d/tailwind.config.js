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
        theme: {
          base: 'var(--color-base)',
          surface: 'var(--color-surface)',
          'surface-hover': 'var(--color-surface-hover)',
          accent: 'var(--color-accent)',
          highlight: 'var(--color-highlight)',
          muted: 'var(--color-muted)',
        }
      }
    },
  },
  plugins: [],
}
