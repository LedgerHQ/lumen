import { HTMLAttributes } from 'react';

export type PageIndicatorProps = {
  /**
   * The currently active page index. 0-based (first page is 0, second is 1, etc.).
   */
  currentPage: number;
  /**
   * The total number of pages to display.
   */
  totalPages: number;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
