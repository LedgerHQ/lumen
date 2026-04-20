import type { StyledViewProps } from '../../../styles';

export type CheckboxProps = {
  /**
   * The disabled state of the checkbox.
   */
  disabled?: boolean;
  /**
   * The controlled checked state of the checkbox.
   */
  checked?: boolean;
  /**
   * The callback function called when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * The default checked state of the checkbox.
   */
  defaultChecked?: boolean;
  /**
   * The label of the checkbox.
   */
  label?: React.ReactNode;
} & StyledViewProps;
