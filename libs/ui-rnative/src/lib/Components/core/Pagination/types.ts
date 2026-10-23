import type { Density } from '@ledgerhq/lumen-utils-shared';
import type { StyledViewProps } from '../../../../styles';

export type PaginationProps = {
  /**
   * Current page, 1-indexed.
   */
  page: number;
  /**
   * Total number of pages.
   * If `<= 0`, the component returns `null`.
   */
  totalPages: number;
  /**
   * Callback fired when the user selects a different page.
   */
  onPageChange: (page: number) => void;
  /**
   * Number of page buttons shown on each side of the current page.
   * @default 1
   */
  siblingCount?: number;
  /**
   * The density of the pagination. Compact replaces the page buttons with a
   * "current of total" label, for tight spaces such as narrow screens.
   * @default 'expanded'
   */
  density?: Density;
} & Omit<StyledViewProps, 'children'>;
