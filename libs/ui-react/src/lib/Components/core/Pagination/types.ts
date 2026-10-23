import type { Density } from '@ledgerhq/lumen-utils-shared';
import type { ComponentPropsWithRef } from 'react';

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
   * "current of total" label, for tight spaces such as table footers.
   * @default 'expanded'
   */
  density?: Density;
  /**
   * Custom classname for the root nav element.
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'nav'>, 'children'>;
