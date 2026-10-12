import type { ComponentPropsWithRef } from 'react';

export type VisuallyHiddenInputProps = {
  /**
   * Whether the mirrored control is currently checked.
   */
  checked: boolean;
  /**
   * Ref to the underlying input, for form libraries that read or register it directly.
   */
  inputRef?: ComponentPropsWithRef<'input'>['ref'];
} & Pick<
  ComponentPropsWithRef<'input'>,
  'name' | 'value' | 'required' | 'disabled' | 'form'
>;
