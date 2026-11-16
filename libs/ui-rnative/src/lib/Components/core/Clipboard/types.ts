import type { StyledPressableProps } from '../../../../styles';

export type ClipboardProps = {
  /**
   * The text displayed in the clipboard and copied to the user's clipboard on press.
   * @required
   */
  value: string;
  /**
   * Callback fired after the value has been written to the clipboard.
   */
  onCopy?: (value: string) => void;
  /**
   * Controls the copied state from outside. When set, it overrides the
   * internal state that turns on after a successful copy.
   */
  isCopied?: boolean;
  /**
   * How long the copied state lasts after a successful copy, in milliseconds.
   * @default 3000
   */
  timeout?: number;
} & Omit<StyledPressableProps, 'children' | 'disabled'>;
