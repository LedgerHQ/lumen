import type { ComponentPropsWithRef } from 'react';

export type ClipboardProps = {
  /**
   * The text displayed in the clipboard and copied to the user's clipboard on click.
   * @required
   */
  value: string;
  /**
   * Callback fired after the value has been written to the clipboard.
   */
  onCopy?: (value: string) => void;
  /**
   * How long the copied state lasts after a successful copy, in milliseconds.
   * @default 3000
   */
  resetAfterMs?: number;
} & Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'value' | 'onCopy' | 'disabled'
>;
