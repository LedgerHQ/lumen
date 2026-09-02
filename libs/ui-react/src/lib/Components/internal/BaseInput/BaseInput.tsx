import {
  cn,
  resolveBaseInputPlaceholder,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { PointerEvent } from 'react';
import { useId } from 'react';
import { useCommonTranslation } from '../../../../i18n';
import { InteractiveIcon } from '../../core/InteractiveIcon';
import { DeleteCircleFill } from '../../symbols';
import { BaseInputCounter } from './BaseInputCounter';
import { BaseInputHelperText } from './BaseInputHelperText';
import { BaseInputLabel } from './BaseInputLabel';
import { BaseInputMultiline } from './BaseInputMultiline';
import { BaseInputSingleLine } from './BaseInputSingleLine';
import type { BaseInputProps } from './types';
import { useBaseInputValue } from './useBaseInputValue/useBaseInputValue';

const containerVariants = cva(
  [
    'group relative flex w-full cursor-text gap-8 rounded-sm bg-muted px-16 transition-colors',
    'focus-within:ring-2 focus-within:ring-active hover:bg-muted-hover',
    'has-disabled:cursor-not-allowed has-disabled:bg-disabled has-disabled:text-disabled',
  ],
  {
    variants: {
      status: {
        default: '',
        error: 'ring-1 ring-error focus-within:ring-2 focus-within:ring-error',
        success:
          'ring-1 ring-success focus-within:ring-2 focus-within:ring-success',
      },
      multiline: {
        true: 'min-h-48 items-start',
        false: 'h-48 items-center',
      },
      hasLabel: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { multiline: true, hasLabel: true, class: 'py-6' },
      { multiline: true, hasLabel: false, class: 'pt-12 pb-10' },
    ],
    defaultVariants: {
      status: 'default',
      multiline: false,
      hasLabel: false,
    },
  },
);

/**
 * Internal field chrome shared by `TextInput`, `SearchInput`, and `AddressInput`.
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
  disabled: disabledProp,
  helperText,
  maxCount,
  status,
  suffix,
  prefix,
  onClear,
  hideClearButton = false,
  readOnly = false,
  'aria-invalid': ariaInvalidProp,
  onChange: onChangeProp,
  placeholder: placeholderProp,
  multiline = false,
  minLines,
  maxLines,
  scrollbarWidth,
  type,
  ...props
}: BaseInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'BaseInput',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();

  const {
    inputRef,
    composedRef,
    currentValue,
    hasContent,
    handleChange,
    handleClear,
  } = useBaseInputValue({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: onChangeProp,
    onClear,
    ref,
  });

  const reactId = useId();
  const inputId = id || `input-${reactId}`;

  const ariaInvalid =
    ariaInvalidProp ?? (status === 'error' ? true : undefined);

  const { inputPlaceholder, labelStaysFloatedWithPlaceholder } =
    resolveBaseInputPlaceholder({
      label,
      placeholder: placeholderProp,
    });

  const showClearButton =
    hasContent && !disabled && !readOnly && !hideClearButton;

  const count = currentValue.length;
  const showCount = Boolean(maxCount && maxCount > 0);

  const helperId = `${inputId}-helper`;
  const showHelper = !!helperText;

  const controlProps = {
    id: inputId,
    disabled,
    readOnly,
    placeholder: inputPlaceholder,
    'aria-invalid': ariaInvalid,
    'aria-describedby': showHelper ? helperId : undefined,
    hasLabel: !!label,
    className: inputClassName,
    onChange: handleChange,
  };

  const trailing = showClearButton ? (
    <InteractiveIcon
      iconType='filled'
      icon={DeleteCircleFill}
      size={20}
      onClick={handleClear}
      aria-label={t('components.baseInput.clearInputAriaLabel')}
    />
  ) : (
    suffix
  );

  return (
    <div className={className}>
      <div
        className={cn(
          containerVariants({ status, multiline, hasLabel: !!label }),
          containerClassName,
        )}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          const target = event.target as Element;
          if (target.closest('input, textarea, button, a')) return;

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

        {multiline ? (
          <BaseInputMultiline
            ref={composedRef}
            minLines={minLines}
            maxLines={maxLines}
            scrollbarWidth={scrollbarWidth}
            {...controlProps}
            {...props}
          />
        ) : (
          <BaseInputSingleLine
            ref={composedRef}
            type={type}
            {...controlProps}
            {...props}
          />
        )}

        {label && (
          <BaseInputLabel
            htmlFor={inputId}
            status={status}
            floated={labelStaysFloatedWithPlaceholder}
            multiline={multiline}
            className={labelClassName}
          >
            {label}
          </BaseInputLabel>
        )}

        {multiline && trailing ? (
          <div className='pt-2'>{trailing}</div>
        ) : (
          trailing
        )}
      </div>
      {(showHelper || showCount) && (
        <div
          className={cn(
            'mt-8 flex items-start gap-8',
            showHelper ? 'justify-between' : 'justify-end',
          )}
        >
          {showHelper && helperText && (
            <BaseInputHelperText
              id={helperId}
              helperText={helperText}
              status={status}
            />
          )}
          {showCount && maxCount != null && (
            <BaseInputCounter count={count} maxCount={maxCount} />
          )}
        </div>
      )}
    </div>
  );
};
