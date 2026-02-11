import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import {
  flexRender,
  Row,
  RowData,
  Table as TanstackTable,
} from '@tanstack/react-table';
import {
  TableRoot,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableLoadingRow,
} from '../Table';
import {
  DataTableBodyProps,
  DataTableHeaderProps,
  DataTableProps,
  DataTableRootProps,
} from './types';

// Context stores `any`-typed values because React context cannot be generic
// per-instance. Type safety is enforced at the DataTableRoot public API level.
const [DataTableProvider, useDataTableContext] = createSafeContext<{
  table: TanstackTable<any>;
  appearance: DataTableRootProps['appearance'];
  loading: DataTableRootProps['loading'];
  onScrollBottom: DataTableRootProps['onScrollBottom'];
  onRowClick?: (row: Row<any>) => void;
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
  loading,
  onScrollBottom,
  onRowClick,
  children,
  className,
  ref,
  ...props
}: DataTableRootProps<TData>) => {
  return (
    <DataTableProvider
      value={{ table, appearance, loading, onScrollBottom, onRowClick }}
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
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
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
 * Internal component that auto-renders the table body rows
 * from the TanStack table instance in context.
 */
const DataTableBody = ({ className, ref, ...props }: DataTableBodyProps) => {
  const { table, onRowClick } = useDataTableContext({
    consumerName: 'DataTableBody',
    contextRequired: true,
  });

  const isClickable = Boolean(onRowClick);

  return (
    <TableBody ref={ref} className={className} {...props}>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
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
      ))}
    </TableBody>
  );
};
DataTableBody.displayName = 'DataTableBody';

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
  const { appearance, loading, onScrollBottom } = useDataTableContext({
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
        <DataTableBody />
      </Table>
      <TableLoadingRow />
    </TableRoot>
  );
};
DataTable.displayName = 'DataTable';
