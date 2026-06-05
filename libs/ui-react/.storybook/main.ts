import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../src/lib/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../ui-react-visualization/src/**/*.mdx',
    '../../ui-react-visualization/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    './docs/**/*.@(mdx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('storybook-dark-mode'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Globs are resolved from the Storybook cwd (libs/ui-react). The default
      // only covers this package, so the visualization components (a sibling
      // package surfaced via the stories globs above) never get docgen and
      // their Controls come up empty. Add their sources so props are extracted.
      include: ['**/*.tsx', '../ui-react-visualization/src/**/*.tsx'],
    },
  },

  refs: {
    'react-native': {
      title: 'React Native',
      url: 'https://ldls-react-native.vercel.app/',
    },
  },

  viteFinal: async (viteConfig) => {
    // Add react-native-web alias for React Native components
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      'react-native': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    };

    return mergeConfig(viteConfig, {
      plugins: [nxViteTsPaths()],
      css: {
        postcss: {
          plugins: [(await import('@tailwindcss/postcss')).default],
        },
      },
    });
  },

  core: {
    disableTelemetry: true,
  },
};

export default config;

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
