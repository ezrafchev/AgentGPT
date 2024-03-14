/**
 * @type {import("prettier").Config}
 * Configures Prettier to use the Tailwind CSS plugin for formatting.
 */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
