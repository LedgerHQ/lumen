import type { ComponentPropsWithRef } from 'react';

export type TrendProps = {
  /**
   * The value to display in the trend. This value affects the appearance of the component in terms of color and icon.
   * @required
   */
  value: number;
  /**
   * The size of the trend component.
   * @default md
   */
  size?: 'sm' | 'md';
  /**
   * When `true`, shows a muted appearance on the trend, regardless of value.
   *
   * @default false
   */
  disabled?: boolean;
} & Omit<ComponentPropsWithRef<'span'>, 'children'>;
