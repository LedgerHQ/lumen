import {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import { Breakpoints } from '../../../types';

export type TableRootProps = {
  /**
   * The appearance of the body
   * @default 'no-background'
   */
  appearance?: 'no-background' | 'plain';
  /**
   * The table content (TableHead, TableBody)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Callback fired when scroll reaches the bottom of the table container.
   * Useful for implementing infinite scroll or pagination.
   */
  onScrollBottom?: () => void;
  /**
   * When true, disables onScrollBottom to prevent duplicate fetches.
   * Use this while data is being loaded.
   */
  isLoading?: boolean;
} & TableHTMLAttributes<HTMLDivElement>;

export type TableProps = {
  /**
   * The table content (TableHead, TableBody)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableElement>;

export type TableHeadProps = {
  /**
   * The header content (TableHeaderRow)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableSectionElement>;

export type TableBodyProps = {
  /**
   * The body content (TableRow)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableSectionElement>;

export type TableRowProps = {
  /**
   * Whether the row is clickable
   * @default false
   */
  clickable?: boolean;
  /**
   * The function to call when the row is clicked
   */
  onClick?: () => void;
  /**
   * The row content (TableCell)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableRowElement>;

export type TableCellProps = {
  /**
   * Hide the cell below a specific breakpoint
   */
  hideBelow?: Breakpoints;
  /**
   * The cell content
   */
  children?: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Text alignment within the cell
   */
  align?: 'left' | 'right';
} & TdHTMLAttributes<HTMLTableCellElement>;

export type TableCellContentProps = {
  /**
   * Text alignment within the cell
   */
  align?: 'left' | 'right';
  /**
   * The cell content
   */
  children?: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * The leading content of the cell
   * Typically an spot, icon or crypto-icon.
   */
  leading?: ReactNode;
  /**
   * The title of the cell
   */
  title?: ReactNode;
  /**
   * The description of the cell
   */
  description?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export type TableHeaderRowProps = {
  /**
   * The header row content (TableHeaderCell)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLTableRowElement>;

export type TableHeaderCellProps = {
  /**
   * Hide the cell below a specific breakpoint
   */
  hideBelow?: Breakpoints;
  /**
   * The header cell content. Use TableHeaderCellSort for sortable columns; other children are trailing content.
   */
  children?: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Text alignment within the cell
   */
  align?: 'left' | 'right';
  /**
   * Scope of the header cell
   * @default 'col'
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
} & ThHTMLAttributes<HTMLTableCellElement>;

export type TableActionBarProps = {
  /**
   * The action bar content (TableActionBarLeading, TableActionBarTrailing)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TableActionBarLeadingProps = {
  /**
   * The leading content (left-aligned actions)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TableActionBarTrailingProps = {
  /**
   * The trailing content (right-aligned actions)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TableLoadingRowProps = {
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type TableInfoIconProps = {
  /**
   * Custom classname
   */
  className?: string;
} & HTMLAttributes<HTMLButtonElement>;

export type TableSortValue = 'asc' | 'desc' | undefined;

export type TableSortButtonProps = {
  /**
   * Text and elements alignment within the cell
   */
  align?: 'left' | 'right';
  /**
   * The column label (e.g. "Name", "Amount")
   */
  children: ReactNode;
  /**
   * Current sort direction
   */
  sortDirection?: TableSortValue;
  /**
   * Callback fired when the sort control is clicked
   */
  onToggleSort?: (sort: TableSortValue) => void;
  /**
   * Custom classname
   */
  className?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'children'>;
