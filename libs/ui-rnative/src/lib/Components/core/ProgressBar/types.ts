import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../../styles';

import type { ProgressLabelPosition } from '../../internal/ProgressBase';

export type { ProgressLabelPosition };

export type ProgressAppearance =
  | 'base'
  | 'accent'
  | 'success'
  | 'error'
  | 'warning'
  | 'decorative-blue'
  | 'decorative-pink'
  | 'decorative-purple'
  | 'decorative-green'
  | 'decorative-turquoise'
  | 'decorative-yellow'
  | 'decorative-orange'
  | 'decorative-red';

export type ProgressBarProps = {
  /**
   * The current progress, from 0 to 100. Values outside the range are clamped.
   */
  value: number;
  /**
   * The color of the progress fill.
   * @default 'base'
   */
  appearance?: ProgressAppearance;
  /**
   * Renders a visible label. It is visual only: the bar is named by `accessibilityLabel`.
   */
  label?: ReactNode;
  /**
   * Where the label sits relative to the bar. Only applies with `label`.
   * @default 'start-bottom'
   */
  labelPosition?: ProgressLabelPosition;
  /**
   * Names the bar for assistive technology.
   */
  accessibilityLabel: string;
} & Omit<StyledViewProps, 'children' | 'accessibilityLabel'>;
