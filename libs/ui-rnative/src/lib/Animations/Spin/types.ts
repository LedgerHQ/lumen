import { ReactNode } from 'react';

export type SpinProps = {
  /**
   * The content to animate
   */
  children: ReactNode;
  /**
   * Duration of one complete rotation in milliseconds
   * @default 1000
   */
  duration?: 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000 | 2000;
};
