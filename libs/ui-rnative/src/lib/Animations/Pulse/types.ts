import { ReactNode } from 'react';
import { TimingTokens } from '../types';

export type PulseProps = {
  /**
   * The content to animate
   */
  children: ReactNode;
  /**
   * Motion token overrides for this animation.
   * Wrapper defaults are used when values are omitted.
   */
  timing?: TimingTokens;
  /**
   * Whether the pulse animation should play
   */
  animate?: boolean;
};
