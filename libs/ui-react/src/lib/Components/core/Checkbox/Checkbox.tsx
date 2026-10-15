import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useRef } from 'react';
import { useControllableState } from '../../../../utils/useControllableState';
import { useSyncOnFormReset } from '../../../../utils/useSyncOnFormReset';
import { Check } from '../../symbols/icons/Check';
import type { CheckboxProps } from './types';

const wrapperStyles = 'relative inline-flex size-20 shrink-0';

const checkboxStyles = cn(
  'flex size-full items-center justify-center rounded-xs transition-colors',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2',

  'data-[state=unchecked]:border data-[state=unchecked]:border-muted data-[state=unchecked]:bg-base',
  'data-[state=unchecked]:peer-hover:bg-base-hover',
  'data-[state=unchecked]:peer-active:bg-base-pressed',
  'data-[state=unchecked]:peer-disabled:border-disabled data-[state=unchecked]:peer-disabled:bg-base',

  'data-[state=checked]:bg-active data-[state=checked]:text-on-accent',
  'data-[state=checked]:peer-hover:bg-active-hover',
  'data-[state=checked]:peer-active:bg-active-pressed',
  'data-[state=checked]:peer-disabled:bg-disabled data-[state=checked]:peer-disabled:text-disabled',
);

/**
 * A customizable checkbox component.
 *
 * The checkbox follows the design system tokens and supports checked, unchecked,
 * disabled, and focus states with proper hover and active interactions.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-checkbox--docs Guidelines}
 *
 * @warning The `className` prop is applied to the wrapper element. Use it for layout adjustments only.
 *
 * @example
 * import { Checkbox } from '@ledgerhq/lumen-ui-react';
 *
 * // Basic controlled checkbox
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   checked={checked}
 *   onCheckedChange={setChecked}
 * />
 *
 * // Uncontrolled checkbox with default state
 * <Checkbox defaultChecked={true} />
 *
 * // Disabled checkbox
 * <Checkbox disabled checked={true} />
 *
 * // Form checkbox with name and value
 * <Checkbox
 *   name="terms"
 *   value="accepted"
 *   required
 *   onCheckedChange={(checked) => console.log('Terms accepted:', checked)}
 * />
 *
 * // With custom styling (layout only)
 * <Checkbox className="mr-8" />
 */
export const Checkbox = ({
  ref,
  className,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled: disabledProp,
  ...props
}: CheckboxProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Checkbox',
    mergeWith: { disabled: disabledProp },
  });
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
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
    <span ref={wrapperRef} className={cn(wrapperStyles, className)}>
      <input
        {...props}
        ref={ref}
        type='checkbox'
        checked={checked}
        disabled={disabled}
        data-state={state}
        data-disabled={disabled ? '' : undefined}
        className='peer absolute inset-0 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed'
        onChange={(event) => setChecked(event.target.checked)}
      />
      <span aria-hidden data-state={state} className={checkboxStyles}>
        {checked && <Check size={16} />}
      </span>
    </span>
  );
};
