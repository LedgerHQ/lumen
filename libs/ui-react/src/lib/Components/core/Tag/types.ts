import type { ComponentType } from 'react';
import type { BaseTagSharedProps } from '../../internal/BaseTag';
import type { IconSize } from '../../symbols/Icon';

export type TagProps = BaseTagSharedProps & {
  /**
   * Icon component to render.
   */
  icon?: ComponentType<{ size?: IconSize; className?: string }>;
};
