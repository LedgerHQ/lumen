import type { ComponentType } from 'react';
import type { StyledViewProps } from '../../../styles';
import type { IconProps } from '../Icon';

export type TagProps = {
  /**
   * The appearance of the tag.
   */
  appearance?: 'base' | 'gray' | 'accent' | 'success' | 'error' | 'warning';
  /**
   * The icon of the tag.
   */
  icon?: ComponentType<IconProps>;
  /**
   * The label of the tag.
   */
  label: string;
  /**
   * The size of the tag.
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * When `true`, prevents the user from interacting with the tag.
   *
   * @default false
   */
  disabled?: boolean;
} & StyledViewProps;
