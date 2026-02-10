import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { createElement } from 'react';
import { IconProps } from './types';

const iconVariants = cva('inline-block', {
  variants: {
    size: {
      12: 'icon-w-12 icon-h-12 icon-stroke-12',
      16: 'icon-w-16 icon-h-16 icon-stroke-16',
      20: 'icon-w-20 icon-h-20 icon-stroke-20',
      32: 'icon-w-32 icon-h-32 icon-stroke-32',
      24: 'icon-w-24 icon-h-24 icon-stroke-24',
      40: 'icon-w-40 icon-h-40 icon-stroke-40',
      48: 'icon-w-48 icon-h-48 icon-stroke-48',
      56: 'icon-w-56 icon-h-56 icon-stroke-56',
    },
  },
  defaultVariants: {
    size: 24,
  },
});

export const Icon = ({
  ref,
  size = 24,
  className = '',
  children,
  viewBox,
  xmlns,
  ...props
}: IconProps & {
  ref?: React.Ref<SVGSVGElement>;
}) => {
  return createElement(
    'svg',
    {
      ref,
      fill: 'none',
      'aria-hidden': 'true',
      xmlns,
      viewBox,
      className: cn(className, iconVariants({ size }), 'inline-block'),
      ...props,
    },
    children,
  );
};

Icon.displayName = 'Icon';
