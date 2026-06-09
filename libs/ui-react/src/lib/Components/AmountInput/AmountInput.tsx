import {
  cn,
  getFontSize,
  useDisabledContext,
  useMergedRef,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import type { AmountInputProps, AmountInputSize } from './types';
import { useAmountInputValue } from './useAmountInputValue';
import { useAutoWidthInput } from './useAutoWidthInput';

const inputStyles = cva(
  [
    'bg-transparent caret-active outline-hidden transition-colors',
    'text-base placeholder:text-muted-subtle',
    'disabled:cursor-not-allowed disabled:bg-base-transparent disabled:text-disabled',
    'aria-invalid:text-error',
    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
  ],
  {
    variants: {
      size: {
        md: 'heading-0-semi-bold h-56',
        sm: 'heading-2-semi-bold h-36',
      },
      isChanging: {
        true: 'animate-translate-from-right',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      isChanging: false,
    },
  },
);

const currencyStyles = cva(
  [
    'cursor-text text-base',
    'group-has-[input:placeholder-shown]:text-muted-subtle',
    'group-has-[input:disabled]:cursor-not-allowed group-has-[input:disabled]:text-disabled',
    'group-has-[input[aria-invalid="true"]]:text-error',
  ],
  {
    variants: {
      size: {
        md: 'heading-0-semi-bold',
        sm: 'heading-2-semi-bold',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const mirrorTextStyles = cva('invisible absolute whitespace-pre', {
  variants: {
    size: {
      md: 'heading-0-semi-bold',
      sm: 'heading-2-semi-bold',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const containerStyles = cva(
  'group relative flex w-full items-center overflow-visible transition-transform',
  {
    variants: {
      align: {
        center: 'justify-center',
        start: 'justify-start',
        end: 'justify-end',
      },
    },
    defaultVariants: {
      align: 'center',
    },
  },
);

type CurrencyProps = {
  size: AmountInputSize;
  style: React.CSSProperties;
  children: React.ReactNode;
};

const Currency = ({ size, style, children }: CurrencyProps) => (
  <span className={cn(currencyStyles({ size }), 'shrink-0')} style={style}>
    {children}
  </span>
);

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
      },
    });

  const { spanRef, inputRef } = useAutoWidthInput({
    inputValue,
    currencyText,
    size,
  });

  const mergedRef = useMergedRef(ref, inputRef);

  const fontSize = useMemo(
    () => getFontSize(inputValue, size) + 'px',
    [inputValue, size],
  );

  const textStyle = { fontSize, letterSpacing: 'normal' as const };

  return (
    <div
      className={containerStyles({ align })}
      onPointerDown={() => {
        const input = inputRef.current;
        if (!input) return;
        window.requestAnimationFrame(() => {
          input.focus();
        });
      }}
    >
      {currencyText && currencyPosition === 'left' && (
        <Currency size={size} style={textStyle}>
          {currencyText}
        </Currency>
      )}

      <span
        ref={spanRef}
        className={mirrorTextStyles({ size })}
        aria-hidden='true'
        style={textStyle}
      >
        {inputValue}
      </span>

      <input
        ref={mergedRef}
        type='text'
        inputMode='decimal'
        disabled={disabled}
        value={inputValue}
        onChange={handleChange}
        onAnimationEnd={() => setIsChanging(false)}
        className={cn(inputStyles({ size, isChanging }), className)}
        {...props}
        style={textStyle}
      />

      {currencyText && currencyPosition === 'right' && (
        <Currency size={size} style={textStyle}>
          {currencyText}
        </Currency>
      )}
    </div>
  );
};
