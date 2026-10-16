import { cn } from '@ledgerhq/lumen-design-core/cn';
import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useRef } from 'react';
import { useControllableState } from '../../../../utils/useControllableState';
import { useSyncOnFormReset } from '../../../../utils/useSyncOnFormReset';
import type { SwitchProps } from './types';

const wrapperVariants = cva('relative inline-flex shrink-0 align-middle', {
  variants: {
    size: {
      sm: 'h-16 max-h-16 w-24 max-w-24',
      md: 'h-24 max-h-24 w-40 max-w-40',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const trackStyles = cn(
  'group pointer-events-none flex size-full items-center rounded-full p-2 transition-colors duration-200 ease-in-out peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
  '[&[data-state=unchecked]:not([data-disabled])]:bg-muted-strong [&[data-state=unchecked]:not([data-disabled])]:peer-hover:bg-muted-strong-hover [&[data-state=unchecked]:not([data-disabled])]:peer-active:bg-muted-strong-pressed',
  '[&[data-state=checked]:not([data-disabled])]:bg-active [&[data-state=checked]:not([data-disabled])]:peer-hover:bg-active-hover [&[data-state=checked]:not([data-disabled])]:peer-active:bg-active-pressed',
  'data-disabled:bg-disabled-strong',
);

const thumbVariants = cva(
  'translate-x-0 rounded-full bg-white transition-transform duration-200 ease-in-out group-data-disabled:bg-base',
  {
    variants: {
      size: {
        sm: 'size-12 group-data-[state=checked]:translate-x-8',
        md: 'size-20 group-data-[state=checked]:translate-x-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/**
 * A customizable switch component.
 *
 * When disabled, it shows disabled styles for both track and thumb.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-switch--docs Guidelines}
 *
 * @warning The `className` prop is applied to the wrapper element. Use it for layout adjustments only.
 *
 * @example
 * // Basic switch
 * <Switch />
 *
 * @example
 * // Controlled small switch with disabled state
 * import { useState } from 'react';
 * const [selected, setSelected] = useState(false);
 * <Switch size="sm" selected={selected} onChange={(selected) => setSelected(selected)} disabled={someCondition} />
 */
export const Switch = ({
  ref,
  className,
  selected,
  defaultSelected = false,
  onChange,
  size = 'md',
  disabled: disabledProp,
  ...props
}: SwitchProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Switch',
    mergeWith: { disabled: disabledProp },
  });
  const [checked, setChecked] = useControllableState({
    prop: selected,
    defaultProp: defaultSelected,
    onChange,
  });
  const state = checked ? 'checked' : 'unchecked';
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useSyncOnFormReset({
    inputRef: wrapperRef,
    checked,
    setChecked,
    form: props.form,
  });

  return (
    <span ref={wrapperRef} className={cn(wrapperVariants({ size }), className)}>
      <input
        {...props}
        ref={ref}
        type='checkbox'
        role='switch'
        checked={checked}
        disabled={disabled}
        data-state={state}
        data-disabled={disabled ? '' : undefined}
        className='peer absolute inset-0 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed'
        onChange={(event) => setChecked(event.target.checked)}
      />
      <span
        aria-hidden
        data-state={state}
        data-disabled={disabled ? '' : undefined}
        className={trackStyles}
      >
        <span
          data-state={state}
          data-disabled={disabled ? '' : undefined}
          className={thumbVariants({ size })}
        />
      </span>
    </span>
  );
};
