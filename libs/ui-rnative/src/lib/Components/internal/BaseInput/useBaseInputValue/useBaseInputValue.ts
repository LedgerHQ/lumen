import { useMergedRef } from '@ledgerhq/lumen-utils-shared';
import type { RefCallback, RefObject } from 'react';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import type { BaseInputProps } from '../types';

type UseBaseInputValueArgs = {
  value: string | undefined;
  defaultValue: string | undefined;
  onChangeText: ((text: string) => void) | undefined;
  onClear: (() => void) | undefined;
  ref: BaseInputProps['ref'];
};

type UseBaseInputValueReturn = {
  inputRef: RefObject<TextInput | null>;
  composedRef: RefCallback<TextInput>;
  value: string | undefined;
  hasContent: boolean;
  handleChangeText: (text: string) => void;
  handleClear: () => void;
};

/**
 * Tracks the input value for `BaseInput` and implements the clear button, in both
 * controlled and uncontrolled mode.
 *
 * @internal
 */
export const useBaseInputValue = ({
  value: valueProp,
  defaultValue,
  onChangeText,
  onClear,
  ref,
}: UseBaseInputValueArgs): UseBaseInputValueReturn => {
  const inputRef = useRef<TextInput>(null);
  const composedRef = useMergedRef(ref, inputRef);

  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? '',
  );

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const hasContent = (value ?? '').length > 0;

  const handleChangeText = (text: string): void => {
    if (!isControlled) {
      setUncontrolledValue(text);
    }
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (!isControlled) {
      setUncontrolledValue('');
    }
    onChangeText?.('');
    onClear?.();
  };

  return {
    inputRef,
    composedRef,
    value,
    hasContent,
    handleChangeText,
    handleClear,
  };
};
