import { cn } from '@ledgerhq/lumen-utils-shared';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import React from 'react';
import { Check } from '../../Symbols/Icons/Check';
import { CheckboxProps } from './types';

const checkboxStyles = cn(
  'size-20 shrink-0 cursor-pointer rounded-xs transition-colors',
  'focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:outline-hidden',

  'data-[state=unchecked]:border data-[state=unchecked]:border-muted data-[state=unchecked]:bg-base',
  'data-[state=unchecked]:hover:bg-base-hover',
  'data-[state=unchecked]:active:bg-base-pressed',
  'data-[state=unchecked]:disabled:border-disabled data-[state=unchecked]:disabled:bg-base',

  'data-[state=checked]:bg-active data-[state=checked]:text-on-accent',
  'data-[state=checked]:hover:bg-active-hover',
  'data-[state=checked]:active:bg-active-pressed',
  'data-[state=checked]:disabled:bg-disabled data-[state=checked]:disabled:text-disabled',
);

/**
 * A customizable checkbox component built on top of Radix UI Checkbox primitive.
 *
 * The checkbox follows the design system tokens and supports checked, unchecked,
 * disabled, and focus states with proper hover and active interactions.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-checkbox-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/components-checkbox-implementation--docs#dos-and-donts Guidelines}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the checkbox's core appearance.
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
  ...props
}: CheckboxProps & {
  ref?: React.Ref<React.ElementRef<typeof CheckboxPrimitive.Root>>;
}) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxStyles, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className='flex items-center justify-center'>
      <Check size={16} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
