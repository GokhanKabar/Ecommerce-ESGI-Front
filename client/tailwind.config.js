// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'sidebar-gray': '#F5F5F5'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
