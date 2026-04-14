import { StyledViewProps } from '../../../styles';

export type BadgeProps = {
  /**
   * The amount to be displayed on the badge.
   * If higher than 99, the displayed value will be "99+".
   */
  value: number;
  /**
   * The size of the badge.
   * Note that in `xs` size the value you provide isn't shown.
   */
  size: 'md' | 'sm' | 'xs';
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
