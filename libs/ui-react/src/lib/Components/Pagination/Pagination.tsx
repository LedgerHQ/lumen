import { cn } from '@ledgerhq/lumen-utils-shared';
import { useCommonTranslation } from '../../../i18n';
import { ChevronLeft, ChevronRight } from '../../Symbols';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { getPaginationRange } from './getPaginationRange';
import type { PaginationProps } from './types';

/**
 * Pagination navigation for tables and other paginated content.
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
  className,
  ref,
  ...props
}: PaginationProps) => {
  const { t } = useCommonTranslation();

  if (totalPages <= 0) {
    return null;
  }

  const clampedPage = Math.min(Math.max(page, 1), totalPages);
  const clampedSiblingCount = Math.max(siblingCount, 0);
  const items = getPaginationRange(
    clampedPage,
    totalPages,
    clampedSiblingCount,
  );

  return (
    <nav
      ref={ref}
      aria-label={t('components.pagination.navigationAriaLabel')}
      className={cn('flex items-center gap-8 overflow-x-auto p-4', className)}
      {...props}
    >
      <IconButton
        icon={ChevronLeft}
        size='sm'
        appearance='gray'
        disabled={clampedPage <= 1}
        aria-label={t('components.pagination.previousPageAriaLabel')}
        onClick={() => onPageChange(clampedPage - 1)}
      />
      {items.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
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
