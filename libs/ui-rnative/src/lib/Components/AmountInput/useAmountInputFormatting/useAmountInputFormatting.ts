import { textFormatter } from '@ledgerhq/lumen-utils-shared';
import { useCallback, useMemo } from 'react';

type FormatOptions = {
  allowDecimals: boolean;
  thousandsSeparator: boolean;
  maxIntegerLength: number;
  maxDecimalLength: number;
};

type UseAmountInputFormattingArgs = {
  value: string | number;
  onChangeText: (text: string) => void;
  formatOptions: FormatOptions;
};

type UseAmountInputFormattingReturn = {
  formattedValue: string;
  handleChangeText: (text: string) => void;
};

export const useAmountInputFormatting = ({
  value,
  onChangeText,
  formatOptions,
}: UseAmountInputFormattingArgs): UseAmountInputFormattingReturn => {
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

  const formattedValue = useMemo(() => format(value), [value, format]);

  const handleChangeText = useCallback(
    (text: string): void => {
      onChangeText(format(text));
    },
    [format, onChangeText],
  );

  return { formattedValue, handleChangeText };
};
