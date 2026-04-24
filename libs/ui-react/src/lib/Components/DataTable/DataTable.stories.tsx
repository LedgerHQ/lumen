import type { Meta, StoryObj } from '@storybook/react-vite';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Android } from '../../Symbols';
import { Button } from '../Button/Button';
import { MediaButton } from '../MediaButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectTrigger,
} from '../Select';
import { Skeleton } from '../Skeleton/Skeleton';
import { Spot } from '../Spot';
import {
  TableActionBar,
  TableActionBarLeading,
  TableActionBarTrailing,
  TableCellContent,
  TableInfoIcon,
} from '../Table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import {
  DataTableRoot,
  DataTable,
  DataTableGlobalSearchInput,
} from './DataTable';
import { useLumenDataTable } from './useLumenDataTable/useLumenDataTable';

type CryptoAsset = {
  name: string;
  symbol: string;
  price: string;
  change: string;
  category: string;
};

const largeData: CryptoAsset[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$43,250.00',
    change: '+2.5%',
    category: 'Layer One',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,650.00',
    change: '+1.8%',
    category: 'Layer One',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$98.50',
    change: '-0.5%',
    category: 'Layer One',
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    price: '$0.52',
    change: '+3.2%',
    category: 'Layer Two',
  },
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: '$0.08',
    change: '-1.2%',
    category: 'Layer Two',
  },
  {
    name: 'Ripple',
    symbol: 'XRP',
    price: '$0.32',
    change: '+0.8%',
    category: 'Layer Two',
  },
  {
    name: 'Litecoin',
    symbol: 'LTC',
    price: '$120.00',
    change: '+0.3%',
    category: 'Layer Two',
  },
  {
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    price: '$350.00',
    change: '+1.1%',
    category: 'Layer Three',
  },
  {
    name: 'EOS',
    symbol: 'EOS',
    price: '$2.10',
    change: '-0.7%',
    category: 'Layer Three',
  },
  {
    name: 'Tron',
    symbol: 'TRX',
    price: '$0.06',
    change: '+0.5%',
    category: 'Layer Three',
  },
  {
    name: 'Bitcoin SV',
    symbol: 'BSV',
    price: '$100.00',
    change: '+0.2%',
    category: 'Layer Three',
  },
  {
    name: 'Stellar',
    symbol: 'XLM',
    price: '$0.12',
    change: '-0.3%',
    category: 'Infrastructure',
  },
  {
    name: 'Polkadot',
    symbol: 'DOT',
    price: '$10.00',
    change: '+0.1%',
    category: 'Infrastructure',
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    price: '$15.00',
    change: '+0.2%',
    category: 'DeFi',
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    price: '$12.00',
    change: '+0.3%',
    category: 'DeFi',
  },
  {
    name: 'Aave',
    symbol: 'AAVE',
    price: '$100.00',
    change: '+0.4%',
    category: 'DeFi',
  },
  {
    name: 'Sushi',
    symbol: 'SUSHI',
    price: '$100.00',
    change: '+0.5%',
    category: 'DeFi',
  },
  {
    name: 'Yearn',
    symbol: 'YFI',
    price: '$100.00',
    change: '+0.6%',
    category: 'DeFi',
  },
  {
    name: 'Maker',
    symbol: 'MKR',
    price: '$100.00',
    change: '+0.7%',
    category: 'DeFi',
  },
  {
    name: 'Compound',
    symbol: 'COMP',
    price: '$100.00',
    change: '+0.8%',
    category: 'DeFi',
  },
];

const data: CryptoAsset[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$43,250.00',
    change: '+2.5%',
    category: 'Layer One',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,650.00',
    change: '+1.8%',
    category: 'Layer One',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$98.50',
    change: '-0.5%',
    category: 'Layer One',
  },
];

const meta: Meta<typeof DataTableRoot> = {
  component: DataTableRoot,
  title: 'Data/DataTable',
  argTypes: {
    appearance: {
      control: 'radio',
      options: ['no-background', 'plain'],
      description: 'Visual appearance of the table',
      table: {
        defaultValue: { summary: 'no-background' },
      },
    },
    paginationMode: {
      control: 'radio',
      options: ['infinite-scroll', 'pagination', 'none'],
      description: 'Pagination mode of the table',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='w-3xl text-base'>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DataTableRoot>;

export const Base: Story = {
  args: {
    appearance: 'no-background',
  },
  render: (args) => {
    const table = useLumenDataTable({
      data,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'symbol',
          header: 'Symbol',
          enableSorting: false,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
    });

    return (
      <DataTableRoot {...args} table={table}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const AppearanceShowcase: Story = {
  render: () => {
    const noBackgroundTable = useLumenDataTable({
      data,
      columns: [
        { accessorKey: 'name', header: 'Asset', enableSorting: false },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
      ],
    });

    const plainTable = useLumenDataTable({
      data,
      columns: [
        { accessorKey: 'name', header: 'Asset', enableSorting: false },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
      ],
    });

    return (
      <div className='flex gap-24 text-base'>
        <div className='w-400'>
          <DataTableRoot table={noBackgroundTable} appearance='no-background'>
            <DataTable className='max-h-400' />
          </DataTableRoot>
        </div>
        <div className='w-400'>
          <DataTableRoot table={plainTable} appearance='plain'>
            <DataTable className='max-h-400' />
          </DataTableRoot>
        </div>
      </div>
    );
  },
};

export const WithClickableRow: Story = {
  render: (args) => {
    const table = useLumenDataTable({
      data,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'symbol',
          header: 'Symbol',
          enableSorting: false,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end', className: 'w-144' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
    });

    return (
      <DataTableRoot
        {...args}
        table={table}
        onRowClick={(row) => console.log(row)}
      >
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const ColumnsLayout: Story = {
  render: (args) => {
    const table = useLumenDataTable({
      data,
      columns: [
        {
          accessorKey: 'name',
          header: 'w-256 column',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description='Very long description that should be truncated in the table cell'
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-256' },
        },
        {
          accessorKey: 'price',
          header: 'w-52 column',
          enableSorting: false,
          meta: { align: 'end', hideBelow: 'lg', className: 'w-52' },
        },
        {
          accessorKey: 'change',
          header: 'Hide column below lg',
          enableSorting: false,
          meta: { align: 'end', hideBelow: 'lg' },
        },
        {
          id: 'marketCap',
          header: 'Hide column below md',
          enableSorting: false,
          cell: () => '$1.2B',
          meta: { align: 'end', hideBelow: 'md' },
        },
      ],
    });

    return (
      <DataTableRoot
        {...args}
        table={table}
        appearance={args.appearance ?? 'plain'}
      >
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const WithGroupHeader: Story = {
  render: (args) => {
    const table = useLumenDataTable({
      data: largeData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
    });

    return (
      <DataTableRoot
        {...args}
        table={table}
        hideHeader
        groupBy={(row) => row.original.category}
        renderGroupHeader={({ row, count }) => (
          <>
            {row.original.category} ({count})
          </>
        )}
      >
        <DataTable className='max-h-480' />
      </DataTableRoot>
    );
  },
};

export const WithCustomHeader: Story = {
  render: (args) => {
    const table = useLumenDataTable({
      data,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'price',
          header: 'Market cap long text that should be truncated',
          enableSorting: false,
          meta: {
            align: 'end',
            headerTrailingContent: (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableInfoIcon />
                </TooltipTrigger>
                <TooltipContent>Total market capitalization</TooltipContent>
              </Tooltip>
            ),
          },
        },
        {
          accessorKey: 'change',
          header: 'Price',
          enableSorting: false,
          meta: {
            align: 'end',
            headerTrailingContent: (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableInfoIcon />
                </TooltipTrigger>
                <TooltipContent>
                  Price evolution of the last 7 days
                </TooltipContent>
              </Tooltip>
            ),
          },
        },
      ],
    });

    return (
      <DataTableRoot {...args} table={table}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const WithSorting: Story = {
  render: (args) => {
    const [sorting, setSorting] = useState<SortingState>([
      { id: 'name', desc: true },
    ]);

    const table = useLumenDataTable({
      data: largeData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'symbol',
          header: 'Symbol',
          enableSorting: false,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          meta: { align: 'end' },
        },
        {
          sortingFn: (rowA, rowB) => {
            return rowA.original.price.localeCompare(rowB.original.price);
          },
          accessorKey: 'change',
          header: 'Performance',
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
      onSortingChange: setSorting,
      state: { sorting },
    });

    return (
      <DataTableRoot {...args} table={table}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const WithGlobalFilter: Story = {
  render: (args) => {
    const [globalFilter, setGlobalFilter] = useState();

    const table = useLumenDataTable({
      data: largeData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'symbol',
          header: 'Symbol',
          enableSorting: false,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
      onGlobalFilterChange: setGlobalFilter,
      state: { globalFilter },
    });

    return (
      <DataTableRoot {...args} table={table}>
        <TableActionBar>
          <TableActionBarLeading>
            <DataTableGlobalSearchInput placeholder='Search assets...' />
          </TableActionBarLeading>
          <TableActionBarTrailing>
            <Button appearance='base' size='md'>
              Export
            </Button>
          </TableActionBarTrailing>
        </TableActionBar>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

type CryptoPage = {
  data: CryptoAsset[];
  nextCursor: string | null;
};

const PAGE_SIZE = 4;

const fetchCryptos = (cursor: string | null): Promise<CryptoPage> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const start = cursor ? Number(cursor) : 0;
      const end = Math.min(start + PAGE_SIZE, largeData.length);

      resolve({
        data: largeData.slice(start, end),
        nextCursor: end < largeData.length ? String(end) : null,
      });
    }, 1000);
  });

export const WithInfiniteLoading: Story = {
  render: (args) => {
    const query = useInfiniteQuery({
      queryKey: ['crypto-assets'],
      queryFn: ({ pageParam }) => fetchCryptos(pageParam),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const flatData = useMemo(
      () => query.data?.pages.flatMap((page) => page.data) ?? [],
      [query.data],
    );

    const table = useLumenDataTable({
      data: flatData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'symbol',
          header: 'Symbol',
        },
        {
          accessorKey: 'price',
          header: 'Price',
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
    });

    if (query.isLoading) {
      return <Skeleton component='table' />;
    }

    return (
      <DataTableRoot
        {...args}
        table={table}
        loading={query.isFetchingNextPage}
        paginationMode='infinite-scroll'
        onScrollBottom={() => {
          if (query.hasNextPage) {
            query.fetchNextPage();
          }
        }}
      >
        <DataTable className='max-h-320' />
      </DataTableRoot>
    );
  },
};

const categoryOptions = [
  ...new Set(largeData.map((d) => d.category)),
].map((c) => ({ value: c, label: c }));

export const WithActionBarAndSelectTrigger: Story = {
  render: (args) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null,
    );

    const filteredData = useMemo(
      () =>
        selectedCategory
          ? largeData.filter((d) => d.category === selectedCategory)
          : largeData,
      [selectedCategory],
    );

    const table = useLumenDataTable({
      data: filteredData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
    });

    return (
      <DataTableRoot {...args} table={table}>
        <TableActionBar>
          <TableActionBarLeading>
            <DataTableGlobalSearchInput placeholder='Search assets...' />
          </TableActionBarLeading>
          <TableActionBarTrailing>
            <Select
              items={categoryOptions}
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger
                render={({ selectedValue, selectedContent }) => (
                  <MediaButton>
                    {selectedValue ? selectedContent : 'All categories'}
                  </MediaButton>
                )}
              />
              <SelectContent>
                <SelectList
                  renderItem={(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <SelectItemText>{item.label}</SelectItemText>
                    </SelectItem>
                  )}
                />
              </SelectContent>
            </Select>
          </TableActionBarTrailing>
        </TableActionBar>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const WithServerSideState: Story = {
  render: (args) => {
    const fetchApiBackend = async (...args: any) => {
      return args;
    };

    const table = useLumenDataTable({
      data: largeData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'symbol',
          header: 'Symbol',
        },
        {
          accessorKey: 'price',
          header: 'Price',
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          cell: ({ row }) => (
            <TableCellContent
              align='end'
              title={row.original.price}
              description={row.original.change}
            />
          ),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
      onSortingChange: (sortingState) =>
        fetchApiBackend({ sort: sortingState }),

      onGlobalFilterChange: (globalFilterState) =>
        fetchApiBackend({ globalFilter: globalFilterState }),

      onPaginationChange: (paginationState) =>
        fetchApiBackend({ pagination: paginationState }),

      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
    });

    return (
      <DataTableRoot {...args} table={table}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

/**
 * Client-side column filtering powered by TanStack's built-in `columnFilters` state
 * and `getFilteredRowModel`. The Select updates `columnFilters` via
 * `onColumnFiltersChange`; TanStack handles matching rows automatically.
 * Combine with `DataTableGlobalSearchInput` for full-text + column filtering.
 */
export const WithClientSideColumnFilter: Story = {
  render: (args) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const selectedCategory =
      (columnFilters.find((f) => f.id === 'category')?.value as string) ?? null;

    const table = useLumenDataTable({
      data: largeData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'category',
          header: 'Category',
          enableSorting: false,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          meta: { align: 'end', className: 'w-144' },
        },
      ],
      state: { columnFilters },
      onColumnFiltersChange: setColumnFilters,
    });

    return (
      <DataTableRoot {...args} table={table}>
        <TableActionBar>
          <TableActionBarLeading>
            <DataTableGlobalSearchInput placeholder='Search assets...' />
          </TableActionBarLeading>
          <TableActionBarTrailing>
            <Select
              items={categoryOptions}
              value={selectedCategory}
              onValueChange={(val) => {
                if (val) {
                  setColumnFilters([{ id: 'category', value: val }]);
                } else {
                  setColumnFilters([]);
                }
              }}
            >
              <SelectTrigger
                render={({ selectedValue, selectedContent }) => (
                  <MediaButton>
                    {selectedValue ? selectedContent : 'All categories'}
                  </MediaButton>
                )}
              />
              <SelectContent>
                <SelectList
                  renderItem={(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <SelectItemText>{item.label}</SelectItemText>
                    </SelectItem>
                  )}
                />
              </SelectContent>
            </Select>
          </TableActionBarTrailing>
        </TableActionBar>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

/**
 * Server-side filtering with `manualFiltering: true`. Filter state is owned by
 * the component and synced to the backend via `onColumnFiltersChange` and
 * `onGlobalFilterChange`. In this demo the "API call" is simulated locally, but
 * the pattern is identical to a real fetch: change a filter → callback fires →
 * you refetch with the new params → pass fresh data back as `data`.
 */
export const WithServerSideFilters: Story = {
  render: (args) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const selectedCategory =
      (columnFilters.find((f) => f.id === 'category')?.value as string) ?? null;

    // Simulates the data returned by the server after applying the filters.
    // In a real implementation this would be the result of an API call triggered
    // by onColumnFiltersChange / onGlobalFilterChange callbacks.
    const serverData = useMemo(() => {
      let result = largeData;
      if (selectedCategory)
        result = result.filter((d) => d.category === selectedCategory);
      if (globalFilter) {
        const q = globalFilter.toLowerCase();
        result = result.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.symbol.toLowerCase().includes(q),
        );
      }
      return result;
    }, [selectedCategory, globalFilter]);

    const table = useLumenDataTable({
      data: serverData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'category',
          header: 'Category',
          enableSorting: false,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          meta: { align: 'end', className: 'w-144' },
        },
      ],
      state: { columnFilters, globalFilter },
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      manualFiltering: true,
    });

    return (
      <DataTableRoot {...args} table={table}>
        <TableActionBar>
          <TableActionBarLeading>
            <DataTableGlobalSearchInput placeholder='Search assets...' />
          </TableActionBarLeading>
          <TableActionBarTrailing>
            <Select
              items={categoryOptions}
              value={selectedCategory}
              onValueChange={(val) => {
                if (val) {
                  setColumnFilters([{ id: 'category', value: val }]);
                } else {
                  setColumnFilters([]);
                }
              }}
            >
              <SelectTrigger
                render={({ selectedValue, selectedContent }) => (
                  <MediaButton>
                    {selectedValue ? selectedContent : 'All categories'}
                  </MediaButton>
                )}
              />
              <SelectContent>
                <SelectList
                  renderItem={(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <SelectItemText>{item.label}</SelectItemText>
                    </SelectItem>
                  )}
                />
              </SelectContent>
            </Select>
          </TableActionBarTrailing>
        </TableActionBar>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

/**
 * Multiple simultaneous column filters: global text search combined with two
 * independent Select filters (category and performance direction). All filters
 * use TanStack's client-side `columnFilters` state; each Select updates a
 * different column's filter entry.
 */
export const WithMultipleFilters: Story = {
  render: (args) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const selectedCategory =
      (columnFilters.find((f) => f.id === 'category')?.value as string) ?? null;
    const selectedDirection =
      (columnFilters.find((f) => f.id === 'change')?.value as string) ?? null;

    const updateFilter = (id: string, value: string | null) => {
      setColumnFilters((prev) => {
        const without = prev.filter((f) => f.id !== id);
        return value ? [...without, { id, value }] : without;
      });
    };

    const directionOptions = [
      { value: 'up', label: 'Gainers' },
      { value: 'down', label: 'Losers' },
    ];

    const table = useLumenDataTable({
      data: largeData,
      columns: [
        {
          accessorKey: 'name',
          header: 'Asset',
          enableSorting: false,
          cell: ({ row }) => (
            <TableCellContent
              title={row.original.name}
              description={row.original.symbol}
              leadingContent={<Spot appearance='icon' icon={Android} />}
            />
          ),
          meta: { className: 'w-224' },
        },
        {
          accessorKey: 'category',
          header: 'Category',
          enableSorting: false,
        },
        {
          accessorKey: 'price',
          header: 'Price',
          enableSorting: false,
          meta: { align: 'end' },
        },
        {
          accessorKey: 'change',
          header: 'Performance',
          enableSorting: false,
          filterFn: (row, _colId, filterValue) =>
            filterValue === 'up'
              ? row.original.change.startsWith('+')
              : row.original.change.startsWith('-'),
          meta: { align: 'end', className: 'w-144' },
        },
      ],
      state: { columnFilters, globalFilter },
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
    });

    return (
      <DataTableRoot {...args} table={table}>
        <TableActionBar>
          <TableActionBarLeading>
            <DataTableGlobalSearchInput placeholder='Search assets...' />
          </TableActionBarLeading>
          <TableActionBarTrailing>
            <Select
              items={categoryOptions}
              value={selectedCategory}
              onValueChange={(val) => updateFilter('category', val)}
            >
              <SelectTrigger
                render={({ selectedValue, selectedContent }) => (
                  <MediaButton>
                    {selectedValue ? selectedContent : 'All categories'}
                  </MediaButton>
                )}
              />
              <SelectContent>
                <SelectList
                  renderItem={(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <SelectItemText>{item.label}</SelectItemText>
                    </SelectItem>
                  )}
                />
              </SelectContent>
            </Select>
            <Select
              items={directionOptions}
              value={selectedDirection}
              onValueChange={(val) => updateFilter('change', val)}
            >
              <SelectTrigger
                render={({ selectedValue, selectedContent }) => (
                  <MediaButton>
                    {selectedValue ? selectedContent : 'All performance'}
                  </MediaButton>
                )}
              />
              <SelectContent>
                <SelectList
                  renderItem={(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <SelectItemText>{item.label}</SelectItemText>
                    </SelectItem>
                  )}
                />
              </SelectContent>
            </Select>
          </TableActionBarTrailing>
        </TableActionBar>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};
