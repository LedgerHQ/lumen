import { useMemo } from 'react';
import { FormattedValue, SplitChar } from '..';

export function useSplitText(value: FormattedValue): {
  integerPart: SplitChar[];
  decimalPart: SplitChar[];
} {
  return useMemo(
    () => ({
      integerPart: Array.from(value.integerPart, (digit) => ({
        value: digit,
        type: digit.match(/^\d$/) ? 'digit' : 'separator',
      })),
      decimalPart: value.decimalPart
        ? Array.from(value.decimalPart, (digit) => ({
            value: digit,
            type: 'digit',
          }))
        : [],
    }),
    [value.integerPart, value.decimalPart],
  );
}
