/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/**/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/vue-tailwind-datepicker/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      width: {
        266: '266px',
        320: '320px'
      },
      height: {
        'screen-80': '80vh'
      },
      colors: {
        background: '#F7F7FA',
        forinput: '#F7F7FA',
        green: {
          50: '#e8f3ee',
          100: '#b8daca',
          200: '#95c8b0',
          300: '#65af8c',
          400: '#479f76',
          500: '#198754',
          600: '#177b4c',
          700: '#12603c',
          800: '#0e4a2e',
          900: '#0b3923'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('@headlessui/tailwindcss'),
    require('@headlessui/tailwindcss')({ prefix: 'ui' })
  ]
}
