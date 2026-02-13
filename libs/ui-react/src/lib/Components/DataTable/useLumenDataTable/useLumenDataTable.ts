import {
  getCoreRowModel,
  getSortedRowModel,
  TableOptions,
  Table,
  useReactTable,
} from '@tanstack/react-table';
// Side-effect import: ensures the ColumnMeta module augmentation is in scope
import '../types';

type UseLumenDataTableOptions<TData> = Omit<
  TableOptions<TData>,
  'getCoreRowModel' | 'getSortedRowModel'
> & {
  /**
   * Override the default getCoreRowModel if needed.
   * @default getCoreRowModel()
   */
  getCoreRowModel?: TableOptions<TData>['getCoreRowModel'];
  /**
   * Override the default getSortedRowModel if needed.
   * @default getSortedRowModel()
   */
  getSortedRowModel?: TableOptions<TData>['getSortedRowModel'];
};

/**
 * Hook wrapping TanStack's `useReactTable` with opinionated defaults.
 *
 * - Injects `getCoreRowModel` automatically.
 * - Injects `getSortedRowModel` automatically for client-side sorting.
 * - Returns the TanStack `Table` instance.
 *
 * @example
 * const table = useLumenDataTable({
 *   data,
 *   columns: [
 *     { accessorKey: 'name', header: 'Name' },
 *     { accessorKey: 'price', header: 'Price', meta: { align: 'end' } },
 *   ],
 * });
 */
export const useLumenDataTable = <TData>(
  options: UseLumenDataTableOptions<TData>,
): Table<TData> => {
  return useReactTable<TData>({
    ...options,
    enableSorting: options.enableSorting || false,
    getCoreRowModel: options.getCoreRowModel ?? getCoreRowModel(),
    getSortedRowModel: options.getSortedRowModel ?? getSortedRowModel(),
  });
};
