/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0f62fe', 600: '#0b57d0' },
        accent: '#00b894',
        magenta: {
          50: '#fff0fb',
          100: '#ffe5f9',
          200: '#ffccf2',
          300: '#ff99e5',
          400: '#ff66d8',
          500: '#ff33cc',
          600: '#ff00bf',
          700: '#e600ac',
          800: '#cc0099',
          900: '#b30086',
          950: '#800060',
        },
        red: {
          50: '#fff0f0',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000',
          600: '#e60000',
          700: '#cc0000',
          800: '#990000',
          900: '#660000',
          950: '#330000',
        }
      },
      borderRadius: { xl: '1rem' }
    },
  },
  plugins: [],
}