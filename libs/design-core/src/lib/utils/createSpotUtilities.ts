import plugin from 'tailwindcss/plugin.js';

export const createSpotUtilities = (
  theme: Parameters<Parameters<typeof plugin>[0]>[0]['theme'],
) => {
  const newUtilities: Record<string, Record<string, string>> = {};
  const spotWidths = theme('spotWidth');
  const spotHeights = theme('spotHeight');

  for (const key in spotWidths) {
    if (Object.hasOwnProperty.call(spotWidths, key)) {
      const value = spotWidths[key];
      newUtilities[`.spot-w-${key}`] = { width: value };
    }
  }
  for (const key in spotHeights) {
    if (Object.hasOwnProperty.call(spotHeights, key)) {
      const value = spotHeights[key];
      newUtilities[`.spot-h-${key}`] = { height: value };
    }
  }

  return newUtilities;
};
