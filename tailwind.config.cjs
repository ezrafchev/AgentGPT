/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Include any additional directories that contain your HTML templates or other files that use Tailwind classes
    './public/index.html',
  ],
  theme: {
    screens: {
      // Use the default Tailwind screen sizes, with the addition of custom min-height screens
      xs: '300px',
      ...defaultTheme.screens,
      smH: { 'raw': '(min-height: 700px)' },
      mdH: { 'raw': '(min-height: 800px)' },
      lgH: { 'raw': '(min-height: 1000px)' },
    },
    extend: {
      boxShadow: {
        '3xl': '0 40px 70px -15px rgba(0, 0, 0, 0.40)',
        // Add any additional custom shadows or other styles here
      },
    },
  },
  plugins: [],
};
