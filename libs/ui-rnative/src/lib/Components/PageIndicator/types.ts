import { BoxProps } from '../Utility';

export type PageIndicatorProps = {
  currentPage: number;
  totalPages: number;
} & Omit<BoxProps, 'children'>;
