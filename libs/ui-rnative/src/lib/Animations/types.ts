import type { WithTimingConfig } from 'react-native-reanimated';
import type { LumenStyleSheetTheme } from '../../styles/types';

export type DurationToken = keyof LumenStyleSheetTheme['motion']['durations'];
export type EasingToken = keyof LumenStyleSheetTheme['motion']['easings'];

export type TimingTokens = {
  duration: DurationToken;
  easing: EasingToken;
};

export type TimingConfig = WithTimingConfig;
