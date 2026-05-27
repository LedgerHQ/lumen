import type { ComponentPropsWithRef } from 'react';
import type { IconSize } from '../Icon/types';

export type SpinnerProps = {
  /**
   * The size of the spinner icon in pixels.
   * @default 16
   */
  size?: IconSize;
} & ComponentPropsWithRef<'svg'>;
