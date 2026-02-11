import React from 'react';

export type DividerProps = {
  /**
   * The orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
} & React.ComponentPropsWithRef<'div'>;
