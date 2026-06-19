import { BaseTag } from '../BaseTag';
import type { IconSize } from '../Icon/types';
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
 * @see {@link https://ldls.vercel.app/?path=/docs/core-tag--docs Storybook}
 *
 * @example
 * import { Tag } from '@ledgerhq/lumen-ui-react';
 *
 * // Basic tag
 * <Tag label="Label" appearance="accent" />
 *
 * // Tag with icon
 * <Tag label="Success" appearance="success" icon={Check} />
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
      leadingContent={
        IconComponent ? <IconComponent size={iconSize} /> : undefined
      }
    />
  );
};
