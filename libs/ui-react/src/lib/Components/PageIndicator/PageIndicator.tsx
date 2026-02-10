import { cn } from '@ledgerhq/lumen-utils-shared';
import { useCallback, useEffect, useMemo, useRef, forwardRef } from 'react';
import { PageIndicatorProps } from './types';

const MAX_VISIBLE_DOTS = 4;
const DOT_SIZE_PX = 6;
const GAP_PX = 4;
const DOT_WIDTH = DOT_SIZE_PX + GAP_PX;
const ANIMATION_MS = 200;

type PageIndicatorDotProps = {
  isActive: boolean;
  isShrunk: boolean;
};

const PageIndicatorDot = ({ isActive, isShrunk }: PageIndicatorDotProps) => {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full transition-all duration-200',
        isActive ? 'bg-muted-strong' : 'bg-muted',
        isShrunk ? 'size-4' : 'size-6',
      )}
    />
  );
};

type UsePageIndicatorParams = {
  currentPage: number;
  totalPages: number;
};

const usePageIndicator = ({
  currentPage,
  totalPages,
}: UsePageIndicatorParams) => {
  const prevPage = useRef(currentPage);
  const direction = currentPage > prevPage.current ? 'forward' : 'backward';

  useEffect(() => {
    prevPage.current = currentPage;
  }, [currentPage]);

  const forwardAnchor = MAX_VISIBLE_DOTS - 2;
  const backwardAnchor = 1;
  const anchorIndex = direction === 'forward' ? forwardAnchor : backwardAnchor;
  const lastPage = totalPages - 1;
  const visibleDots = Math.min(totalPages, MAX_VISIBLE_DOTS);

  const offset = Math.max(
    0,
    Math.min(currentPage - anchorIndex, lastPage - (visibleDots - 1)),
  );

  const viewportWidth = visibleDots * DOT_SIZE_PX + (visibleDots - 1) * GAP_PX;
  const translateX = -offset * DOT_WIDTH;

  const firstVisibleIndex = offset;
  const lastVisibleIndex = offset + visibleDots - 1;

  const isActive = useCallback(
    (index: number): boolean => index === currentPage,
    [currentPage],
  );

  const isShrunk = useCallback(
    (index: number): boolean => {
      if (totalPages <= MAX_VISIBLE_DOTS) return false;
      if (
        (index === firstVisibleIndex && firstVisibleIndex > 0) ||
        (index === lastVisibleIndex && lastVisibleIndex < totalPages - 1)
      ) {
        return true;
      }
      return false;
    },
    [totalPages, firstVisibleIndex, lastVisibleIndex],
  );

  return {
    viewportWidth,
    translateX,
    isActive,
    isShrunk,
  };
};

/**
 * A page indicator component that shows the current position within a set of pages (e.g. carousel or onboarding).
 *
 * Renders a row of dots: the active dot is highlighted, and when there are more pages than visible dots,
 * edge dots shrink and the strip scrolls to keep the current page in view.
 */
export const PageIndicator = forwardRef<HTMLDivElement, PageIndicatorProps>(
  ({ currentPage, totalPages, className, ...props }, ref) => {
    const currentPageIndex = Math.max(
      0,
      Math.min(totalPages - 1, currentPage - 1),
    );
    const { viewportWidth, translateX, isActive, isShrunk } = usePageIndicator({
      currentPage: currentPageIndex,
      totalPages,
    });

    const dotIndexes = useMemo(
      () => Array.from({ length: totalPages }, (_, i) => i),
      [totalPages],
    );

    return (
      <div
        ref={ref}
        role='none'
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <div
          className='flex flex-row items-center overflow-hidden'
          style={{ width: viewportWidth }}
        >
          <div
            className='flex flex-row items-center gap-4'
            style={{
              transform: `translateX(${translateX}px)`,
              transition: `transform ${ANIMATION_MS}ms ease-out`,
            }}
          >
            {dotIndexes.map((index) => (
              <PageIndicatorDot
                key={index}
                isActive={isActive(index)}
                isShrunk={isShrunk(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);

PageIndicator.displayName = 'PageIndicator';
