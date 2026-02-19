import { FormattedValue } from './types';

export const buildAriaLabel = (
  parts: FormattedValue,
  hidden: boolean,
  hiddenLabel: string,
): string => {
  if (hidden) return hiddenLabel;

  const decimal = parts.decimalPart
    ? `${parts.decimalSeparator}${parts.decimalPart}`
    : '';
  const amount = `${parts.integerPart}${decimal}`;

  if (parts.currencyPosition === 'end') {
    return `${amount} ${parts.currencyText}`;
  }

  return `${parts.currencyText} ${amount}`;
};
