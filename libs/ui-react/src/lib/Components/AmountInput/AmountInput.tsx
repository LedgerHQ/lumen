import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { CurrencyInputBase } from '../CurrencyInput/CurrencyInputBase';
import type { AmountInputProps } from './types';
import { useAmountInputValue } from './useAmountInputValue/useAmountInputValue';

/**
 * AmountInput component for handling numeric input with currency display.
 * This is a controlled component - both `value` and `onChange` props are required.
 * The currency text can be positioned either on the left or right side of the input.
 */
export const AmountInput = ({
  ref,
  className,
  size = 'md',
  align = 'center',
  currencyText,
  currencyPosition = 'left',
  disabled: disabledProp,
  maxIntegerLength = 9,
  maxDecimalLength = 9,
  allowDecimals = true,
  thousandsSeparator = true,
  decimalSeparator = '.',
  value,
  onChange,
  ...props
}: AmountInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'AmountInput',
    mergeWith: { disabled: disabledProp },
  });

  const { inputValue, isChanging, setIsChanging, handleChange } =
    useAmountInputValue({
      value,
      onChange,
      formatOptions: {
        allowDecimals,
        thousandsSeparator,
        maxIntegerLength,
        maxDecimalLength,
        decimalSeparator,
      },
    });

  return (
    <CurrencyInputBase
      ref={ref}
      inputValue={inputValue}
      onChange={handleChange}
      isChanging={isChanging}
      onAnimationEnd={() => setIsChanging(false)}
      size={size}
      align={align}
      currencyText={currencyText}
      currencyPosition={currencyPosition}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
};
