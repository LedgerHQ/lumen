import { Row, RowData, Table } from '@tanstack/react-table';
import { ComponentPropsWithRef, ReactNode } from 'react';
import { Breakpoints } from '../../../types';
import { TableRootProps } from '../Table/types';

/**
 * Lumen-specific column metadata that extends TanStack's ColumnMeta.
 * These properties are picked up by DataTable's auto-rendering logic.
 */
export type LumenColumnMeta = {
  /**
   * Text alignment within the column cells and header.
   * @default 'start'
   */
  align?: 'start' | 'end';
  /**
   * Hides the column when the screen width is below the specified breakpoint.
   */
  hideBelow?: Breakpoints;
  /**
   * Custom className applied to each cell in this column.
   */
  className?: string;
};

// Module augmentation so TanStack's ColumnMeta is typed with our properties.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
  interface ColumnMeta<TData extends RowData, TValue> extends LumenColumnMeta {}
}

export type DataTableRootProps<TData extends RowData = RowData> = {
  /**
   * The TanStack table instance returned by `useLumenDataTable`.
   */
  table: Table<TData>;
  /**
   * The appearance of the table.
   * @default 'no-background'
   */
  appearance?: TableRootProps['appearance'];
  /**
   * The pagination mode of the table.
   * @default 'none'
   */
  paginationMode?: 'infinite-scroll' | 'pagination' | 'none';
  /**
   * When true, displays loading indicator and disables onScrollBottom.
   */
  loading?: boolean;
  /**
   * Callback fired when scroll reaches the bottom of the table container.
   */
  onScrollBottom?: () => void;
  /**
   * Content rendered inside the DataTableRoot (e.g. DataTableActionBar, DataTable).
   */
  children: ReactNode;
  /**
   * Custom className for the root wrapper.
   */
  className?: string;
  /**
   * Callback fired when a row is clicked.
   * Return the data of the given row from the callback function.
   */
  onRowClick?: (row: Row<TData>) => void;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

export type DataTableProps = {
  /**
   * Custom className for the scrollable table container (TableRoot).
   */
  className?: string;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

export type DataTableHeaderProps = {
  /**
   * Custom className for the header section.
   */
  className?: string;
} & ComponentPropsWithRef<'thead'>;

export type DataTableBodyProps = {
  /**
   * Custom className for the body section.
   */
  className?: string;
} & ComponentPropsWithRef<'tbody'>;
