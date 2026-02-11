import type { Meta, StoryObj } from '@storybook/react-vite';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Android } from '../../Symbols';
import { Skeleton } from '../Skeleton/Skeleton';
import { Spot } from '../Spot';
import { TableCellContent } from '../Table';
import { DataTableRoot, DataTable } from './DataTable';
import { useLumenDataTable } from './useLumenDataTable/useLumenDataTable';

type CryptoAsset = {
  name: string;
  symbol: string;
  price: string;
  change: string;
};

const largeData: CryptoAsset[] = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$43,250.00', change: '+2.5%' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,650.00', change: '+1.8%' },
  { name: 'Solana', symbol: 'SOL', price: '$98.50', change: '-0.5%' },
  { name: 'Cardano', symbol: 'ADA', price: '$0.52', change: '+3.2%' },
  { name: 'Dogecoin', symbol: 'DOGE', price: '$0.08', change: '-1.2%' },
  { name: 'Ripple', symbol: 'XRP', price: '$0.32', change: '+0.8%' },
  { name: 'Litecoin', symbol: 'LTC', price: '$120.00', change: '+0.3%' },
  { name: 'Bitcoin Cash', symbol: 'BCH', price: '$350.00', change: '+1.1%' },
  { name: 'EOS', symbol: 'EOS', price: '$2.10', change: '-0.7%' },
  { name: 'Tron', symbol: 'TRX', price: '$0.06', change: '+0.5%' },
  { name: 'Bitcoin SV', symbol: 'BSV', price: '$100.00', change: '+0.2%' },
  { name: 'Stellar', symbol: 'XLM', price: '$0.12', change: '-0.3%' },
  { name: 'Polkadot', symbol: 'DOT', price: '$10.00', change: '+0.1%' },
  { name: 'Chainlink', symbol: 'LINK', price: '$15.00', change: '+0.2%' },
  { name: 'Uniswap', symbol: 'UNI', price: '$12.00', change: '+0.3%' },
  { name: 'Aave', symbol: 'AAVE', price: '$100.00', change: '+0.4%' },
  { name: 'Sushi', symbol: 'SUSHI', price: '$100.00', change: '+0.5%' },
  { name: 'Yearn', symbol: 'YFI', price: '$100.00', change: '+0.6%' },
  { name: 'Maker', symbol: 'MKR', price: '$100.00', change: '+0.7%' },
  { name: 'Compound', symbol: 'COMP', price: '$100.00', change: '+0.8%' },
];

const data = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$43,250.00', change: '+2.5%' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,650.00', change: '+1.8%' },
  { name: 'Solana', symbol: 'SOL', price: '$98.50', change: '-0.5%' },
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
        meta: { align: 'end' as const },
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
        meta: { align: 'end' as const, className: 'w-144' },
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

export const WithManyRows: Story = {
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
        meta: { align: 'end' as const },
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
        meta: { align: 'end' as const, className: 'w-144' },
      },
    ];

    const table = useLumenDataTable({ data, columns });

    return (
      <DataTableRoot table={table} appearance={args.appearance}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
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
        meta: { align: 'end' as const },
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
        meta: { align: 'end' as const, className: 'w-144' },
      },
    ];

    const table = useLumenDataTable({ data, columns });

    return (
      <DataTableRoot
        table={table}
        appearance={args.appearance}
        onRowClick={(row) => alert(JSON.stringify(row, null, 4))}
      >
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
        header: 'Asset',
        cell: ({ row }) => (
          <TableCellContent
            title={row.original.name}
            description={row.original.symbol}
            leadingContent={<Spot appearance='icon' icon={Android} />}
          />
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        meta: { align: 'end' },
      },
      {
        accessorKey: 'change',
        header: 'Change',
        meta: { align: 'end', hideBelow: 'lg' },
      },
      {
        id: 'marketCap',
        header: 'Market Cap',
        cell: () => '$1.2B',
        meta: { align: 'end', hideBelow: 'lg' },
      },
    ];

    const table = useLumenDataTable({ data, columns: responsiveColumns });

    return (
      <DataTableRoot table={table} appearance={args.appearance}>
        <DataTable className='max-h-400' />
      </DataTableRoot>
    );
  },
};

/* ---------------------------------------------------------------------------
 * Infinite loading with cursor-based pagination (TanStack Query)
 * ------------------------------------------------------------------------- */

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
        meta: { align: 'end' as const },
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
        meta: { align: 'end' as const, className: 'w-144' },
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
