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
   * The name submitted with the enclosing form.
   */
  name?: string;
  /**
   * Whether the switch must be on before the enclosing form can be submitted.
   */
  required?: boolean;
} & Omit<
  ComponentPropsWithRef<'button'>,
  'onChange' | 'children' | 'role' | 'type' | 'name'
>;
