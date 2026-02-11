import React from 'react';

export type PageIndicatorProps = {
  /**
   * The currently active page. 1-based (first page is 1, second is 2, etc.).
   */
  currentPage: number;
  /**
   * The total number of pages to display.
   */
  totalPages: number;
  /**
   * Ref to the page indicator element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;
