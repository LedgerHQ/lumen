import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Breakpoints } from '../../../types';

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
   * @optional
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
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'table'>;

export type TableHeaderProps = {
  /**
   * The header content (TableHeaderRow)
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'thead'>;

export type TableBodyProps = {
  /**
   * The body content (TableRow)
   */
  children: ReactNode;
  /**
   * @optional
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
   * @optional
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
   * @optional
   */
  className?: string;
  /**
   * Text alignment within the cell
   * @default 'start'
   */
  align?: 'start' | 'end';
} & Omit<ComponentPropsWithRef<'td'>, 'align'>;

export type TableCellItemProps = {
  /**
   * The cell item content. Typically a leading element (spot, icon or
   * crypto-icon) followed by a TableCellContent.
   */
  children: ReactNode;
  /**
   * Alignment of the cell item content.
   * Propagated to TableCellContent and its sub-components via context.
   * @default 'start'
   */
  align?: 'start' | 'end';
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableCellContentProps = {
  /**
   * The content (TableCellContentTitle, TableCellContentDescription,
   * TableCellContentRow).
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableCellContentTitleProps = {
  /**
   * The title content
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableCellContentDescriptionProps = {
  /**
   * The description content
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableCellContentRowProps = {
  /**
   * The row content. Typically a TableCellContentDescription alongside
   * custom trailing content (e.g. a Tag).
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

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
   * @optional
   */
  className?: string;
  /**
   * When true, applies sticky positioning to the header row so it stays
   * visible while scrolling. Sticks to the nearest scrolling ancestor
   * (the table container or the page when used inside a scrollable page).
   * @default true
   */
  stickyHeader?: boolean;
} & ComponentPropsWithRef<'tr'>;

export type TableGroupHeaderRowProps = {
  /**
   * The group header row content (TableHeaderCell)
   */
  children: ReactNode;
  /**
   * @optional
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
   * @optional
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
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableActionBarLeadingProps = {
  /**
   * The leading content (start-aligned actions)
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableActionBarTrailingProps = {
  /**
   * The trailing content (end-aligned actions)
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

export type TableLoadingRowProps = {
  /**
   * @optional
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

export type TableInfoIconProps = {
  /**
   * @optional
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;

export type TableColGroupProps = {
  /**
   * The column definitions (TableCol)
   */
  children: ReactNode;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'colgroup'>;

export type TableColProps = {
  /**
   * Collapses this column's width to 0 when the screen width is below the
   * specified breakpoint. Pair with `hideBelow` on the matching cells so the
   * column is fully removed responsively while keeping its fixed width above
   * the breakpoint.
   */
  hideBelow?: Breakpoints;
  /**
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'col'>;

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
   * @optional
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;
