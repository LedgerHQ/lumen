import { ReactNode } from 'react';
import { TimingTokens } from '../types';

export type SpinProps = {
  /**
   * The content to animate
   */
  children: ReactNode;
  /**
   * Motion token overrides for this animation.
   * Wrapper defaults are used when values are omitted.
   */
  timing?: TimingTokens;
};
