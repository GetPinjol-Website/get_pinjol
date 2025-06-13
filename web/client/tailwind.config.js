/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'pinjol-dark-1': '#18230F',
        'pinjol-dark-2': '#27391C',
        'pinjol-dark-3': '#255F38',
        'pinjol-dark-4': '#1F7D53',
        'pinjol-light-1': '#ECFAE5',
        'pinjol-light-2': '#DDF6D2',
        'pinjol-light-3': '#CAE8BD',
        'pinjol-light-4': '#B0DB9C',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}