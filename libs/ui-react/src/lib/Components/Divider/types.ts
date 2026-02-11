import { type HTMLAttributes, type Ref } from 'react';

export type DividerProps = {
  /**
   * The orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Ref to the divider element.
   */
  ref?: Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;
