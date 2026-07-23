import { cn, getFontSize, useMergedRef } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { ChangeEvent, ComponentPropsWithRef } from 'react';
import { useMemo } from 'react';
import { CurrencyLabel } from '../CurrencyLabel';
import type { CurrencyInputAlign, CurrencyInputSize } from '../types';
import { useAutoWidthInput } from '../useAutoWidthInput/useAutoWidthInput';

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
        md: 'h-56 heading-0-semi-bold',
        sm: 'h-36 heading-2-semi-bold',
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

export type CurrencyInputBaseProps = {
  /** The formatted text displayed in the input */
  inputValue: string;
  /** Native change handler for the underlying input */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Applies the entrance animation while the value is changing */
  isChanging?: boolean;
  size?: CurrencyInputSize;
  align?: CurrencyInputAlign;
  currencyText?: string;
  currencyPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
} & Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'prefix' | 'value' | 'onChange'
>;

/**
 * Presentational frame shared by CurrencyInput and AmountInput: an auto-width
 * text input with an optional currency label and dynamic font sizing. It is
 * value-agnostic — the owning component computes `inputValue`/`onChange`.
 */
export const CurrencyInputBase = ({
  ref,
  inputValue,
  onChange,
  isChanging = false,
  size = 'md',
  align = 'center',
  currencyText,
  placeholder = '',
  currencyPosition = 'left',
  disabled,
  className,
  ...props
}: CurrencyInputBaseProps) => {
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
        <CurrencyLabel size={size} style={textStyle}>
          {currencyText}
        </CurrencyLabel>
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
        onChange={onChange}
        placeholder={placeholder}
        className={cn(inputStyles({ size, isChanging }), className)}
        {...props}
        style={textStyle}
      />

      {currencyText && currencyPosition === 'right' && (
        <CurrencyLabel size={size} style={textStyle}>
          {currencyText}
        </CurrencyLabel>
      )}
    </div>
  );
};
