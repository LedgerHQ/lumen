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
} & Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'value' | 'onCopy' | 'disabled'
>;
