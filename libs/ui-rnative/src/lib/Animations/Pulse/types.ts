import { ReactNode } from 'react';
import { Duration } from '../types';

export type PulseProps = {
  /**
   * The content to animate
   */
  children: ReactNode;
  /**
   * Duration of one complete pulse in milliseconds
   * @default 2000
   */
  duration?: Duration;
  /**
   * Whether the pulse animation should play
   */
  animate?: boolean;
};
