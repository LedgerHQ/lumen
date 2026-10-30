import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ProgressLabelPosition =
  | 'start-top'
  | 'start-bottom'
  | 'end-top'
  | 'end-bottom';

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
   * Where the label sits relative to the bar. Only applies with `label`.
   * @default 'start-bottom'
   */
  labelPosition?: ProgressLabelPosition;
  /**
   * Renders a visible label. It is visual only: the bar is named by `aria-label`.
   */
  label?: ReactNode;
  /**
   * Names the bar for assistive technology.
   */
  'aria-label': string;
} & Omit<ComponentPropsWithRef<'div'>, 'children' | 'aria-label'>;
