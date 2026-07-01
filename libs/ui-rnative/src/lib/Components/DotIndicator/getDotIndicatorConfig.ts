import { createGetDotConfig } from '../Dot';
import type { DotIndicatorProps } from './types';

export const getDotIndicatorConfig = createGetDotConfig({
  // larger avatars (`lg`, `xl`) don't render a dot indicator
  avatar: {
    sm: { size: 'lg', appearance: 'red' },
    md: { size: 'xl', appearance: 'red' },
  } satisfies Record<'sm' | 'md', DotIndicatorProps>,
});
