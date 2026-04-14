import { ReactNode } from 'react';
import { StyledViewProps } from '../../../styles';

export type BadgeProps = {
  /**
   * The size of the badge.
   *
   * Note that in `xs` size, the value you provide isn't shown.
   */
  size: 'md' | 'sm' | 'xs';
  /**
   * The amount to be displayed on the badge.
   *
   * If higher than `max`, the displayed value will be "[max]+".
   */
  value: number;
  /**
   * The max value shown on the badge.
   *
   * If `value` is higher than `max`, the displayed value will be "[max]+".
   *
   * By design, it will ignore values higher than 99.
   * @default 99
   */
  max?: number;
  /**
   * The appearance of the badge.
   * @default base
   */
  appearance?: 'base' | 'red';
  /**
   * Whether the badge should show a disabled appearance.
   * @default false
   */
  disabled?: boolean;
  /**
   * Can be used as a wrapper to any component in case you wish to overlay a badge on top of it.
   * If provided, it'll pin the badge to the top-right of the child component passed.
   */
  children?: ReactNode;
} & Omit<StyledViewProps, 'children'>;
