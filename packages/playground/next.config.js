const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['@components/core']);

/**
 * @type {import('next').NextConfig}
 */
const config = {
  images: {
    domains: ['images.unsplash.com'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = withPlugins([withTM], config);
