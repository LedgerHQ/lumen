import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../styles';

export type DotIndicatorProps = {
  /**
   * The size of the dot indicator.
   * @default sm
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * The appearance of the dot indicator.
   * @default base
   */
  appearance?: 'base' | 'red';
  /**
   * Whether the dot indicator should show a disabled appearance.
   * @default false
   */
  disabled?: boolean;
  /**
   * Can be used as a wrapper to any component in case you wish to overlay a dot indicator on top of it.
   * If provided, it'll pin the dot indicator to the top-right of the child component passed.
   */
  children?: ReactNode;
} & Omit<StyledViewProps, 'children'>;
