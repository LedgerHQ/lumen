const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Get the monorepo root (two levels up from this app)
const monorepoRoot = path.resolve(__dirname, '../..');

/**
 * Metro configuration for monorepo
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // Watch all files in the monorepo (including libs)
  watchFolders: [monorepoRoot],

  resolver: {
    // Resolve node_modules from both the app and the monorepo root
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    // Enable package exports resolution for ESM packages (tailwind-merge, clsx, etc.)
    unstable_enablePackageExports: true,
    // Ensure packages are resolved from the monorepo
    disableHierarchicalLookup: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
