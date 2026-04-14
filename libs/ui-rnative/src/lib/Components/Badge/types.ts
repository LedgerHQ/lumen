import { StyledViewProps } from '../../../styles';

export type BadgePin = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export type BadgeProps = {
  /**
   * The size of the badge.
   *
   * Note that in `xs` size, the value you provide isn't shown.
   */
  size: 'md' | 'sm' | 'xs';
  /**
   * The amount to be displayed on the badge.
   *
   * If higher than `max`, the displayed value will be "[max]+".
   */
  value: number;
  /**
   * The max value shown on the badge.
   *
   * If `value` is higher than `max`, the displayed value will be "[max]+".
   *
   * By design, it will ignore values higher than 99.
   * @default 99
   */
  max?: number;
  /**
   * The appearance of the badge.
   * @default base
   */
  appearance?: 'base' | 'red';
  /**
   * Whether the badge should show a disabled appearance.
   * @default false
   */
  disabled?: boolean;
} & StyledViewProps;
