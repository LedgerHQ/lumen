import { ComponentPropsWithRef, ReactNode } from 'react';
import { Breakpoints } from '../../../types';

export type TableRootProps = {
  /**
   * The appearance of the body
   * @default 'no-background'
   */
  appearance?: 'no-background' | 'plain';
  /**
   * The table content (TableHeader, TableBody)
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
  loading?: boolean;
} & ComponentPropsWithRef<'div'>;

export type TableProps = {
  /**
   * The table content (TableHeader, TableBody)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'table'>;

export type TableHeaderProps = {
  /**
   * The header content (TableHeaderRow)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'thead'>;

export type TableBodyProps = {
  /**
   * The body content (TableRow)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'tbody'>;

export type TableRowProps = {
  /**
   * Whether the row is clickable
   * @default false
   */
  clickable?: boolean;
  /**
   * The function to call when the row is clicked
   */
  onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
  /**
   * The row content (TableCell)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'tr'>;

export type TableCellProps = {
  /**
   * Hides this table header cell when the screen width is below the specified breakpoint.
   * Use this to responsively show or hide columns at certain viewport sizes.
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
   * @default 'start'
   */
  align?: 'start' | 'end';
} & Omit<ComponentPropsWithRef<'td'>, 'align'>;

export type TableCellContentProps = {
  /**
   * Text alignment within the cell
   * @default 'start'
   */
  align?: 'start' | 'end';
  /**
   * Custom classname
   */
  className?: string;
  /**
   * The leading content of the cell
   * Typically an spot, icon or crypto-icon.
   */
  leadingContent?: ReactNode;
  /**
   * The title of the cell
   */
  title?: ReactNode;
  /**
   * The description of the cell
   */
  description?: ReactNode;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

export type TableHeaderRowProps = {
  /**
   * The header row content (TableHeaderCell)
   */
  children: ReactNode;
  /**
   * The number of columns to span
   */
  colSpan?: number;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'tr'>;

export type TableGroupHeaderRowProps = {
  /**
   * The group header row content (TableHeaderCell)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Number of columns the group header row should span.
   * This property is mandatory and should match the total number of columns in the table.
   */
  colSpan: number;
} & ComponentPropsWithRef<'tr'>;

export type TableHeaderCellProps = {
  /**
   * Hides this table header cell when the screen width is below the specified breakpoint.
   * Use this to responsively show or hide columns at certain viewport sizes.
   */
  hideBelow?: Breakpoints;
  /**
   * The header cell content. Use TableSortButton for sortable columns; other children are trailing content.
   */
  children?: ReactNode;
  /**
   * The trailing content of the header cell
   * Typically icons or other content, these are shown only on hover.
   */
  trailingContent?: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
  /**
   * Text alignment within the cell
   * @default 'start'
   */
  align?: 'start' | 'end';
  /**
   * Scope of the header cell
   * @default 'col'
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
} & Omit<ComponentPropsWithRef<'th'>, 'align'>;

export type TableActionBarProps = {
  /**
   * The action bar content (TableActionBarLeading, TableActionBarTrailing)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableActionBarLeadingProps = {
  /**
   * The leading content (start-aligned actions)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableActionBarTrailingProps = {
  /**
   * The trailing content (end-aligned actions)
   */
  children: ReactNode;
  /**
   * Custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableLoadingRowProps = {
  /**
   * Custom classname
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

export type TableInfoIconProps = {
  /**
   * Custom classname
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;

export type TableSortValue = 'asc' | 'desc' | undefined;

export type TableSortButtonProps = {
  /**
   * Text and elements alignment within the cell
   */
  align?: 'start' | 'end';
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
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;
