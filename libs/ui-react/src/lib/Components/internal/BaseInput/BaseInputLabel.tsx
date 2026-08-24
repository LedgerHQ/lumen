import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { BaseInputLabelProps } from './types';

const baseLabelStyles = cn(
  'pointer-events-none absolute top-6 left-16 origin-left body-4 text-muted transition-all duration-300',
  'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:body-2',
  'group-has-disabled:text-disabled',
  'peer-focus:top-6 peer-focus:translate-y-0 peer-focus:body-4',
  'w-[calc(100%-var(--size-56))] truncate',
);

const labelVariants = cva(baseLabelStyles, {
  variants: {
    status: {
      default: '',
      error: 'text-error',
      success: '',
    },
    floated: {
      true: 'peer-placeholder-shown:top-6 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:body-4',
      false: '',
    },
  },
  defaultVariants: {
    status: 'default',
    floated: false,
  },
});

/**
 * Floating label rendered over the control inside `BaseInput`.
 *
 * @internal
 */
export const BaseInputLabel = ({
  htmlFor,
  status,
  floated,
  className,
  children,
}: BaseInputLabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(labelVariants({ status, floated }), className)}
    >
      {children}
    </label>
  );
};
