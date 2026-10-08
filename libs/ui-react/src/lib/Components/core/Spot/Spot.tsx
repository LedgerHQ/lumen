import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import type { IconSize } from '../../symbols/Icon';
import { contentVariants, spotVariants } from './styles';
import type { SpotProps, SpotSize } from './types';

const iconSizeMap: Record<SpotSize, IconSize> = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  72: 40,
};

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
  const contentClassName = contentVariants({ appearance, fill, disabled });

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
      <Icon size={iconSizeMap[size]} className={contentClassName} />
    </div>
  );
};
