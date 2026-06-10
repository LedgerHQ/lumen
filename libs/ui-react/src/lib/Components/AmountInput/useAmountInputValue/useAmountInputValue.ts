import { textFormatter } from '@ledgerhq/lumen-utils-shared';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

type FormatOptions = {
  allowDecimals: boolean;
  thousandsSeparator: boolean;
  maxIntegerLength: number;
  maxDecimalLength: number;
};

type UseAmountInputValueArgs = {
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  formatOptions: FormatOptions;
};

type UseAmountInputValueReturn = {
  inputValue: string;
  isChanging: boolean;
  setIsChanging: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const useAmountInputValue = ({
  value,
  onChange,
  formatOptions,
}: UseAmountInputValueArgs): UseAmountInputValueReturn => {
  const format = useCallback(
    (v: string | number): string => textFormatter(String(v), formatOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      formatOptions.allowDecimals,
      formatOptions.thousandsSeparator,
      formatOptions.maxIntegerLength,
      formatOptions.maxDecimalLength,
    ],
  );

  const [inputValue, setInputValue] = useState(() => format(value));
  const [isChanging, setIsChanging] = useState(false);
  const prevValueRef = useRef<string>(inputValue);

  useEffect(() => {
    const formatted = format(value);
    setInputValue(formatted);
    prevValueRef.current = formatted;
  }, [value, format]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const cleaned = format(e.target.value);
    setInputValue(cleaned);
    onChange({ ...e, target: { ...e.target, value: cleaned } });
    if (cleaned !== prevValueRef.current) {
      setIsChanging(true);
    }
    prevValueRef.current = cleaned;
  };

  return { inputValue, isChanging, setIsChanging, handleChange };
};
