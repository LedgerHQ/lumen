import { cn } from '@ledgerhq/lumen-utils-shared';
import type { BaseInputSingleLineProps } from './types';

const baseInputStyles = cn(
  'peer w-full flex-1 bg-muted body-1 text-base caret-active outline-hidden transition-colors',
  'group-hover:bg-muted-hover group-disabled:bg-disabled',
  'group-has-disabled:cursor-not-allowed group-has-disabled:bg-disabled group-has-disabled:text-disabled',
  'placeholder:text-muted group-has-disabled:placeholder:text-disabled',
  '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
  'truncate',
);

/**
 * The single-line control rendered inside `BaseInput`.
 *
 * @internal
 */
export const BaseInputSingleLine = ({
  ref,
  className,
  hasLabel = false,
  ...props
}: BaseInputSingleLineProps) => {
  return (
    <input
      ref={ref}
      className={cn(baseInputStyles, hasLabel && 'pt-12 body-2', className)}
      {...props}
    />
  );
};
