import { cn, getFontSize, textFormatter } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AmountInputProps } from './types';

const inputStyles = cva(
  [
    'bg-transparent heading-0 caret-active outline-hidden transition-colors',
    'text-base placeholder:text-muted-subtle',
    'disabled:cursor-not-allowed disabled:bg-base-transparent disabled:text-disabled',
    'aria-invalid:text-error',
    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    'h-56',
  ],
  {
    variants: {
      isChanging: {
        true: 'animate-translate-from-right',
        false: '',
      },
    },
    defaultVariants: {
      isChanging: false,
    },
  },
);

const currencyStyles = cn(
  'cursor-text heading-0',
  'text-base',
  'group-has-[input:placeholder-shown]:text-muted-subtle',
  'group-has-[input:disabled]:cursor-not-allowed group-has-[input:disabled]:text-disabled',
  'group-has-[input[aria-invalid="true"]]:text-error',
);

/**
 * AmountInput component for handling numeric input with currency display.
 * This is a controlled component - both `value` and `onChange` props are required.
 * The currency text can be positioned either on the left or right side of the input.
 */
export const AmountInput = ({
  ref,
  className,
  currencyText,
  currencyPosition = 'left',
  disabled,
  maxIntegerLength = 9,
  maxDecimalLength = 9,
  allowDecimals = true,
  thousandsSeparator = true,
  value,
  onChange,
  ...props
}: AmountInputProps & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value.toString());
  const [isChanging, setIsChanging] = useState(false);

  /** Track previous value for animation trigger */
  const prevValueRef = useRef<string>(inputValue);

  /** TODO: move to utils-shared */
  function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
    return (node: T) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === 'function') {
          ref(node);
        } else {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }

  const fontSize = useMemo(() => getFontSize(inputValue) + 'px', [inputValue]);

  // Keep width in sync with hidden span
  useLayoutEffect(() => {
    if (spanRef.current && inputRef.current) {
      const width = spanRef.current.offsetWidth;
      const pxToAdd = inputValue === '' ? 33 : 8;
      inputRef.current.style.width = `${width + pxToAdd}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = textFormatter(e.target.value, {
      allowDecimals,
      thousandsSeparator,
      maxIntegerLength,
      maxDecimalLength,
    });

    setInputValue(cleaned);
    onChange({ ...e, target: { ...e.target, value: cleaned } });

    // Trigger animation if value actually changes
    if (cleaned !== prevValueRef.current) {
      setIsChanging(true);
    }

    prevValueRef.current = cleaned;
  };

  return (
    <div
      className='group relative flex items-center justify-center transition-transform'
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
          className={cn(currencyStyles, 'shrink-0')}
          style={{ fontSize, letterSpacing: 'normal' }}
        >
          {currencyText}
        </span>
      )}

      {/* Hidden span mirrors input value */}
      <span
        ref={spanRef}
        className={cn('invisible absolute heading-0')}
        aria-hidden='true'
        style={{ fontSize, letterSpacing: 'normal' }}
      >
        {inputValue}
      </span>

      <input
        ref={composeRefs(ref, inputRef)}
        type='text'
        inputMode='decimal'
        disabled={disabled}
        value={inputValue}
        onChange={handleChange}
        onAnimationEnd={() => setIsChanging(false)}
        className={cn(inputStyles({ isChanging }), className)}
        {...props}
        style={{ fontSize, letterSpacing: 'normal' }}
      />

      {currencyText && currencyPosition === 'right' && (
        <span
          className={cn(currencyStyles, 'shrink-0')}
          style={{ fontSize, letterSpacing: 'normal' }}
        >
          {currencyText}
        </span>
      )}
    </div>
  );
};

AmountInput.displayName = 'AmountInput';
