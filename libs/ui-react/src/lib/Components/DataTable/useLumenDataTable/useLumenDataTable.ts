import {
  getCoreRowModel,
  TableOptions,
  Table,
  useReactTable,
} from '@tanstack/react-table';
// Side-effect import: ensures the ColumnMeta module augmentation is in scope
import '../types';

type UseLumenDataTableOptions<TData> = Omit<
  TableOptions<TData>,
  'getCoreRowModel'
> & {
  /**
   * Override the default getCoreRowModel if needed.
   * @default getCoreRowModel()
   */
  getCoreRowModel?: TableOptions<TData>['getCoreRowModel'];
};

/**
 * Hook wrapping TanStack's `useReactTable` with opinionated defaults.
 *
 * - Injects `getCoreRowModel` automatically.
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
  });
};
