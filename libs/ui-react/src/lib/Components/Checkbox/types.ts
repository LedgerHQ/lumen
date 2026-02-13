import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { ComponentPropsWithRef } from 'react';

export type CheckboxProps = {
  /**
   * The controlled checked state of the checkbox.
   */
  checked?: boolean;
  /**
   * The default checked state (uncontrolled).
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
} & Omit<
  ComponentPropsWithRef<typeof CheckboxPrimitive.Root>,
  'checked' | 'defaultChecked' | 'onCheckedChange' | 'asChild'
>;
