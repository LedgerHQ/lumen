import type plugin from 'tailwindcss/plugin.js';

const SPINNER_VIEWBOX_SIZE = 16;

export const createSpinnerUtilities = (
  theme: Parameters<Parameters<typeof plugin>[0]>[0]['theme'],
): Record<string, Record<string, string>> => {
  const newUtilities: Record<string, Record<string, string>> = {};
  const spinnerStrokeWidths = theme('spinnerStrokeWidth');

  for (const key in spinnerStrokeWidths) {
    if (Object.hasOwnProperty.call(spinnerStrokeWidths, key)) {
      const value = spinnerStrokeWidths[key];
      // The stroke is in viewBox units, so the renderer scales it by
      // size / 16. Divide that out so the painted weight equals the token.
      const renderScale = Number(key) / SPINNER_VIEWBOX_SIZE;
      newUtilities[`.spinner-stroke-${key}`] = {
        strokeWidth: `calc(${value} / ${renderScale})`,
      };
    }
  }

  return newUtilities;
};
