import { cn } from '@ledgerhq/lumen-design-core/cn';
import { getPaginationRange } from '@ledgerhq/lumen-utils-shared';
import { useCommonTranslation } from '../../../../translations';
import { ChevronLeft, ChevronRight } from '../../symbols';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import type { PaginationProps } from './types';

/**
 * Pagination navigation for tables and other paginated content.
 *
 * @see [Figma – Pagination](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11768-12849&m=dev)
 *
 * @example
 * <Pagination
 *   page={page}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 */
export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  density = 'expanded',
  className,
  ref,
  ...props
}: PaginationProps) => {
  const { t } = useCommonTranslation();

  if (totalPages <= 0) {
    return null;
  }

  const clampedPage = Math.min(Math.max(page, 1), totalPages);
  const isCompact = density === 'compact';
  const items = isCompact
    ? []
    : getPaginationRange(clampedPage, totalPages, Math.max(siblingCount, 0));

  return (
    <nav
      ref={ref}
      aria-label={t('components.pagination.navigationAriaLabel')}
      className={cn('flex items-center gap-8 overflow-x-auto p-4', className)}
      {...props}
    >
      <IconButton
        type='button'
        icon={ChevronLeft}
        size='sm'
        appearance='gray'
        disabled={clampedPage <= 1}
        aria-label={t('components.pagination.previousPageAriaLabel')}
        onClick={() => onPageChange(clampedPage - 1)}
      />
      {isCompact && (
        <span
          aria-live='polite'
          className='shrink-0 px-4 body-2-semi-bold whitespace-nowrap text-base'
        >
          {t('components.pagination.pageOfTotal', {
            current: clampedPage,
            total: totalPages,
          })}
        </span>
      )}
      {items.map((item) => {
        if (typeof item === 'string') {
          return (
            <span
              key={item}
              aria-hidden
              className='inline-flex w-40 items-center justify-center body-2 text-muted'
            >
              …
            </span>
          );
        }

        const isActive = item === clampedPage;

        return (
          <Button
            key={item}
            type='button'
            size='sm'
            appearance={isActive ? 'gray' : 'no-background'}
            className='shrink-0'
            aria-label={t('components.pagination.pageAriaLabel', {
              page: item,
            })}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        );
      })}
      <IconButton
        type='button'
        icon={ChevronRight}
        size='sm'
        appearance='gray'
        disabled={clampedPage >= totalPages}
        aria-label={t('components.pagination.nextPageAriaLabel')}
        onClick={() => onPageChange(clampedPage + 1)}
      />
    </nav>
  );
};
