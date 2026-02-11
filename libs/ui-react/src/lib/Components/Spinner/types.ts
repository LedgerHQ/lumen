import React from 'react';
import { IconSize } from '../Icon/types';

export type SpinnerProps = {
  /**
   * The size of the spinner icon in pixels.
   * @default 16
   */
  size?: IconSize;
} & React.ComponentPropsWithRef<'svg'>;
