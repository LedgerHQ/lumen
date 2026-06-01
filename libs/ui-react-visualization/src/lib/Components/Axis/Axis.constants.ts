import type { XAxisProps } from './XAxis';
import type { YAxisProps } from './YAxis';

export const DEFAULT_AXIS_HEIGHT = 28;
export const DEFAULT_AXIS_WIDTH = 40;
export const TICK_MARK_SIZE = 4;
export const TICK_LABEL_OFFSET = 6;

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
