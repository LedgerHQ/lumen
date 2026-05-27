import type { Config } from 'jest';

const transformIncludePatterns = [
  '@react-native/polyfills',
  'react-native-svg',
  'react-native-reanimated',
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@sbaiahmed1/react-native-blur',
  'expo-haptics',
  'expo-modules-core',
];

export default {
  displayName: '@ledgerhq/lumen-ui-rnative',
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
