import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColumnDef } from '@tanstack/react-table';
import { Android } from '../../Symbols';
import { Spot } from '../Spot';
import { TableCellContent } from '../Table';
import { DataTableRoot, DataTable } from './DataTable';
import { DataTableRootProps } from './types';
import { useLumenDataTable } from './useLumenDataTable/useLumenDataTable';

type CryptoAsset = {
  name: string;
  symbol: string;
  price: string;
  change: string;
};

const smallData: CryptoAsset[] = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$43,250.00', change: '+2.5%' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,650.00', change: '+1.8%' },
  { name: 'Solana', symbol: 'SOL', price: '$98.50', change: '-0.5%' },
];

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
];

const baseColumns: ColumnDef<CryptoAsset>[] = [
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
};

export default meta;
type Story = StoryObj<typeof DataTableRoot>;

const DataTableStory = ({
  data,
  columns,
  appearance,
  ...props
}: {
  data: CryptoAsset[];
  columns: ColumnDef<CryptoAsset>[];
  appearance?: 'no-background' | 'plain';
} & Omit<DataTableRootProps<CryptoAsset>, 'table' | 'children'>) => {
  const table = useLumenDataTable({ data, columns });
  return (
    <DataTableRoot table={table} appearance={appearance} {...props}>
      <DataTable className='max-h-400' />
    </DataTableRoot>
  );
};

export const Base: Story = {
  args: {
    appearance: 'no-background',
  },
  render: (args) => (
    <div className='w-560 text-base'>
      <DataTableStory
        data={smallData}
        columns={baseColumns}
        appearance={args.appearance}
      />
    </div>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => {
    const simpleColumns: ColumnDef<CryptoAsset>[] = [
      { accessorKey: 'name', header: 'Asset' },
      { accessorKey: 'price', header: 'Price', meta: { align: 'end' } },
    ];

    return (
      <div className='flex gap-24 text-base'>
        <div className='w-400'>
          <DataTableStory
            data={smallData}
            columns={simpleColumns}
            appearance='no-background'
          />
        </div>
        <div className='w-400'>
          <DataTableStory
            data={smallData}
            columns={simpleColumns}
            appearance='plain'
          />
        </div>
      </div>
    );
  },
};

export const WithManyRows: Story = {
  render: (args) => (
    <div className='h-400 w-560 text-base'>
      <DataTableStory
        data={largeData}
        columns={baseColumns}
        appearance={args.appearance}
      />
    </div>
  ),
};

export const WithClickableRow: Story = {
  render: (args) => (
    <div className='h-400 w-560 text-base'>
      <DataTableStory
        onRowClick={(row) => alert(JSON.stringify(row, null, 4))}
        data={largeData}
        columns={baseColumns}
        appearance={args.appearance}
      />
    </div>
  ),
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

    return (
      <div className='w-560 text-base'>
        <DataTableStory
          data={smallData}
          columns={responsiveColumns}
          appearance={args.appearance}
        />
      </div>
    );
  },
};
