import type { Breakpoint } from '@ledgerhq/lumen-design-core';
import type { Row, RowData, Table } from '@tanstack/react-table';
import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import type { PaginationProps } from '../Pagination/types';
import type { TableRootProps, TableRowProps } from '../Table/types';

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
  hideBelow?: Breakpoint;
  /**
   * Custom className applied to the `<col>` element (for width tokens such as `w-144`)
   * and to each cell in this column including the header cell.
   */
  className?: string;
  /**
   * Trailing content rendered in the header cell for additional content.
   * Shown only on hover.
   */
  headerTrailingContent?: ReactNode;
};

// Module augmentation so TanStack's ColumnMeta is typed with our properties.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
  interface ColumnMeta<TData extends RowData, TValue> extends LumenColumnMeta {}
}

export type DataTableRowProps = Omit<
  TableRowProps,
  | 'children'
  | 'clickable'
  | 'dangerouslySetInnerHTML'
  | 'onClick'
  | 'onClickCapture'
  | 'role'
> &
  Record<`data-${string}`, string | number | boolean | undefined>;

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
   * When true, more rows are being fetched: shows the loading row (with
   * `onScrollBottom`) or the `DataTableShowMore` loading state, and disables
   * `onScrollBottom` to prevent duplicate fetches.
   */
  loading?: boolean;
  /**
   * What shows at the bottom of the table while `loading` is true and
   * `onScrollBottom` is set. An element is rendered as-is below the rows,
   * without the default loading row wrapper, so it owns its own layout.
   * @default 'spinner'
   */
  loadingIndicator?: 'spinner' | 'none' | ReactElement;
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
   * When true, hides the header section.
   * @default false
   */
  hideHeader?: boolean;
  /**
   * When true, applies sticky positioning to the header so it stays
   * visible while scrolling. Sticks to the table scroll container, not the
   * page: constrain the `DataTable` height (e.g. `max-h-480`) for the header
   * to stick while scrolling vertically.
   * @default true
   */
  stickyHeader?: boolean;
  /**
   * How the table handles columns that don't fit the container width.
   * See `TableRoot` `horizontalLayout`.
   * @default { type: 'shrink' }
   */
  horizontalLayout?: TableRootProps['horizontalLayout'];
  /**
   * Callback fired when a row is clicked.
   * Return the data of the given row from the callback function.
   * @default undefined
   */
  onRowClick?: (row: Row<TData>) => void;
  /**
   * Returns native props to apply to a rendered data row.
   * @default undefined
   */
  getRowProps?: (row: Row<TData>) => DataTableRowProps | undefined;
  /**
   * Extracts a group key from a row. When provided, rows are visually
   * separated by group header rows whenever the key changes.
   * Data must be pre-sorted by the grouping field.
   * @default undefined
   */
  groupBy?: (row: Row<TData>) => string;
  /**
   * Custom renderer for group header content.
   * Receives the first row of the group and the number of rows in the group.
   * When omitted, defaults to rendering the group key string.
   * @default undefined
   */
  renderGroupHeader?: (info: { row: Row<TData>; count: number }) => ReactNode;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

export type DataTableProps = {
  /**
   * Custom className for the scrollable table container (TableRoot).
   */
  className?: string;
  /**
   * Content rendered at the bottom of the scroll container, after the rows
   * (e.g. `DataTableShowMore`).
   */
  children?: ReactNode;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

/**
 * Requires paginated table state: `getPaginationRowModel` for client-side data,
 * or `manualPagination` with `rowCount` for server-side data.
 */
export type DataTablePaginationProps = Omit<
  PaginationProps,
  'page' | 'totalPages' | 'onPageChange'
>;

// Server-side rows accumulate outside TanStack pagination, so `getCanNextPage()`
// can't tell whether the server has more: `hasMore` is required with `onShowMore`.
type DataTableShowMoreModeProps =
  | {
      /**
       * Number of rows added per click.
       * @default the page size when the button first renders
       */
      step?: number;
      onShowMore?: never;
      /**
       * Whether more rows can be shown. The button is not rendered when false.
       * @default table.getCanNextPage()
       */
      hasMore?: boolean;
    }
  | {
      step?: never;
      /**
       * Server-side mode: called on click instead of growing the page size.
       * The loading state comes from `DataTableRoot`'s `loading` prop.
       */
      onShowMore: () => void;
      /**
       * Whether the server has more rows. The button is not rendered when false.
       */
      hasMore: boolean;
    };

export type DataTableShowMoreProps = DataTableShowMoreModeProps & {
  /**
   * Button label.
   * @default 'Show more' (translated)
   */
  children?: ReactNode;
  /**
   * Custom className for the wrapper.
   */
  className?: string;
};

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
