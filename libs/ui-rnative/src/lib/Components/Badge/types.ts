import { StyledViewProps } from '../../../styles';

export type BadgeProps = {
  /**
   * The amount to be displayed on the badge.
   * If higher than `max`, the displayed value will be `max` appended with a plus sign.
   */
  value: number;
  /**
   * The size of the badge.
   * Note that in `xs` size the value you provide isn't shown.
   */
  size: 'md' | 'sm' | 'xs';
  /**
   * The max amount to display.
   * If `value` is higher than `max`, the displayed value will be `max` appended with a plus sign.
   */
  max?: number;
  /**
   * The appearance of the badge.
   * @default base
   */
  appearance?: 'base' | 'red';
} & StyledViewProps;
