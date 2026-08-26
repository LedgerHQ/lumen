import { useMergedRef } from '@ledgerhq/lumen-utils-shared';
import type {
  ChangeEvent,
  ChangeEventHandler,
  RefCallback,
  RefObject,
} from 'react';
import { useRef, useState } from 'react';
import type { BaseInputElement, BaseInputProps } from '../types';

type UseBaseInputValueArgs = {
  value: BaseInputProps['value'];
  defaultValue: BaseInputProps['defaultValue'];
  onChange: ChangeEventHandler<BaseInputElement> | undefined;
  onClear: (() => void) | undefined;
  ref: BaseInputProps['ref'];
};

type UseBaseInputValueReturn = {
  inputRef: RefObject<BaseInputElement | null>;
  composedRef: RefCallback<BaseInputElement>;
  currentValue: string;
  hasContent: boolean;
  handleChange: ChangeEventHandler<BaseInputElement>;
  handleClear: () => void;
};

/**
 * Tracks the input value for `BaseInput` and implements the clear button, in both
 * controlled and uncontrolled mode.
 *
 * @internal
 */
export const useBaseInputValue = ({
  value,
  defaultValue,
  onChange,
  onClear,
  ref,
}: UseBaseInputValueArgs): UseBaseInputValueReturn => {
  const inputRef = useRef<BaseInputElement>(null);

  const isControlled = value !== undefined;

  // Mirrors the value purely for UI reactivity (clear button, counter) — it never controls
  // the input. inputRef.current can't be read directly: it is null on first render, and
  // clearing mutates the DOM without re-rendering.
  //
  // Deliberately not useControllableState: onChange here is a DOM ChangeEvent handler rather
  // than a value callback, and that hook's startTransition plus prop-sync effect would lag
  // the counter and cost an extra render per keystroke when controlled.
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue?.toString() ?? '',
  );

  const handleChange = (e: ChangeEvent<BaseInputElement>): void => {
    if (!isControlled) {
      setUncontrolledValue(e.target.value);
    }
    onChange?.(e);
  };

  const currentValue = isControlled
    ? (value?.toString() ?? '')
    : uncontrolledValue;
  const hasContent = currentValue.length > 0;

  const handleClear = () => {
    if (!inputRef.current) return;

    // Setting the value natively and dispatching a real event simulates a user action
    // closely enough for React to pick it up on controlled components. The setter is
    // defined per element type, so a multiline field needs the textarea prototype.
    const elementPrototype =
      inputRef.current instanceof window.HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    const valueSetter = Object.getOwnPropertyDescriptor(
      elementPrototype,
      'value',
    )?.set;
    valueSetter?.call(inputRef.current, '');

    if (!isControlled) {
      setUncontrolledValue('');
    }

    const event = new Event('input', { bubbles: true });
    inputRef.current.dispatchEvent(event);

    inputRef.current.focus();

    onClear?.();
  };

  const composedRef = useMergedRef(ref, inputRef);

  return {
    inputRef,
    composedRef,
    currentValue,
    hasContent,
    handleChange,
    handleClear,
  };
};
