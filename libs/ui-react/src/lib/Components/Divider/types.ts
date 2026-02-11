import { type HTMLAttributes, type Ref } from 'react';

export type DividerProps = {
  /**
   * The orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  ref?: Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;
