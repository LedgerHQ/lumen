import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { IconSize } from '../../symbols/Icon';
import type { SpotProps, SpotSize } from './types';

const iconSizeMap: Record<SpotSize, IconSize> = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  72: 40,
};

const spotVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full',
  {
    variants: {
      fill: {
        transparent: 'bg-muted-transparent',
        plain: '',
      },
      appearance: {
        base: '',
        success: '',
        error: '',
        warning: '',
        muted: '',
        'decorative-blue': '',
        'decorative-pink': '',
        'decorative-purple': '',
        'decorative-green': '',
        'decorative-turquoise': '',
        'decorative-yellow': '',
        'decorative-orange': '',
        'decorative-red': '',
      },
      size: {
        32: 'spot-h-32 spot-w-32',
        40: 'spot-h-40 spot-w-40',
        48: 'spot-h-48 spot-w-48',
        56: 'spot-h-56 spot-w-56',
        72: 'spot-h-72 spot-w-72',
      },
    },
    compoundVariants: [
      { fill: 'plain', appearance: 'base', class: 'bg-muted' },
      { fill: 'plain', appearance: 'success', class: 'bg-success' },
      { fill: 'plain', appearance: 'error', class: 'bg-error' },
      { fill: 'plain', appearance: 'warning', class: 'bg-warning' },
      { fill: 'plain', appearance: 'muted', class: 'bg-muted-pressed' },
      {
        fill: 'plain',
        appearance: 'decorative-blue',
        class: 'bg-decorative-blue',
      },
      {
        fill: 'plain',
        appearance: 'decorative-pink',
        class: 'bg-decorative-pink',
      },
      {
        fill: 'plain',
        appearance: 'decorative-purple',
        class: 'bg-decorative-purple',
      },
      {
        fill: 'plain',
        appearance: 'decorative-green',
        class: 'bg-decorative-green',
      },
      {
        fill: 'plain',
        appearance: 'decorative-turquoise',
        class: 'bg-decorative-turquoise',
      },
      {
        fill: 'plain',
        appearance: 'decorative-yellow',
        class: 'bg-decorative-yellow',
      },
      {
        fill: 'plain',
        appearance: 'decorative-orange',
        class: 'bg-decorative-orange',
      },
      {
        fill: 'plain',
        appearance: 'decorative-red',
        class: 'bg-decorative-red',
      },
    ],
  },
);

const iconVariants = cva('', {
  variants: {
    fill: {
      transparent: '',
      plain: '',
    },
    appearance: {
      base: '',
      success: '',
      error: '',
      warning: '',
      muted: '',
      'decorative-blue': '',
      'decorative-pink': '',
      'decorative-purple': '',
      'decorative-green': '',
      'decorative-turquoise': '',
      'decorative-yellow': '',
      'decorative-orange': '',
      'decorative-red': '',
    },
    disabled: {
      true: 'text-disabled',
      false: '',
    },
  },
  compoundVariants: [
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'base',
      class: 'text-base',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'success',
      class: 'text-success',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'error',
      class: 'text-error',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'warning',
      class: 'text-warning',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'muted',
      class: 'text-muted',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-blue',
      class: 'text-decorative-blue',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-pink',
      class: 'text-decorative-pink',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-purple',
      class: 'text-decorative-purple',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-green',
      class: 'text-decorative-green',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-turquoise',
      class: 'text-decorative-turquoise',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-yellow',
      class: 'text-decorative-yellow',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-orange',
      class: 'text-decorative-orange',
    },
    {
      disabled: false,
      fill: 'transparent',
      appearance: 'decorative-red',
      class: 'text-decorative-red',
    },
    { disabled: false, fill: 'plain', appearance: 'base', class: 'text-base' },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'success',
      class: 'text-success-strong',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'error',
      class: 'text-error-strong',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'warning',
      class: 'text-warning-strong',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'muted',
      class: 'text-muted',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-blue',
      class: 'text-decorative-strong-blue',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-pink',
      class: 'text-decorative-strong-pink',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-purple',
      class: 'text-decorative-strong-purple',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-green',
      class: 'text-decorative-strong-green',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-turquoise',
      class: 'text-decorative-strong-turquoise',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-yellow',
      class: 'text-decorative-strong-yellow',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-orange',
      class: 'text-decorative-strong-orange',
    },
    {
      disabled: false,
      fill: 'plain',
      appearance: 'decorative-red',
      class: 'text-decorative-strong-red',
    },
  ],
});

/**
 * A circular icon container. `appearance` selects the color palette and `fill` selects whether that palette paints only the icon or the circle as well.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-spot--docs Storybook}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the spot's core appearance (colors, size, etc). Use the `appearance` and `fill` props instead.
 *
 * @example
 * import { Spot } from '@ledgerhq/lumen-ui-react';
 * import { Settings, CheckmarkCircleFill } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Spot icon={Settings} />
 * <Spot appearance="success" icon={CheckmarkCircleFill} />
 * <Spot appearance="success" fill="plain" icon={Settings} />
 */
export const Spot = ({
  appearance = 'base',
  fill = 'transparent',
  icon: Icon,
  disabled: disabledProp = false,
  size = 48,
  className,
  ref,
  ...rest
}: SpotProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Spot',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <div
      ref={ref}
      className={cn(
        spotVariants({
          appearance,
          fill,
          size,
        }),
        className,
      )}
      {...rest}
    >
      <Icon
        size={iconSizeMap[size]}
        className={iconVariants({ appearance, fill, disabled })}
      />
    </div>
  );
};
