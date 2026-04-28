import type { ReactNode } from 'react';

import type { AxisConfigProps, ChartInset, Series } from '../../utils/types';
import type { XAxisProps } from '../Axis/XAxis';
import type { YAxisProps } from '../Axis/YAxis';

export type LineChartProps = {
  /**
   * Data series to render as lines.
   * Each series produces one `<Line>` element.
   */
  series?: Series[];
  /**
   * Whether to show area fill under all lines.
   * @default false
   */
  showArea?: boolean;
  /**
   * Area fill style applied to all lines.
   * When `'gradient'`, renders a vertical gradient from the stroke color to transparent.
   * @default 'gradient'
   */
  areaType?: 'gradient';
  /**
   * Whether to render an x-axis.
   * @default false
   */
  showXAxis?: boolean;
  /**
   * Whether to render a y-axis.
   * @default false
   */
  showYAxis?: boolean;
  /**
   * Combined axis configuration and visual props for the x-axis.
   * Includes scale/domain settings as well as visual options like `showGrid` and `showLine`.
   */
  xAxis?: Partial<AxisConfigProps> & XAxisProps;
  /**
   * Combined axis configuration and visual props for the y-axis.
   * Includes scale/domain settings as well as visual options like `showGrid` and `showLine`.
   */
  yAxis?: Partial<AxisConfigProps> & YAxisProps;
  /**
   * Width of the chart.
   * A number is treated as pixels; a string (e.g. `'100%'`) fills the container.
   * @default '100%'
   */
  width?: number | string;
  /**
   * Height of the chart in pixels.
   * @default 160
   */
  height?: number;
  /**
   * Padding between the SVG edge and the drawing area.
   * A number applies uniformly; a partial object overrides individual sides.
   */
  inset?: number | Partial<ChartInset>;
  /**
   * Additional SVG content rendered inside the chart after lines and axes.
   */
  children?: ReactNode;
};
