import { cva } from 'class-variance-authority';
import {
  CheckmarkCircleFill,
  DeleteCircleFill,
  InformationFill,
} from '../../symbols';
import type { BaseInputHelperTextProps } from './types';

const helperVariants = cva('flex items-center gap-2 body-3', {
  variants: {
    status: {
      default: 'text-muted',
      error: 'text-error',
      success: 'text-success',
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

/**
 * Hint, error or success copy rendered below the control inside `BaseInput`.
 *
 * @internal
 */
export const BaseInputHelperText = ({
  id,
  helperText,
  status,
}: BaseInputHelperTextProps) => {
  return (
    <div
      id={id}
      className={helperVariants({ status })}
      role={status === 'error' ? 'alert' : undefined}
    >
      {!status && <InformationFill size={16} className='text-muted' />}
      {status === 'error' && (
        <DeleteCircleFill size={16} className='text-error' />
      )}
      {status === 'success' && (
        <CheckmarkCircleFill size={16} className='text-success' />
      )}
      <span className='body-3'>{helperText}</span>
    </div>
  );
};
