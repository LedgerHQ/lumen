import { ReactNode } from 'react';

export type SpinProps = {
  /** The content to animate */
  children: ReactNode;
  /** Duration of one complete rotation in milliseconds */
  duration?: number;
};
