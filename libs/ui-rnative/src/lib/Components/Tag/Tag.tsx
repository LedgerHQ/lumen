import { BaseTag } from '../BaseTag';
import type { IconSize } from '../Icon';
import type { TagProps } from './types';

type Size = NonNullable<TagProps['size']>;

const iconSizeMap: Record<Size, IconSize> = {
  md: 16,
  sm: 12,
};

/**
 * A compact label used to categorize, classify, or highlight information with optional icon support.
 *
 * The appearance determines the color scheme used.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/core-tag--docs Storybook}
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/core-tag--docs Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the tag's core appearance (colors, padding, etc). Use the `appearance` prop instead.
 *
 * @example
 * import { Tag } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic tag
 * <Tag label="Label" appearance="accent" />
 *
 * // Tag with icon
 * <Tag
 *   label="Success"
 *   appearance="success"
 *   icon={Check}
 * />
 *
 * // Small tag
 * <Tag label="Small" size="sm" />
 */
export const Tag = ({ icon, size = 'md', ...props }: TagProps) => {
  const IconComponent = icon;
  const iconSize = iconSizeMap[size];

  return (
    <BaseTag
      {...props}
      size={size}
      variant='tag'
      consumerName='Tag'
      renderIcon={
        IconComponent
          ? (iconStyle) => <IconComponent size={iconSize} style={iconStyle} />
          : undefined
      }
    />
  );
};
