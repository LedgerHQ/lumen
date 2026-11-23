import type { ComponentPropsWithRef, ComponentType, ReactElement } from 'react';
import type { IconSize } from '../../symbols/Icon';

type ClipboardIcon = ComponentType<{ size?: IconSize; className?: string }>;

export type ClipboardRenderProps = {
  /**
   * The value passed to `Clipboard`.
   */
  value: string;
  /**
   * Copies the value to the user's clipboard. Resolves `false` when the copy
   * fails or `Clipboard` is disabled, e.g. to show an error.
   */
  handleCopy: () => Promise<boolean>;
  /**
   * The copy icon, or the check icon while the copied state lasts.
   */
  Icon: ClipboardIcon;
  /**
   * True while the copied state lasts after a successful copy.
   */
  isCopied: boolean;
  /**
   * The translated "Copy" label, or "Copied" while the copied state lasts.
   * Use it as a visible label (e.g. `TileButton`) or in an accessible name.
   */
  statusLabel: string;
};

export type ClipboardProps = {
  /**
   * The text copied to the user's clipboard.
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
  resetDelay?: number;
  /**
   * Prevents the copy and disables the rendered trigger through the shared disabled context.
   * @default false
   */
  disabled?: boolean;
  /**
   * Renders the element that triggers the copy, from the copy state.
   * @required
   */
  render: (props: ClipboardRenderProps) => ReactElement;
};

export type ClipboardInputProps = {
  /**
   * The text displayed in the input. Long values wrap onto multiple lines.
   * @required
   */
  label: string;
  /**
   * The icon displayed next to the label, usually `Icon` from the `Clipboard` render props.
   * @required
   */
  icon: ClipboardIcon;
} & Omit<ComponentPropsWithRef<'button'>, 'children' | 'value'>;
