module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};


module.exports = {
  plugins: [
    require('tailwindcss')('./path/to/tailwind.config.js'),
    require('autoprefixer'),
  ],
};
