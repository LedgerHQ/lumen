import type { ComponentPropsWithRef } from 'react';

export type DividerProps = {
  /**
   * The orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
} & ComponentPropsWithRef<'div'>;
