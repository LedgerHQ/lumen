import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { extendTailwindMerge, validators } from 'tailwind-merge';

const withSemiBold = (steps: number[]): string[] =>
  steps.flatMap((step) => [`${step}`, `${step}-semi-bold`]);

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

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
      typography: [
        {
          'responsive-display': range(1, 4).map(String),
          heading: withSemiBold(range(0, 5)),
          body: withSemiBold(range(1, 4)),
        },
      ],
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
