import type { BaseButtonProps } from '../Button';

export type IconButtonProps = {
  /**
   * Accessible label for the IconButton
   */
  accessibilityLabel: string;
  /**
   * The icon to display in the button
   */
  icon: NonNullable<BaseButtonProps['icon']>;
} & Omit<BaseButtonProps, 'isFull'>;
