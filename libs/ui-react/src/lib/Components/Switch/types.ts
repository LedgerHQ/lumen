import * as SwitchPrimitive from '@radix-ui/react-switch';
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
} & Omit<
  ComponentPropsWithRef<typeof SwitchPrimitive.Root>,
  'onChange' | 'checked' | 'defaultChecked' | 'onCheckedChange'
>;
