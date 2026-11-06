import plugin from 'tailwindcss/plugin.js';
import { breakpoints } from '../responsive/breakpoints.js';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createScreensPlugin(): TailwindPlugin {
  const screens = Object.fromEntries(
    Object.entries(breakpoints).map(([name, px]) => [name, `${px}px`]),
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
