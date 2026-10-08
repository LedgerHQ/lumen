import plugin from 'tailwindcss/plugin.js';
import { breakpoints } from '../responsive/breakpoints';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createScreensPlugin(): TailwindPlugin {
  return plugin(
    function () {
      return;
    },
    {
      theme: {
        screens: Object.fromEntries(
          Object.entries(breakpoints).map(([name, px]) => [name, `${px}px`]),
        ),
      },
    },
  );
}
