import { ReactNode } from 'react';
import { Duration } from '../types';

export type SpinProps = {
  /**
   * The content to animate
   */
  children: ReactNode;
  /**
   * Duration of one complete rotation in milliseconds
   * @default 1000
   */
  duration?: Duration;
};
