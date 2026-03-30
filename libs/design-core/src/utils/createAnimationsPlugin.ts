import plugin from 'tailwindcss/plugin.js';

type TailwindPlugin = ReturnType<typeof plugin>;

export function createAnimationsPlugin(): TailwindPlugin {
  return plugin(
    () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    {
      theme: {
        extend: {
          keyframes: {
            'content-show': {
              from: {
                opacity: '0',
                scale: '0.96',
              },
              to: {
                opacity: '1',
                scale: '1',
              },
            },
            'content-hide': {
              from: {
                opacity: '1',
                scale: '1',
              },
              to: {
                opacity: '0',
                scale: '0.96',
              },
            },
            'fade-in': {
              from: { opacity: '0' },
              to: { opacity: '1' },
            },
            'fade-out': {
              from: { opacity: '1' },
              to: { opacity: '0' },
            },
            'slide-in-from-top': {
              from: {
                transform: 'translateY(calc(var(--spacing-10) * -1))',
                opacity: '0',
              },
              to: { transform: 'translateY(0px)', opacity: '1' },
            },
            'slide-in-from-bottom': {
              from: {
                transform: 'translateY(var(--spacing-10))',
                opacity: '0',
              },
              to: { transform: 'translateY(0px)', opacity: '1' },
            },
            'slide-in-from-left': {
              from: {
                transform: 'translateX(calc(var(--spacing-10) * -1))',
                opacity: '0',
              },
              to: { transform: 'translateX(0px)', opacity: '1' },
            },
            'slide-in-from-right': {
              from: {
                transform: 'translateX(var(--spacing-10))',
                opacity: '0',
              },
              to: { transform: 'translateX(0px)', opacity: '1' },
            },

            'slide-out-to-top': {
              from: { transform: 'translateY(0px)', opacity: '1' },
              to: {
                transform: 'translateY(calc(var(--spacing-10) * -1))',
                opacity: '0',
              },
            },
            'slide-out-to-bottom': {
              from: { transform: 'translateY(0px)', opacity: '1' },
              to: { transform: 'translateY(var(--spacing-10))', opacity: '0' },
            },
            'slide-out-to-left': {
              from: { transform: 'translateX(0px)', opacity: '1' },
              to: {
                transform: 'translateX(calc(var(--spacing-10) * -1))',
                opacity: '0',
              },
            },
            'slide-out-to-right': {
              from: { transform: 'translateX(0px)', opacity: '1' },
              to: { transform: 'translateX(var(--spacing-10))', opacity: '0' },
            },
            'translate-from-right': {
              from: {
                transform: 'translateX(4px)',
              },
              to: {
                transform: 'translateX(0px)',
              },
            },
          },
          animation: {
            'content-show': 'content-show 300ms ease-in',
            'content-hide': 'content-hide 300ms ease-out',
            'fade-in': 'fade-in 300ms ease-in',
            'fade-out': 'fade-out 300ms ease-out',

            'slide-in-from-top': 'slide-in-from-top 200ms ease-in',
            'slide-in-from-bottom': 'slide-in-from-bottom 200ms ease-in',
            'slide-in-from-left': 'slide-in-from-left 200ms ease-in',
            'slide-in-from-right': 'slide-in-from-right 200ms ease-in',
            'slide-out-to-top': 'slide-out-to-top 200ms ease-out',
            'slide-out-to-bottom': 'slide-out-to-bottom 200ms ease-out',
            'slide-out-to-left': 'slide-out-to-left 200ms ease-out',
            'slide-out-to-right': 'slide-out-to-right 200ms ease-out',

            'translate-from-right':
              'translate-from-right 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
  );
}
