import { useMemo } from 'react';
import { Easing } from 'react-native-reanimated';
import { useTheme } from '../../styles';
import { TimingConfig, TimingTokens } from './types';

export const useTimingConfig = ({
  duration,
  easing,
}: TimingTokens): TimingConfig => {
  const { theme } = useTheme();

  return useMemo(
    () => ({
      duration: theme.motion.durations[duration],
      easing: Easing.bezier(...theme.motion.easings[easing]),
    }),
    [theme.motion.durations, duration, theme.motion.easings, easing],
  );
};
