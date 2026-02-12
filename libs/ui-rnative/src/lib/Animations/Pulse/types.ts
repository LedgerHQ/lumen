import { ReactNode } from 'react';

export type PulseProps = {
  /**
   * The content to animate
   */
  children: ReactNode;
  /**
   * Duration of one complete pulse in milliseconds
   * @default 2000
   */
  duration?: 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000 | 2000;
  /**
   * Whether the pulse animation should play
   */
  animate?: boolean;
};
