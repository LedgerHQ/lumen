import type { ComponentPropsWithRef } from 'react';

export type SwitchProps = {
  /**
   * The controlled selected state of the switch.
   */
  selected?: boolean;
  /**
   * The default selected state of the switch (uncontrolled).
   */
  defaultSelected?: boolean;
  /**
   * Event handler called when the selected state changes.
   */
  onChange?: (selected: boolean) => void;
  /**
   * The size of the switch.
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * The disabled state of the switch.
   * @default false
   */
  disabled?: boolean;
  /**
   * The name submitted with the form.
   */
  name?: string;
  /**
   * The value submitted with the form when the switch is selected.
   * @default 'on'
   */
  value?: string;
  /**
   * Whether the switch must be selected for the form to be submitted.
   */
  required?: boolean;
  /**
   * The id of the form the switch belongs to, when not nested in it.
   */
  form?: string;
  /**
   * Additional custom CSS classes to apply to the wrapper.
   */
  className?: string;
} & Omit<
  ComponentPropsWithRef<'input'>,
  | 'onChange'
  | 'checked'
  | 'defaultChecked'
  | 'value'
  | 'defaultValue'
  | 'size'
  | 'type'
  | 'role'
  | 'children'
  | 'aria-checked'
  | 'className'
>;
