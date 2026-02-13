import type { Meta, StoryObj } from '@storybook/react-vite';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Android } from '../../Symbols';
import { Skeleton } from '../Skeleton/Skeleton';
import { Spot } from '../Spot';
import { TableCellContent, TableInfoIcon } from '../Table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { DataTableRoot, DataTable } from './DataTable';
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
      <div className='w-560 text-base'>
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
    const columns: ColumnDef<CryptoAsset>[] = [
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
    ];

    const table = useLumenDataTable({ data, columns });

    return (
      <DataTableRoot {...args} table={table}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const AppearanceShowcase: Story = {
  render: () => {
    const simpleColumns: ColumnDef<CryptoAsset>[] = [
      { accessorKey: 'name', header: 'Asset' },
      { accessorKey: 'price', header: 'Price', meta: { align: 'end' } },
    ];

    const noBackgroundTable = useLumenDataTable({
      data,
      columns: simpleColumns,
    });
    const plainTable = useLumenDataTable({ data, columns: simpleColumns });

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
    const columns: ColumnDef<CryptoAsset>[] = [
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
    ];

    const table = useLumenDataTable({ data, columns });

    return (
      <DataTableRoot {...args} table={table}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const WithResponsiveColumns: Story = {
  render: (args) => {
    const responsiveColumns: ColumnDef<CryptoAsset>[] = [
      {
        accessorKey: 'name',
        header: 'Very very long truncated header text',
        cell: ({ row }) => (
          <TableCellContent
            title={row.original.name}
            description={row.original.symbol}
            leadingContent={<Spot appearance='icon' icon={Android} />}
          />
        ),
      },
      {
        accessorKey: 'change',
        header: 'Hide column below lg',
        meta: { align: 'end', hideBelow: 'lg' },
      },
      {
        id: 'marketCap',
        header: 'Hide column below md',
        cell: () => '$1.2B',
        meta: { align: 'end', hideBelow: 'md' },
      },
    ];

    const table = useLumenDataTable({ data, columns: responsiveColumns });

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
    const columns: ColumnDef<CryptoAsset>[] = [
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
    ];

    const table = useLumenDataTable({ data: largeData, columns });

    return (
      <DataTableRoot
        {...args}
        table={table}
        groupBy={(row) => row.original.category}
        renderGroupHeader={({ row, count }) => (
          <>
            {row.original.category} ({count})
          </>
        )}
      >
        <DataTable className='max-h-560' />
      </DataTableRoot>
    );
  },
};

export const WithCustomHeader: Story = {
  render: (args) => {
    const columns: ColumnDef<CryptoAsset>[] = [
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
        enableSorting: true,
        meta: { className: 'w-224' },
      },
      {
        accessorKey: 'price',
        header: 'Market cap long text that should be truncated',
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
        enableSorting: true,
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
    ];

    const table = useLumenDataTable({ data, columns });

    return (
      <DataTableRoot {...args} table={table}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

export const WithSorting: Story = {
  render: (args) => {
    const columns: ColumnDef<CryptoAsset>[] = [
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
        enableSorting: true,
        meta: { className: 'w-224' },
      },
      {
        accessorKey: 'symbol',
        header: 'Symbol',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        enableSorting: true,
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
    ];

    const [sorting, setSorting] = useState<SortingState>([
      { id: 'name', desc: true },
    ]);

    const table = useLumenDataTable({
      data: largeData,
      columns,
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

    const columns: ColumnDef<CryptoAsset>[] = [
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
    ];

    const table = useLumenDataTable({
      data: flatData,
      columns,
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
