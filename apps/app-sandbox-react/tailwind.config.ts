import { ledgerLivePreset } from '@ledgerhq/lumen-design-core';
import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  // Lumen registers its own compiled components via
  // `@ledgerhq/lumen-ui-react/tailwind.css` (imported in src/global.css).
  content: ['./src/**/*.{ts,tsx,html}'],
  presets: [ledgerLivePreset],
} satisfies Config;
