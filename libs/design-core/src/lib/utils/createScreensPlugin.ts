import plugin from 'tailwindcss/plugin.js';
import { primitiveLayoutTokens } from '../themes/js/primitives/primitives.others';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createScreensPlugin(): TailwindPlugin {
  const screens = Object.fromEntries(
    Object.entries(primitiveLayoutTokens.breakpoints).map(([name, px]) => [
      name,
      `${px}px`,
    ]),
  );

  return plugin(
    function () {
      return;
    },
    {
      theme: {
        extend: { screens },
      },
    },
  );
}
