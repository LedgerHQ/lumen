import plugin from 'tailwindcss/plugin.js';

export const createIconUtilities = (
  theme: Parameters<Parameters<typeof plugin>[0]>[0]['theme'],
) => {
  const newUtilities: Record<string, Record<string, string>> = {};
  const iconWidths = theme('iconWidth');
  const iconHeights = theme('iconHeight');
  const iconStrokeWidths = theme('iconStrokeWidth');

  for (const key in iconWidths) {
    if (Object.hasOwnProperty.call(iconWidths, key)) {
      const value = iconWidths[key];
      newUtilities[`.icon-w-${key}`] = { width: value };
    }
  }
  for (const key in iconHeights) {
    if (Object.hasOwnProperty.call(iconHeights, key)) {
      const value = iconHeights[key];
      newUtilities[`.icon-h-${key}`] = { height: value };
    }
  }
  for (const key in iconStrokeWidths) {
    if (Object.hasOwnProperty.call(iconStrokeWidths, key)) {
      const value = iconStrokeWidths[key];
      newUtilities[`.icon-stroke-${key}`] = { strokeWidth: value };
    }
  }

  return newUtilities;
};
