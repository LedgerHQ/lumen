import type { ComponentPropsWithRef, ReactNode } from 'react';

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

type ProgressBarName =
  | {
      /**
       * A visible label that also names the bar for assistive technology.
       */
      label: NonNullable<ReactNode>;
      /**
       * Names the bar. Takes precedence over the rendered label.
       */
      'aria-label'?: string;
    }
  | {
      label?: undefined;
      /**
       * Names the bar. Required when there is no rendered label.
       */
      'aria-label': string;
    };

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
} & ProgressBarName &
  Omit<ComponentPropsWithRef<'div'>, 'children' | 'aria-label'>;
