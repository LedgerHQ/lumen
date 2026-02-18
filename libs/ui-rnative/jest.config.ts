import type { Config } from 'jest';

const transformIncludePatterns = [
  '@react-native/polyfills',
  'react-native-svg',
  'react-native-reanimated',
  '(jest-)?react-native',
  '@react-native(-community)?',
  '@sbaiahmed1/react-native-blur',
];

export default {
  displayName: '@ledgerhq/lumen-ui-rnative',
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    `node_modules/(?!(.pnpm|${transformIncludePatterns.join('|')})/)`,
  ],
  moduleNameMapper: {
    '@ledgerhq/lumen-utils-shared':
      '<rootDir>/../../libs/utils-shared/src/index.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: 'test-output/jest/coverage',
} as Config;
