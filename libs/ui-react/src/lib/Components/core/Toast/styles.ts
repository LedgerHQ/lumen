import { cva } from 'class-variance-authority';
import type { ToastPosition } from './types';

export const toastVariants = cva(
  'flex min-h-56 w-full items-start gap-8 rounded-md bg-interactive py-8 pr-10 text-on-interactive',
  {
    variants: {
      hasLeading: {
        true: 'pl-12',
        false: 'pl-16',
      },
    },
  },
);

export const positionVariants = cva(
  'pointer-events-none fixed inset-x-24 z-toast flex',
  {
    variants: {
      position: {
        'top-left': 'top-24 flex-col items-start',
        'top-center': 'top-24 flex-col items-center',
        'top-right': 'top-24 flex-col items-end',
        'bottom-left': 'bottom-24 flex-col-reverse items-start',
        'bottom-center': 'bottom-24 flex-col-reverse items-center',
        'bottom-right': 'bottom-24 flex-col-reverse items-end',
      } satisfies Record<ToastPosition, string>,
    },
  },
);

export const collapseVariants = cva(
  'pointer-events-auto flex w-full max-w-md flex-col transition-[height] duration-300 ease-out',
  {
    variants: {
      edge: {
        top: 'justify-start',
        bottom: 'justify-end',
      },
      exiting: {
        true: 'z-0',
        false: 'z-10',
      },
    },
  },
);

export const slideEnterVariants = cva('', {
  variants: {
    position: {
      'top-left': 'animate-slide-in-from-left',
      'top-center': 'animate-slide-in-from-top',
      'top-right': 'animate-slide-in-from-right',
      'bottom-left': 'animate-slide-in-from-left',
      'bottom-center': 'animate-slide-in-from-bottom',
      'bottom-right': 'animate-slide-in-from-right',
    },
  },
});

export const queuedEnterVariants = cva('', {
  variants: {
    edge: {
      top: 'animate-slide-in-from-bottom',
      bottom: 'animate-slide-in-from-top',
    },
  },
});

export const slideExitVariants = cva('', {
  variants: {
    position: {
      'top-left': 'animate-slide-out-to-left',
      'top-center': 'animate-slide-out-to-top',
      'top-right': 'animate-slide-out-to-right',
      'bottom-left': 'animate-slide-out-to-left',
      'bottom-center': 'animate-slide-out-to-bottom',
      'bottom-right': 'animate-slide-out-to-right',
    } satisfies Record<ToastPosition, string>,
  },
});
