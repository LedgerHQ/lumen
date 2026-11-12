import type { IconModel } from '@lumen/design-sources';
import type { Target } from '../core/target.js';

/**
 * The SVGs published as `@ledgerhq/lumen-design-core/symbols/*`, byte for byte
 * as Figma exported them, with the export manifest the package always shipped.
 */
export const svgTarget = (outDir: string): Target<IconModel> => ({
  name: 'svg-symbols',
  outDir,
  format: false,
  emit: ({ icons, manifest }) => [
    ...icons.map(({ name, svg }) => ({ path: `${name}.svg`, contents: svg })),
    { path: 'downloadData.json', contents: JSON.stringify(manifest) },
  ],
});
