export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-green': { 900: '#18230F', 800: '#27391C' },
        green: { 700: '#255F38', 600: '#1F7D53' },
        cream: { 100: '#FFFDF6', 200: '#FAF6E9' },
        'light-green': { 300: '#DDEB9D', 400: '#A0C878' },
      },
    },
  },
  plugins: [],
};