import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Keeps a controllable checked state in sync with a native form reset.
 *
 * A native reset restores the input without a change event, so the state is
 * synced after the reset. It is deferred (setTimeout) because reset fires
 * before controls are restored.
 */
export const useSyncOnFormReset = ({
  inputRef,
  checked,
  setChecked,
  form,
}: {
  inputRef: RefObject<HTMLElement | null>;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  form?: string;
}): void => {
  useEffect(() => {
    const input = inputRef.current?.querySelector('input');
    const owner = input?.form;
    if (!input || !owner) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const syncAfterReset = (): void => {
      timeout = setTimeout(() => {
        if (input.checked !== checked) {
          setChecked(input.checked);
        }
      });
    };
    owner.addEventListener('reset', syncAfterReset);
    return () => {
      owner.removeEventListener('reset', syncAfterReset);
      clearTimeout(timeout);
    };
  }, [inputRef, checked, setChecked, form]);
};
