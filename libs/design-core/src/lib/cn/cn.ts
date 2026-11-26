import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { extendTailwindMerge, validators } from 'tailwind-merge';
import { typographyClassSteps } from '../generated/cn/typography.js';

const isGradientColorToken = (value: string): boolean =>
  /^(overlay-)?\d+$/.test(value);

const twMerge = extendTailwindMerge<'typography'>({
  override: {
    classGroups: {
      'font-size': [
        {
          text: [
            validators.isTshirtSize,
            validators.isArbitraryVariableLength,
            validators.isArbitraryLength,
          ],
        },
      ],
    },
  },
  extend: {
    theme: {
      radius: ['xxs'],
    },
    classGroups: {
      typography: [typographyClassSteps],
      'bg-image': [
        {
          bg: [{ gradient: [(value: string) => !isGradientColorToken(value)] }],
        },
      ],
    },
    conflictingClassGroups: {
      typography: [
        'font-size',
        'font-weight',
        'font-family',
        'leading',
        'tracking',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
