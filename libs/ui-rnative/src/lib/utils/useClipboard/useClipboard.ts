import { useTemporaryFlag } from '@ledgerhq/lumen-utils-shared';
import * as ExpoClipboard from 'expo-clipboard';

export type UseClipboardOptions = {
  /**
   * How long `isCopied` stays true after a successful copy, in milliseconds.
   * @default 3000
   */
  resetAfterMs?: number;
  /**
   * Callback fired after a value has been written to the clipboard.
   */
  onCopy?: (value: string) => void;
};

export type UseClipboardResult = {
  /**
   * Writes the value to the user's clipboard. Resolves `false` when the write
   * fails, in which case `isCopied` does not change.
   */
  copy: (value: string) => Promise<boolean>;
  /**
   * True for `resetAfterMs` after the most recent successful copy, then reverts.
   * Drive the copied confirmation (e.g. a copy → check icon flip) off this.
   */
  isCopied: boolean;
};

/**
 * Copies text to the user's clipboard and exposes a temporary copied state.
 */
export const useClipboard = ({
  resetAfterMs = 3000,
  onCopy,
}: UseClipboardOptions = {}): UseClipboardResult => {
  const [isCopied, markCopied] = useTemporaryFlag(resetAfterMs);

  const copy = async (value: string): Promise<boolean> => {
    try {
      const success = await ExpoClipboard.setStringAsync(value);
      if (!success) {
        return false;
      }
    } catch {
      return false;
    }
    markCopied();
    onCopy?.(value);
    return true;
  };

  return { copy, isCopied };
};
