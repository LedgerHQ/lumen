import storybook from 'eslint-plugin-storybook';

import baseConfig from '../../eslint.config.mjs';
import { defineProdRules } from '../../eslint.shared.mjs';
export default [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,cts,mjs,mts}'],
    plugins: {
      storybook,
    },
  },
  defineProdRules({
    rules: {
      'no-restricted-imports': [
        'error',
        {
          name: 'react-native',
          importNames: ['TouchableOpacity'],
          message: 'Prefer `Pressable` instead of `TouchableOpacity`.',
        },
        {
          name: 'react-native',
          importNames: ['Animated', 'Easing', 'LayoutAnimation'],
          message: 'Prefer react-native-reanimated for animations.',
        },
      ],
    },
  }),
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
  ...storybook.configs['flat/recommended'],
];
