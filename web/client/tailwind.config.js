/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': {
          900: '#18230F', // rgb(24, 35, 15)
          800: '#27391C', // rgb(39, 57, 28)
        },
        green: {
          700: '#255F38', // rgb(37, 95, 56)
          600: '#1F7D53', // rgb(31, 125, 83)
        },
        cream: {
          100: '#FFFDF6', // rgb(255, 253, 246)
          200: '#FAF6E9', // rgb(250, 246, 233)
        },
        'light-green': {
          300: '#DDEB9D', // rgb(221, 235, 157)
          400: '#A0C878', // rgb(160, 200, 120)
        },
      },
    },
  },
  plugins: [],
}