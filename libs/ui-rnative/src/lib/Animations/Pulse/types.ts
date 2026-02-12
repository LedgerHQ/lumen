import { ReactNode } from 'react';

export type PulseProps = {
  /** The content to animate */
  children: ReactNode;
  /** Duration of one complete rotation in milliseconds */
  duration?: number;
  /** Whether the pulse animation should play */
  animate?: boolean;
};
