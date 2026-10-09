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
