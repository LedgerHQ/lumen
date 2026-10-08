import plugin from 'tailwindcss/plugin.js';
import { primitivesTheme } from '../themes/css/index';
import { createIconUtilities } from './createIconUtilities.js';
import { createSpotUtilities } from './createSpotUtilities.js';
import {
  getThemeUtilsByPrefix,
  getThemeValuesByPrefix,
} from './getThemeUtilsByPrefix.js';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createPrimitivesPlugin(): TailwindPlugin {
  const spacing = getThemeUtilsByPrefix(primitivesTheme, '--spacing-');
  const size = getThemeUtilsByPrefix(primitivesTheme, '--size-');
  // Only the t-shirt sizes (`md`, `3xl`…) feed `@md:` container queries, which
  // can't read `var()` and so need the literal pixels. Numeric keys would also
  // turn `columns-2` into a 2px width.
  const containerSizes = Object.fromEntries(
    Object.entries(getThemeValuesByPrefix(primitivesTheme, '--size-')).filter(
      ([key]) => !/^\d+$/.test(key),
    ),
  );
  const borderRadius = getThemeUtilsByPrefix(
    primitivesTheme,
    '--border-radius-',
  );

  const backdropBlur = getThemeUtilsByPrefix(
    primitivesTheme,
    '--backdrop-blur-',
  );
  const iconWidth = getThemeUtilsByPrefix(primitivesTheme, '--icon-width-');
  const iconHeight = getThemeUtilsByPrefix(primitivesTheme, '--icon-height-');
  const spotWidth = getThemeUtilsByPrefix(primitivesTheme, '--spot-width-');
  const spotHeight = getThemeUtilsByPrefix(primitivesTheme, '--spot-height-');
  const iconStrokeWidth = getThemeUtilsByPrefix(
    primitivesTheme,
    '--icon-border-width-',
  );

  const zIndex = {
    'table-header': '20',
    'dialog-overlay': '90',
    'dialog-content': '100',
    select: '120',
    menu: '120',
    toast: '150',
    tooltip: '200',
  };

  return plugin(
    function ({ addBase, theme, addUtilities }) {
      // TODO: Remove type cast after exporting all values as strings from Figma
      addBase(primitivesTheme as never);
      addUtilities(createIconUtilities(theme));
      addUtilities(createSpotUtilities(theme));
    },
    {
      theme: {
        spacing,
        borderRadius,
        backdropBlur,
        iconWidth,
        iconHeight,
        spotWidth,
        spotHeight,
        iconStrokeWidth,
        containers: containerSizes,
        extend: {
          zIndex,
          height: size,
          width: size,
          size,
          maxHeight: size,
          'max-width': size,
          minHeight: size,
          minWidth: size,
          flexBasis: size,
        },
      },
    },
  );
}
