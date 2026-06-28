/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc7c7',
          300: '#ffa3a3',
          400: '#ff6e6e',
          500: '#f84545',
          600: '#e52e2e',
          700: '#c12020',
          800: '#a01e1e',
          900: '#841f1f',
        },
      },
    },
  },
  plugins: [],
}
