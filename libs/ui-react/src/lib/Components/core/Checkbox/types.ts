import type { ComponentPropsWithRef } from 'react';

export type CheckboxProps = {
  /**
   * The controlled checked state of the checkbox.
   */
  checked?: boolean;
  /**
   * The default checked state (uncontrolled).
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Callback function called when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
  /**
   * The disabled state of the checkbox.
   * @default false
   */
  disabled?: boolean;
  /**
   * The name submitted with the form. A hidden input is only rendered when set.
   */
  name?: string;
  /**
   * The value submitted with the form when the checkbox is checked.
   * @default 'on'
   */
  value?: string;
  /**
   * Whether the checkbox must be checked for the form to be submitted.
   */
  required?: boolean;
  /**
   * The id of the form the checkbox belongs to, when not nested in it.
   */
  form?: string;
  /**
   * Ref to the hidden form input, for form libraries that register inputs directly.
   */
  inputRef?: ComponentPropsWithRef<'input'>['ref'];
} & Pick<
  ComponentPropsWithRef<'button'>,
  | 'ref'
  | 'id'
  | 'className'
  | 'tabIndex'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-hidden'
>;
