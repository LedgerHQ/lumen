import type { ComponentType } from 'react';
import type { BaseTagSharedProps } from '../../internal/BaseTag';
import type { IconProps } from '../../symbols/Icon';

export type TagProps = BaseTagSharedProps & {
  /**
   * The icon of the tag.
   */
  icon?: ComponentType<IconProps>;
};
