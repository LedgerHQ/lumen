import type { StyledPressableProps } from '../../../styles';

export type SwitchProps = {
  /**
   * The disabled state of the switch.
   * @default false
   */
  disabled?: boolean;
  /**
   * The controlled checked state of the switch.
   * @default false
   */
  checked?: boolean;
  /**
   * The size of the switch.
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * The callback function called when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Sets the initial checked state for uncontrolled Switch.
   * @default false
   */
  defaultChecked?: boolean;
} & Omit<StyledPressableProps, 'children'>;
