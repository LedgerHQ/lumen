import { cn } from '@ledgerhq/lumen-utils-shared';
import React from 'react';
import { useCommonTranslation } from '../../../i18n';
import { DeleteCircleFill } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { BaseInputProps } from './types';

const baseContainerStyles = cn(
  'group relative flex h-48 w-full cursor-text items-center gap-8 rounded-sm bg-muted px-16 transition-colors',
  'focus-within:ring-2 focus-within:ring-active hover:bg-muted-hover',
  'has-disabled:cursor-not-allowed has-disabled:bg-disabled has-disabled:text-disabled',
  'has-invalid:border-error has-invalid:ring-1 has-invalid:ring-error',
  'has-[input[aria-invalid="true"]]:border-error has-[input[aria-invalid="true"]]:ring-1 has-[input[aria-invalid="true"]]:ring-error',
);

const baseInputStyles = cn(
  'peer w-full flex-1 bg-muted body-1 text-base caret-active outline-hidden transition-colors',
  'group-hover:bg-muted-hover group-disabled:bg-disabled',
  'group-has-disabled:cursor-not-allowed group-has-disabled:bg-disabled group-has-disabled:text-disabled',
  'placeholder:text-muted group-has-disabled:placeholder:text-disabled',
  '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
  'truncate',
);

const baseLabelStyles = cn(
  'pointer-events-none absolute top-6 left-16 origin-left body-4 text-muted transition-all duration-300',
  'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:body-2',
  'group-has-disabled:text-disabled',
  'peer-focus:top-6 peer-focus:-translate-y-0 peer-focus:body-4',
  'w-[calc(100%-var(--size-56))] truncate',
);

/**
 * Base input component with floating label, error state styling, and clear button functionality.
 * Shows a clear button by default when input has content. Use hideClearButton to hide it.
 * This is an internal component used to build other input components.
 *
 * Features:
 * - Automatic clear button that works with both controlled and uncontrolled inputs
 * - Native-like clear behavior using HTMLInputElement.prototype.value setter
 * - Proper event dispatching that React can intercept for controlled components
 * - Floating label with smooth transitions
 * - Error state styling and accessibility
 *
 * Supports className customization for different elements:
 * - `className`: Applied to the container/root element
 * - `inputClassName`: Applied to the input element
 * - `labelClassName`: Applied to the floating label element
 *
 * @internal
 */

export const BaseInput = ({
  ref,
  className,
  containerClassName,
  inputClassName,
  labelClassName,
  label,
  id,
  disabled,
  errorMessage,
  suffix,
  prefix,
  onClear,
  hideClearButton = false,
  'aria-invalid': ariaInvalidProp,
  onChange: onChangeProp,
  ...props
}: BaseInputProps & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  const { t } = useCommonTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reactId = React.useId();
  const inputId = id || `input-${reactId}`;

  // Handle aria-invalid properly - use provided value or derive from errorMessage
  const ariaInvalid = ariaInvalidProp
    ? ariaInvalidProp
    : errorMessage
      ? true
      : undefined;

  const isControlled = props.value !== undefined;

  // For uncontrolled inputs, we need state to track value changes for UI reactivity.
  // We can't use inputRef.current.value directly because:
  // 1. On first render, inputRef.current is null (so we fallback to defaultValue)
  // 2. When clearing the input, DOM value changes but React doesn't re-render
  //    to recalculate hasContent, causing clear button to stay visible
  // This state is only for UI reactivity (clear button visibility), not controlling the input
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    props.defaultValue?.toString() || '',
  );

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Track uncontrolled input value changes
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }
      // Always call the original onChange if provided
      onChangeProp?.(e);
    },
    [isControlled, onChangeProp],
  );

  const hasContent = isControlled
    ? !!props.value && props.value.toString().length > 0
    : uncontrolledValue.length > 0;

  const showClearButton = hasContent && !disabled && !hideClearButton;

  const errorId = `${inputId}-error`;

  const handleClear = () => {
    if (!inputRef.current) return;

    // programmatically trigger an onChange for controlled components.
    // It simulates a user action more closely by setting the value natively and dispatching a real event.
    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    valueSetter?.call(inputRef.current, '');

    if (!isControlled) {
      setUncontrolledValue('');
    }

    const event = new Event('input', { bubbles: true });
    inputRef.current.dispatchEvent(event);

    inputRef.current.focus();

    onClear?.();
  };

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

  return (
    <div className={className}>
      <div
        className={cn(baseContainerStyles, containerClassName)}
        onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
          const target = event.target as Element;
          if (target.closest('input, button, a')) return;

          const input = inputRef.current;
          if (!input) return;

          // Smart cursor positioning for better UX:
          // - Container/label clicks with content: end (user likely wants to continue typing)
          // - Container/label clicks on empty input: start (natural starting point)
          const cursorPosition =
            input.value.length > 0 ? input.value.length : 0;

          window.requestAnimationFrame(() => {
            try {
              input.setSelectionRange(cursorPosition, cursorPosition);
            } catch {
              // setSelectionRange is not supported on all input types
            }
            input.focus();
          });
        }}
      >
        {prefix}

        <input
          ref={composeRefs(ref, inputRef)}
          id={inputId}
          disabled={disabled}
          placeholder=' '
          aria-invalid={ariaInvalid}
          aria-describedby={errorMessage ? errorId : undefined}
          className={cn(
            baseInputStyles,
            label && 'pt-12 body-2',
            inputClassName,
          )}
          onChange={handleInput}
          {...props}
        />

        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              baseLabelStyles,
              errorMessage && 'text-error',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        {showClearButton && (
          <InteractiveIcon
            iconType='filled'
            onClick={handleClear}
            aria-label={t('components.baseInput.clearInputAriaLabel')}
          >
            <DeleteCircleFill size={20} />
          </InteractiveIcon>
        )}

        {!showClearButton && suffix}
      </div>
      {errorMessage && (
        <div
          id={errorId}
          className='mt-8 flex items-center gap-2 body-3 text-error'
          role='alert'
        >
          <DeleteCircleFill size={16} className='shrink-0 text-error' />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

BaseInput.displayName = 'BaseInput';
