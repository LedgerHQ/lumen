import { allBrandsPreset } from '@ledgerhq/lumen-design-core';
import type { Config } from 'tailwindcss';

const config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '.storybook/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.stories.{js,jsx,ts,tsx}',
  ],
  presets: [allBrandsPreset],
} satisfies Config;

export default config;
