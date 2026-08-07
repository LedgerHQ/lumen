import type { BoxProps } from '../../primitives';

export type DividerProps = {
  /**
   * The orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
} & Omit<BoxProps, 'children'>;
