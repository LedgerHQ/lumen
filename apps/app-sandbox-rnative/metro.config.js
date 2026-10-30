const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const monorepoRoot = path.resolve(__dirname, '../..');
const appNodeModules = path.resolve(__dirname, 'node_modules');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const defaultWatchFolders = config.watchFolders ?? [];
config.watchFolders = [...new Set([...defaultWatchFolders, monorepoRoot])];

config.resolver.nodeModulesPaths = [
  appNodeModules,
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
