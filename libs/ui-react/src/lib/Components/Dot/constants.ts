import type { DotIndicatorProps } from '../DotIndicator';

// larger avatars (`lg`, `xl`) don't render a dot indicator
export const avatarDotConfigMap = {
  sm: { size: 'lg', appearance: 'red' },
  md: { size: 'xl', appearance: 'red' },
} as const satisfies Record<'sm' | 'md', DotIndicatorProps>;
