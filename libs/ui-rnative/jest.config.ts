import type { Config } from 'jest';

const transformIncludePatterns = [
  '@react-native/polyfills',
  '@react-native/js-polyfills',
  'react-native-svg',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@sbaiahmed1/react-native-blur',
  'expo-haptics',
  'expo-modules-core',
  // d3-scale and d3-shape are pure ESM and must be transformed for Jest
  'd3-.*',
  'internmap',
];

// The rn-081-compat CI job also runs this suite on RN 0.81, where the preset
// still ships inside react-native (it moved to its own package in 0.85).
// Drop the fallback with that job once Ledger Wallet Mobile is on RN 0.86.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version: reactNativeVersion } = require('react-native/package.json');
const reactNativeMinor = Number(reactNativeVersion.split('.')[1]);

export default {
  displayName: '@ledgerhq/lumen-ui-rnative',
  preset: reactNativeMinor >= 85 ? '@react-native/jest-preset' : 'react-native',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    `node_modules/(?!(.pnpm|${transformIncludePatterns.join('|')})/)`,
  ],
  moduleNameMapper: {
    '@ledgerhq/lumen-utils-shared':
      '<rootDir>/../../libs/utils-shared/src/index.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageDirectory: 'test-output/jest/coverage',
  coverageReporters: ['lcov'],
} as Config;
