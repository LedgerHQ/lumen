import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import type { StorybookConfig } from '@storybook/react-native-web-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../src/lib/**/*.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // '../../ui-rnative-visualization/src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    './docs/**/*.@(mdx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('storybook-dark-mode'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-native-web-vite'),
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
      '@sbaiahmed1/react-native-blur': fileURLToPath(
        new URL('./mocks/blur.tsx', import.meta.url),
      ),
      '@ledgerhq/lumen-ui-rnative': fileURLToPath(
        new URL('../src/index.ts', import.meta.url),
      ),
    };

    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      '@ledgerhq/lumen-ui-rnative',
    ];

    return mergeConfig(config, {
      plugins: [nxViteTsPaths()],
    });
  },

  core: {
    disableTelemetry: true,
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
