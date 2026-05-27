import type { ReactNode } from 'react';
import type { TimingTokens } from '../types';

export type SpinProps = {
  /**
   * The content to animate
   */
  children: ReactNode;
  /**
   * Motion token overrides for this animation.
   * Wrapper defaults are used when values are omitted.
   */
  timing?: Partial<TimingTokens>;
};
