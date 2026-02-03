import { cn } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Button } from '../Button/Button';
import { SearchInput } from '../SearchInput/SearchInput';
import {
  TableCore,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderRow,
  TableHeaderCell,
  TableActionBar,
  TableActionBarLeading,
  TableActionBarTrailing,
} from './headless/TableCore';

const Container = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('min-w-xl p-16 text-base', className)} {...props} />
);

const sampleData = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$43,250.00',
    change: '+2.5%',
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$2,650.00',
    change: '+1.8%',
  },
  {
    id: 3,
    name: 'Solana',
    symbol: 'SOL',
    price: '$98.50',
    change: '-0.5%',
  },
  {
    id: 4,
    name: 'Cardano',
    symbol: 'ADA',
    price: '$0.52',
    change: '+3.2%',
  },
];

const meta: Meta<typeof TableCore> = {
  component: TableCore,
  title: 'Data/Table',
  subcomponents: {
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeaderRow,
    TableHeaderCell,
    TableActionBar,
    TableActionBarLeading,
    TableActionBarTrailing,
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
type Story = StoryObj<typeof TableCore>;

export const Base: Story = {
  render: () => (
    <Container>
      <TableActionBar>
        <TableActionBarLeading>
          <SearchInput placeholder='Search assets...' />
        </TableActionBarLeading>
        <TableActionBarTrailing>
          <Button appearance='base' size='sm'>
            Export
          </Button>
        </TableActionBarTrailing>
      </TableActionBar>
      <TableCore appearance='plain'>
        <TableHead>
          <TableHeaderRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell align='right'>Symbol</TableHeaderCell>
            <TableHeaderCell align='right'>Price</TableHeaderCell>
            <TableHeaderCell align='right'>Change</TableHeaderCell>
          </TableHeaderRow>
        </TableHead>
        <TableBody className='max-h-288'>
          {[...sampleData, ...sampleData, ...sampleData, ...sampleData].map(
            (row) => (
              <TableRow clickable key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell align='right'>{row.symbol}</TableCell>
                <TableCell align='right'>{row.price}</TableCell>
                <TableCell align='right'>{row.change}</TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </TableCore>
    </Container>
  ),
  parameters: {},
};
