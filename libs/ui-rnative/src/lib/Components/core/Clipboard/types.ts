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
} & Omit<StyledPressableProps, 'children' | 'disabled'>;
