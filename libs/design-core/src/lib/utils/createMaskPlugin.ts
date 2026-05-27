import plugin from 'tailwindcss/plugin.js';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createMaskPlugin(): TailwindPlugin {
  return plugin(function ({ addUtilities }) {
    const maskFade = {
      '.mask-fade-y': {
        '-webkit-mask-image':
          'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        'mask-image':
          'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
      },
      '.mask-fade-x': {
        '-webkit-mask-image':
          'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        'mask-image':
          'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
      },
      '.mask-fade-none': {
        '-webkit-mask-image': 'none',
        'mask-image': 'none',
      },
    };

    addUtilities(maskFade);
  });
}
