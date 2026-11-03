import { cn } from '@ledgerhq/lumen-design-core/cn';
import { cva } from 'class-variance-authority';
import { useCommonTranslation } from '../../../../translations';
import type { SpinnerProps } from './types';

const spinnerVariants = cva('shrink-0 animate-spin text-base', {
  variants: {
    size: {
      12: 'spinner-stroke-12',
      16: 'spinner-stroke-16',
      20: 'spinner-stroke-20',
      24: 'spinner-stroke-24',
      32: 'spinner-stroke-32',
      40: 'spinner-stroke-40',
      48: 'spinner-stroke-48',
      56: 'spinner-stroke-56',
    },
  },
  defaultVariants: {
    size: 16,
  },
});

/**
 * A basic spinner component for loading states.
 *
 * @example
 * <Spinner />
 */
export const Spinner = ({
  ref,
  className,
  size = 16,
  ...props
}: SpinnerProps) => {
  const { t } = useCommonTranslation();
  return (
    <svg
      className={cn(spinnerVariants({ size }), className)}
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 16 16'
      fill='none'
      aria-label={t('components.spinner.loadingAriaLabel')}
      role='img'
      ref={ref}
      {...props}
    >
      <path
        d='M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8'
        stroke='currentColor'
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  );
};
