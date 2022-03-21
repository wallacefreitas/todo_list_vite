module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-l': { 
          'raw': '(max-width: 988px) and (orientation:landscape)' 
        },
      },
    },
  },
  plugins: [],
}
