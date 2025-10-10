const path = require('path');
const escape = require('escape-string-regexp');
const pak = require('../package.json');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');
const modules = Object.keys(pak.peerDependencies);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

const blockList = modules.map(
  (m) => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
);

module.exports = mergeConfig(defaultConfig, {
  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    blockList: blockList,
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
});
