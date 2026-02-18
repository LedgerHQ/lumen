import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  TableOptions,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import '../types';

type UseLumenDataTableOptions<TData> = Omit<
  TableOptions<TData>,
  'getCoreRowModel' | 'getSortedRowModel' | 'getFilteredRowModel'
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
  /**
   * Override the default getFilteredRowModel if needed.
   * @default getFilteredRowModel()
   */
  getFilteredRowModel?: TableOptions<TData>['getFilteredRowModel'];
};

/**
 * Hook wrapping TanStack's `useReactTable` with opinionated defaults.
 *
 * - Injects `getCoreRowModel` automatically.
 * - Injects `getFilteredRowModel` automatically for client-side filtering.
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
    getCoreRowModel: options.getCoreRowModel ?? getCoreRowModel(),
    getFilteredRowModel: options.getFilteredRowModel ?? getFilteredRowModel(),
    getSortedRowModel: options.getSortedRowModel ?? getSortedRowModel(),
  });
};
