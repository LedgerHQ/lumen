import { useTimeoutFlag } from '@ledgerhq/lumen-utils-shared';

export type UseClipboardOptions = {
  /**
   * How long `isCopied` stays true after a successful copy, in milliseconds.
   * @default 3000
   */
  resetDelay?: number;
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
   * True for `resetDelay` after the most recent successful copy, then reverts.
   * Drive the copied confirmation (e.g. a copy → check icon flip) off this.
   */
  isCopied: boolean;
};

/**
 * Copies text to the user's clipboard and exposes a temporary copied state.
 *
 * @example
 * const { copy, isCopied } = useClipboard();
 *
 * <IconButton icon={isCopied ? Check : Copy} onClick={() => copy(address)} />
 */
export const useClipboard = ({
  resetDelay = 3000,
  onCopy,
}: UseClipboardOptions = {}): UseClipboardResult => {
  const [isCopied, markCopied] = useTimeoutFlag(resetDelay);

  const copy = async (value: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return false;
    }
    markCopied();
    onCopy?.(value);
    return true;
  };

  return { copy, isCopied };
};
