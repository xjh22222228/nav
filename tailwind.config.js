/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./data/**/*.{js,ts,tsx,json}', './src/**/*.{js,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}
