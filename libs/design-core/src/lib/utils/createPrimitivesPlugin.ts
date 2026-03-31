import plugin from 'tailwindcss/plugin.js';
import { primitivesTheme } from '../themes/css/index';
import { createIconUtilities } from './createIconUtilities.js';
import { createSpotUtilities } from './createSpotUtilities.js';
import { getThemeUtilsByPrefix } from './getThemeUtilsByPrefix.js';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createPrimitivesPlugin(): TailwindPlugin {
  const spacing = getThemeUtilsByPrefix(primitivesTheme, '--spacing-');
  const size = getThemeUtilsByPrefix(primitivesTheme, '--size-');
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
    'dialog-overlay': '90',
    'dialog-content': '100',
    select: '120',
    menu: '120',
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
        extend: {
          zIndex,
          height: size,
          width: size,
          size,
          maxHeight: size,
          maxWidth: size,
          minHeight: size,
          minWidth: size,
        },
      },
    },
  );
}
