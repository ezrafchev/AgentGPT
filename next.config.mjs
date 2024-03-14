// @ts-check

/**
 * Check if the `SKIP_ENV_VALIDATION` environment variable is set to true
 * before importing the server env file. This is useful for skipping env
 * validation during Docker builds.
 */
const skipEnvValidation = process.env.SKIP_ENV_VALIDATION === "true";
if (!skipEnvValidation) {
  require("./src/env/server");
}

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config, options) => {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
};

module.exports = config;
