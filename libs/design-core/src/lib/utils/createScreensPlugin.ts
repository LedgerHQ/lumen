import plugin from 'tailwindcss/plugin.js';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createScreensPlugin(): TailwindPlugin {
  return plugin(
    function () {
      return;
    },
    {
      theme: {
        screens: {
          xs: '360px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  );
}
