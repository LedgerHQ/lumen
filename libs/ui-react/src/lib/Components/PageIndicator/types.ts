import { type HTMLAttributes, type Ref } from 'react';

export type PageIndicatorProps = {
  /**
   * The currently active page. 1-based (first page is 1, second is 2, etc.).
   */
  currentPage: number;
  /**
   * The total number of pages to display.
   */
  totalPages: number;
  ref?: Ref<HTMLDivElement>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
