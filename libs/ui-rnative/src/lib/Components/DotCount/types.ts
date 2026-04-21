import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../styles';

export type DotCountProps = {
  /**
   * The size of the dot count.
   * @default md
   */
  size?: 'md' | 'sm';
  /**
   * The amount to be displayed.
   *
   * If higher than `max`, the displayed value will be "[max]+".
   */
  value: number;
  /**
   * The max value shown.
   *
   * If `value` is higher than `max`, the displayed value will be "[max]+".
   *
   * By design, it will ignore values higher than 99.
   * @default 99
   */
  max?: number;
  /**
   * The appearance of the dot count.
   * @default base
   */
  appearance?: 'base' | 'red';
  /**
   * Whether the dot count should show a disabled appearance.
   * @default false
   */
  disabled?: boolean;
  /**
   * Can be used as a wrapper to any component in case you wish to overlay a dot count on top of it.
   * If provided, it'll pin the dot count to the top-right of the child component passed.
   */
  children?: ReactNode;
} & Omit<StyledViewProps, 'children'>;
