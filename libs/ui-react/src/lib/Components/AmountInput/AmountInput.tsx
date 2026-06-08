import {
  cn,
  getFontSize,
  textFormatter,
  useDisabledContext,
  useMergedRef,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AmountInputProps, AmountInputSize } from './types';

/** Extra width for empty input (caret + placeholder). */
const INPUT_WIDTH_PADDING_EMPTY = 33;
/** Extra width when the input has a value. */
const INPUT_WIDTH_PADDING_FILLED = 8;
/** Extra width without currency — md size (heading-0 side bearings). */
const INPUT_WIDTH_PADDING_NO_CURRENCY_MD = 24;
/** Extra width without currency — sm size (heading-2 side bearings). */
const INPUT_WIDTH_PADDING_NO_CURRENCY_SM = 16;

const NO_CURRENCY_WIDTH_PADDING_BY_SIZE = {
  md: INPUT_WIDTH_PADDING_NO_CURRENCY_MD,
  sm: INPUT_WIDTH_PADDING_NO_CURRENCY_SM,
} as const satisfies Record<AmountInputSize, number>;

const getInputWidthPadding = (
  inputValue: string,
  currencyText: string | undefined,
  size: AmountInputSize,
): number => {
  const basePadding =
    inputValue === '' ? INPUT_WIDTH_PADDING_EMPTY : INPUT_WIDTH_PADDING_FILLED;

  if (currencyText) {
    return basePadding;
  }

  return basePadding + NO_CURRENCY_WIDTH_PADDING_BY_SIZE[size];
};

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
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);
  const formatExternalValue = useCallback(
    (v: string | number): string =>
      textFormatter(v.toString(), {
        allowDecimals,
        thousandsSeparator,
        maxIntegerLength,
        maxDecimalLength,
      }),
    [allowDecimals, thousandsSeparator, maxIntegerLength, maxDecimalLength],
  );

  const [inputValue, setInputValue] = useState(() =>
    formatExternalValue(value),
  );
  const [isChanging, setIsChanging] = useState(false);

  const prevValueRef = useRef<string>(inputValue);

  const fontSize = useMemo(
    () => getFontSize(inputValue, size) + 'px',
    [inputValue, size],
  );

  const syncInputWidth = useCallback((): void => {
    if (spanRef.current && inputRef.current) {
      const width = Math.ceil(
        Math.max(spanRef.current.scrollWidth, spanRef.current.offsetWidth),
      );
      const padding = getInputWidthPadding(inputValue, currencyText, size);
      inputRef.current.style.width = `${width + padding}px`;
    }
  }, [inputValue, currencyText, size]);

  useLayoutEffect(syncInputWidth, [syncInputWidth]);

  // Re-sync whenever the mirror span resizes — this catches the font-loading
  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;
    const observer = new ResizeObserver(syncInputWidth);
    observer.observe(span);
    return () => observer.disconnect();
  }, [syncInputWidth]);

  useEffect(() => {
    setInputValue(formatExternalValue(value));
  }, [value, formatExternalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = textFormatter(e.target.value, {
      allowDecimals,
      thousandsSeparator,
      maxIntegerLength,
      maxDecimalLength,
    });

    setInputValue(cleaned);
    onChange({ ...e, target: { ...e.target, value: cleaned } });

    if (cleaned !== prevValueRef.current) {
      setIsChanging(true);
    }

    prevValueRef.current = cleaned;
  };

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
        <span
          className={cn(currencyStyles({ size }), 'shrink-0')}
          style={textStyle}
        >
          {currencyText}
        </span>
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
        <span
          className={cn(currencyStyles({ size }), 'shrink-0')}
          style={textStyle}
        >
          {currencyText}
        </span>
      )}
    </div>
  );
};
