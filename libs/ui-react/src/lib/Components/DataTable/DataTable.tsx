import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { flexRender } from '@tanstack/react-table';
import { forwardRef } from 'react';
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

const [DataTableProvider, useDataTableContext] = createSafeContext<{
  table: DataTableRootProps['table'];
  appearance: DataTableRootProps['appearance'];
  loading: DataTableRootProps['loading'];
  onScrollBottom: DataTableRootProps['onScrollBottom'];
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
export const DataTableRoot = forwardRef<HTMLDivElement, DataTableRootProps>(
  (
    {
      table,
      appearance = 'no-background',
      loading,
      onScrollBottom,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <DataTableProvider value={{ table, appearance, loading, onScrollBottom }}>
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {children}
        </div>
      </DataTableProvider>
    );
  },
);
DataTableRoot.displayName = 'DataTableRoot';

/**
 * Internal component that auto-renders the table header groups
 * from the TanStack table instance in context.
 */
const DataTableHeader = forwardRef<
  HTMLTableSectionElement,
  DataTableHeaderProps
>(({ className, ...props }, ref) => {
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
});
DataTableHeader.displayName = 'DataTableHeader';

/**
 * Internal component that auto-renders the table body rows
 * from the TanStack table instance in context.
 */
const DataTableBody = forwardRef<HTMLTableSectionElement, DataTableBodyProps>(
  ({ className, ...props }, ref) => {
    const { table } = useDataTableContext({
      consumerName: 'DataTableBody',
      contextRequired: true,
    });

    return (
      <TableBody ref={ref} className={className} {...props}>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
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
  },
);
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
export const DataTable = forwardRef<HTMLDivElement, DataTableProps>(
  ({ className, ...props }, ref) => {
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
  },
);
DataTable.displayName = 'DataTable';
