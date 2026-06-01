import { DEFAULT_AXIS_WIDTH } from './YAxis';

import type { XAxisProps } from './XAxis';
import type { YAxisProps } from './YAxis';

export const defaultXAxisProps: XAxisProps = {
  position: 'bottom',
  showGrid: false,
  showLine: false,
  showTickMark: false,
  scaleType: 'linear',
  nice: false,
};

export const defaultYAxisProps: YAxisProps = {
  position: 'start',
  showGrid: false,
  showLine: false,
  showTickMark: false,
  scaleType: 'linear',
  nice: true,
  width: DEFAULT_AXIS_WIDTH,
};
