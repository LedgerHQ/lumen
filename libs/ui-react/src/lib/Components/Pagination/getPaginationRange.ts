export type PaginationRangeItem = number | 'ellipsis';

const FIRST_PAGE = 1;

const SIBLING_SIDES = 2;

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

/** Max page slots before collapsing */
const getMaxVisiblePageSlots = (siblingCount: number): number =>
  siblingCount * SIBLING_SIDES + 5;

/** Page count in the start or end cluster when collapsed */
const getCollapsedClusterPageCount = (siblingCount: number): number =>
  3 + siblingCount * SIBLING_SIDES;

/**
 * Builds the list of page numbers and ellipsis markers to display.
 */
export const getPaginationRange = (
  page: number,
  totalPages: number,
  siblingCount = 1,
): PaginationRangeItem[] => {
  if (totalPages < FIRST_PAGE) {
    return [];
  }

  if (totalPages === FIRST_PAGE) {
    return [FIRST_PAGE];
  }

  if (getMaxVisiblePageSlots(siblingCount) >= totalPages) {
    return range(FIRST_PAGE, totalPages);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, FIRST_PAGE);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);
  const shouldShowLeftEllipsis = leftSiblingIndex > FIRST_PAGE + 1;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - FIRST_PAGE;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const startClusterRange = range(
      FIRST_PAGE,
      getCollapsedClusterPageCount(siblingCount),
    );

    return [...startClusterRange, 'ellipsis', totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const clusterPageCount = getCollapsedClusterPageCount(siblingCount);
    const endClusterRange = range(
      totalPages - clusterPageCount + FIRST_PAGE,
      totalPages,
    );

    return [FIRST_PAGE, 'ellipsis', ...endClusterRange];
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);

    return [FIRST_PAGE, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
  }

  return range(FIRST_PAGE, totalPages);
};
