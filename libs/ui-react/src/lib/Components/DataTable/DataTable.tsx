import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import {
  flexRender,
  Row,
  RowData,
  Table as TanstackTable,
} from '@tanstack/react-table';
import { Fragment, ReactNode } from 'react';
import {
  TableRoot,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableSortButton,
  TableBody,
  TableRow,
  TableCell,
  TableGroupHeaderRow,
  TableLoadingRow,
} from '../Table';
import {
  DataTableBodyProps,
  DataTableHeaderProps,
  DataTableProps,
  DataTableRootProps,
} from './types';

const [DataTableProvider, useDataTableContext] = createSafeContext<{
  table: TanstackTable<any>;
  appearance: DataTableRootProps['appearance'];
  loading: DataTableRootProps['loading'];
  paginationMode: DataTableRootProps['paginationMode'];
  onScrollBottom: DataTableRootProps['onScrollBottom'];
  onRowClick?: (row: Row<any>) => void;
  groupBy?: (row: Row<any>) => string;
  renderGroupHeader?: (info: { row: Row<any>; count: number }) => ReactNode;
}>('DataTable');

/**
 * Context provider for the DataTable compound.
 * Accepts a TanStack table instance and visual options, then makes them
 * available to `DataTable` and future children like `DataTableActionBar`.
 *
 * @example
 * <DataTableRoot table={table} appearance="plain">
 *   <DataTable />
 * </DataTableRoot>
 */
export const DataTableRoot = <TData extends RowData>({
  table,
  appearance = 'no-background',
  paginationMode = 'none',
  loading = false,
  onScrollBottom,
  onRowClick,
  groupBy,
  renderGroupHeader,
  children,
  className,
  ref,
  ...props
}: DataTableRootProps<TData>) => {
  return (
    <DataTableProvider
      value={{
        paginationMode,
        table,
        appearance,
        loading,
        onScrollBottom,
        onRowClick,
        groupBy,
        renderGroupHeader,
      }}
    >
      <div ref={ref} className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </DataTableProvider>
  );
};
DataTableRoot.displayName = 'DataTableRoot';

/**
 * Internal component that auto-renders the table header groups
 * from the TanStack table instance in context.
 */
const DataTableHeader = ({
  className,
  ref,
  ...props
}: DataTableHeaderProps) => {
  const { table } = useDataTableContext({
    consumerName: 'DataTableHeader',
    contextRequired: true,
  });

  return (
    <TableHeader ref={ref} className={className} {...props}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableHeaderRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta;
            return (
              <TableHeaderCell
                key={header.id}
                align={meta?.align}
                hideBelow={meta?.hideBelow}
                className={meta?.className}
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <TableSortButton
                    sortDirection={header.column.getIsSorted() || undefined}
                    onClick={header.column.getToggleSortingHandler()}
                    align={meta?.align}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableSortButton>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </TableHeaderCell>
            );
          })}
        </TableHeaderRow>
      ))}
    </TableHeader>
  );
};
DataTableHeader.displayName = 'DataTableHeader';

/**
 * Renders the full table (header + body) from the TanStack table instance
 * provided by `DataTableRoot`. Internally composes the pure-UI Table building blocks.
 *
 * @example
 * <DataTableRoot table={table}>
 *   <DataTable />
 * </DataTableRoot>
 */
export const DataTable = ({ className, ref, ...props }: DataTableProps) => {
  const { appearance, paginationMode, loading, onScrollBottom, groupBy } =
    useDataTableContext({
      consumerName: 'DataTable',
      contextRequired: true,
    });

  return (
    <TableRoot
      ref={ref}
      appearance={appearance}
      loading={loading}
      onScrollBottom={onScrollBottom}
      className={className}
      {...props}
    >
      <Table>
        <DataTableHeader />
        {groupBy ? <DataTableGroupedBody /> : <DataTableBody />}
      </Table>
      {paginationMode === 'infinite-scroll' && <TableLoadingRow />}
    </TableRoot>
  );
};
DataTable.displayName = 'DataTable';

/**
 * Internal component that auto-renders the table body rows
 * from the TanStack table instance in context.
 */
const DataTableBody = ({ className, ref, ...props }: DataTableBodyProps) => {
  const { table } = useDataTableContext({
    consumerName: 'DataTableBody',
    contextRequired: true,
  });

  return (
    <TableBody ref={ref} className={className} {...props}>
      {table.getRowModel().rows.map((row) => (
        <DataTableRow key={row.id} row={row} />
      ))}
    </TableBody>
  );
};
DataTableBody.displayName = 'DataTableBody';

type RowGroup<TData> = {
  key: string;
  rows: Row<TData>[];
  count: number;
};

/**
 * Groups an array of rows by a key extracted via `getGroupKey`.
 * Data must be pre-sorted by the grouping field; consecutive rows
 * with the same key are placed into the same group.
 */
const groupRows = <TData,>(
  rows: Row<TData>[],
  getGroupKey: (row: Row<TData>) => string,
): RowGroup<TData>[] => {
  const groups: RowGroup<TData>[] = [];
  let current: RowGroup<TData> | null = null;

  for (const row of rows) {
    const key = getGroupKey(row);
    if (!current || current.key !== key) {
      current = { key, rows: [], count: 0 };
      groups.push(current);
    }
    current.rows.push(row);
    current.count++;
  }

  return groups;
};

/**
 * Internal component that renders table body rows with group separator headers.
 * Data must be pre-sorted by the grouping field.
 */
const DataTableGroupedBody = ({
  className,
  ref,
  ...props
}: DataTableBodyProps) => {
  const { table, groupBy, renderGroupHeader } = useDataTableContext({
    consumerName: 'DataTableGroupedBody',
    contextRequired: true,
  });

  const groups = groupRows(table.getRowModel().rows, groupBy!);

  return (
    <TableBody ref={ref} className={className} {...props}>
      {groups.map((group) => (
        <Fragment key={group.key}>
          <TableGroupHeaderRow colSpan={group.rows[0].getVisibleCells().length}>
            {renderGroupHeader
              ? renderGroupHeader({ row: group.rows[0], count: group.count })
              : group.key}
          </TableGroupHeaderRow>
          {group.rows.map((row) => (
            <DataTableRow key={row.id} row={row} />
          ))}
        </Fragment>
      ))}
    </TableBody>
  );
};
DataTableGroupedBody.displayName = 'DataTableGroupedBody';

/**
 * Leaf component that renders a single data row (click handling + cells).
 */
const DataTableRow = ({ row }: { row: Row<RowData> }) => {
  const { onRowClick } = useDataTableContext({
    consumerName: 'DataTableRow',
    contextRequired: true,
  });
  const isClickable = Boolean(onRowClick);

  return (
    <TableRow
      clickable={isClickable}
      onClick={isClickable ? () => onRowClick?.(row) : undefined}
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;
        return (
          <TableCell
            key={cell.id}
            align={meta?.align}
            hideBelow={meta?.hideBelow}
            className={meta?.className}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
DataTableRow.displayName = 'DataTableRow';
