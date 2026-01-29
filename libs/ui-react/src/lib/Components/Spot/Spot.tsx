import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import {
  BluetoothCircleFill,
  CheckmarkCircleFill,
  DeleteCircleFill,
  InformationFill,
  WarningFill,
} from '../../Symbols';
import { IconSize } from '../Icon/types';
import { Spinner } from '../Spinner';
import { SpotProps, SpotSize } from './types';

const spotVariants = cva(
  'flex items-center justify-center rounded-full bg-muted-transparent',
  {
    variants: {
      appearance: {
        icon: 'text-base',
        bluetooth: 'text-[#0082FC]',
        check: 'text-success',
        error: 'text-error',
        warning: 'text-warning',
        info: 'text-muted',
        loader: '',
        number: 'heading-5 text-base',
      },
      disabled: {
        true: 'text-disabled',
      },
      size: {
        32: 'spot-w-32 spot-h-32',
        40: 'spot-w-40 spot-h-40',
        48: 'spot-w-48 spot-h-48',
        56: 'spot-w-56 spot-h-56',
        72: 'spot-w-72 spot-h-72',
      },
    },
  },
);

/**
 * A circular status indicator component that displays different types of content based on appearance.
 *
 * Uses a discriminated union type system where the required props depend on the `appearance` value:
 * - `'icon'` appearance requires an `icon` prop
 * - `'number'` appearance requires a `number` prop
 * - All other appearances are self-contained
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/media-graphics-spot--docs Storybook}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the spot's core appearance (colors, size, etc). Use the `appearance` prop instead.
 *
 * @example
 * import { Spot } from '@ledgerhq/lumen-ui-react';
 *
 * // Custom icon spot
 * import { Settings } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Spot appearance="icon" icon={Settings} />
 *
 * // Number spot
 * <Spot appearance="number" number={5} />
 *
 * // Status indicators (no additional props needed)
 * <Spot appearance="check" />
 * <Spot appearance="error" />
 * <Spot appearance="warning" />
 * <Spot appearance="loader" />
 *
 * // Bluetooth states
 * <Spot appearance="bluetooth" />
 * <Spot appearance="bluetooth" disabled />
 */
export const Spot = (props: SpotProps) => {
  const { appearance, className, disabled, size = 48, ...rest } = props;

  const sizeMap: Record<SpotSize, IconSize> = {
    32: 12,
    40: 16,
    48: 20,
    56: 24,
    72: 40,
  };

  const numberTypographyMap: Record<SpotSize, string> = {
    32: 'body-2-semi-bold',
    40: 'body-1-semi-bold',
    48: 'heading-5',
    56: 'heading-4',
    72: 'heading-2',
  };

  const calculatedIconSize = sizeMap[size] ?? 20;
  const calculatedNumberTypography = numberTypographyMap[size] ?? 'heading-5';

  const content = useMemo(() => {
    switch (props.appearance) {
      case 'icon': {
        const { icon: Icon } = props;
        return <Icon size={calculatedIconSize} />;
      }
      case 'number': {
        return (
          <span className={calculatedNumberTypography}>{props.number}</span>
        );
      }
      case 'bluetooth':
        return <BluetoothCircleFill size={calculatedIconSize} />;
      case 'check':
        return <CheckmarkCircleFill size={calculatedIconSize} />;
      case 'error':
        return <DeleteCircleFill size={calculatedIconSize} />;
      case 'warning':
        return <WarningFill size={calculatedIconSize} />;
      case 'info':
        return <InformationFill size={calculatedIconSize} />;
      case 'loader':
        return <Spinner size={calculatedIconSize} />;
    }
  }, [props, calculatedIconSize, calculatedNumberTypography]);

  return (
    <div
      className={cn(className, spotVariants({ appearance, disabled, size }))}
      {...rest}
    >
      {content}
    </div>
  );
};
