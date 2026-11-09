import path from 'node:path';
import type { IconModel } from '@lumen/design-sources';
import { type Config, transform } from '@svgr/core';
import type { Target } from '../core/target.js';
import { WORKSPACE_ROOT } from '../core/writer.js';
import { toPascalCase } from '../tokens/naming.js';

const svgrConfig = (template: Config['template'], native: boolean): Config => ({
  template,
  typescript: true,
  // Figma exports black; components follow the text color.
  replaceAttrValues: {
    '#000': 'currentColor',
    '#000000': 'currentColor',
    black: 'currentColor',
  },
  svgProps: { fill: 'currentColor' },
  icon: true,
  jsxRuntime: 'automatic',
  expandProps: false,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
  native,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: { cleanupIds: false, removeViewBox: false } },
      },
      { name: 'removeAttrs', params: { attrs: 'stroke-width' } },
      ...(native ? (['removeXMLNS'] as const) : []),
    ],
  },
});

/**
 * One component per icon plus the barrel, through the lib's own svgr template
 * (`symbols/utils/icon-template.ts`). The target owns `icons/` and `index.ts`
 * only: `Icon/` and `utils/` next to them are hand-written.
 */
export const symbolComponentsTarget = ({
  name,
  outDir,
  templatePath,
  native,
}: {
  name: string;
  outDir: string;
  templatePath: string;
  native: boolean;
}): Target<IconModel> => ({
  name,
  outDir,
  owns: (file) => file === 'index.ts' || file.startsWith('icons/'),
  emit: async ({ icons }) => {
    // The template lives in the lib it renders for, so it is loaded by path.
    const module = (await import(path.join(WORKSPACE_ROOT, templatePath))) as {
      default: Config['template'];
    };
    const config = svgrConfig(module.default, native);

    const components = await Promise.all(
      icons.map(async ({ name: iconName, svg }) => {
        const componentName = toPascalCase(iconName);
        return {
          componentName,
          path: `icons/${componentName}.tsx`,
          contents: await transform(svg, config, { componentName }),
        };
      }),
    );
    components.sort((a, b) => a.componentName.localeCompare(b.componentName));

    return [
      ...components.map(({ path: file, contents }) => ({
        path: file,
        contents,
      })),
      {
        path: 'index.ts',
        contents: `${components
          .map(
            ({ componentName }) =>
              `export { ${componentName} } from './icons/${componentName}';`,
          )
          .join('\n')}\n`,
      },
    ];
  },
});
