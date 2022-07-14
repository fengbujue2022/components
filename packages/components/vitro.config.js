/** @type {import('@vitro/cli').VitroConfig} */
module.exports = {
  globs: ['./**/*.vitro.tsx'], // globs to search for stories files
  ignore: [], // add directories to ignore when searching for stories files
  basePath: '/', // deployment base path
  // to enable the click to source feature in prod
};
