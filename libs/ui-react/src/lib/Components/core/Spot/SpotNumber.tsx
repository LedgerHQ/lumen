import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { contentVariants, numberVariants, spotVariants } from './styles';
import type { SpotNumberProps } from './types';

/**
 * A circular digit. Uses the same palette, fill, and size as `Spot`.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-spot--docs Storybook}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the circle's core appearance (colors, size, etc). Use the `appearance` and `fill` props instead.
 *
 * @example
 * import { SpotNumber } from '@ledgerhq/lumen-ui-react';
 *
 * <SpotNumber value={9} />
 */
export const SpotNumber = ({
  appearance = 'base',
  fill = 'transparent',
  value,
  disabled: disabledProp = false,
  size = 48,
  className,
  ref,
  ...rest
}: SpotNumberProps) => {
  const disabled = useDisabledContext({
    consumerName: 'SpotNumber',
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
      <span
        className={cn(
          numberVariants({ size }),
          contentVariants({ appearance, fill, disabled }),
        )}
      >
        {value}
      </span>
    </div>
  );
};
