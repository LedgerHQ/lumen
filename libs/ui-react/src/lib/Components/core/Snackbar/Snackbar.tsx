import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { useCommonTranslation } from '../../../../i18n';
import {
  CheckmarkCircleFill,
  Close,
  DeleteCircleFill,
  WarningFill,
} from '../../symbols';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Spinner } from '../Spinner';
import type { SnackbarAppearance, SnackbarProps } from './types';

const statusIconMap: Record<Exclude<SnackbarAppearance, 'info'>, ReactNode> = {
  success: <CheckmarkCircleFill size={20} className='text-success' />,
  warning: <WarningFill size={20} className='text-warning' />,
  error: <DeleteCircleFill size={20} className='text-error' />,
};

const snackbarVariants = cva(
  'flex min-h-56 w-400 max-w-full items-center gap-8 rounded-md bg-interactive py-8 pr-10 text-on-interactive',
  {
    variants: {
      hasLeading: {
        true: 'pl-12',
        false: 'pl-16',
      },
    },
  },
);

/**
 * A single snackbar item: an inverted, compact surface with a status icon or
 * spinner, a one-line title, an optional trailing action and a close button.
 *
 * This is the presentational piece. For the queue, timing and imperative API,
 * use `SnackbarProvider` + `useSnackbar`.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-snackbar--docs Guidelines}
 *
 * @example
 * import { Snackbar } from '@ledgerhq/lumen-ui-react';
 *
 * <Snackbar appearance="success" title="Payment done" onClose={() => {}} />
 *
 * @example
 * // Loading with an action
 * <Snackbar
 *   loading
 *   title="Uploading…"
 *   action={{ label: 'Cancel', onAction: () => {} }}
 * />
 */
export const Snackbar = ({
  ref,
  appearance = 'info',
  loading = false,
  title,
  action,
  onClose,
  closeAriaLabel,
  className,
  role,
  ...props
}: SnackbarProps) => {
  const { t } = useCommonTranslation();

  const hasLeading = loading || appearance !== 'info';
  const resolvedRole =
    role ??
    (appearance === 'error' || appearance === 'warning' ? 'alert' : 'status');

  return (
    <div
      ref={ref}
      role={resolvedRole}
      className={cn(snackbarVariants({ hasLeading }), className)}
      {...props}
    >
      {loading ? (
        <Spinner size={20} className='shrink-0 text-on-interactive' />
      ) : (
        appearance !== 'info' && (
          <span className='flex shrink-0'>{statusIconMap[appearance]}</span>
        )
      )}
      <p className='min-w-0 flex-1 truncate body-2'>{title}</p>
      {action && (
        <Button
          appearance='base'
          size='sm'
          className='shrink-0 text-on-interactive'
          onClick={action.onAction}
        >
          {action.label}
        </Button>
      )}
      {onClose && (
        <IconButton
          appearance='base'
          size='sm'
          className='shrink-0'
          icon={Close}
          onClick={() => onClose()}
          aria-label={closeAriaLabel || t('components.snackbar.closeAriaLabel')}
        />
      )}
    </div>
  );
};
