import type { Config } from 'jest';

const transformIncludePatterns = [
  '@react-native/polyfills',
  '@react-native/js-polyfills',
  'react-native-svg',
  '(jest-)?react-native',
  '@react-native(-community)?',
];

export default {
  displayName: '@ledgerhq/lumen-ui-rnative-visualization',
  preset: 'react-native',
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
