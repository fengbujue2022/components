const withTM = require("next-transpile-modules")(["components"]);

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

module.exports = withTM(config);
