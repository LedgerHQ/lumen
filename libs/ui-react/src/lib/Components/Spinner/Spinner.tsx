import { cn } from '@ledgerhq/lumen-utils-shared';
import { useCommonTranslation } from '../../../i18n';
import { SpinnerProps } from './types';

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
}: SpinnerProps & {
  ref?: React.Ref<SVGSVGElement>;
}) => {
  const { t } = useCommonTranslation();
  return (
    <svg
      className={cn('shrink-0 animate-spin text-base', className)}
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
        strokeWidth={1.5}
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  );
};
