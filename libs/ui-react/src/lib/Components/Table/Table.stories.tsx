import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import { Android } from '../../Symbols';
import { Button } from '../Button/Button';
import { SearchInput } from '../SearchInput/SearchInput';
import { Spot } from '../Spot';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import {
  TableRoot,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderRow,
  TableGroupHeaderRow,
  TableHeaderCell,
  TableSortButton,
  TableActionBar,
  TableActionBarLeading,
  TableActionBarTrailing,
  TableCellContent,
  TableLoadingRow,
  TableInfoIcon,
} from './Table';
import { TableSortValue } from './types';

const smallData = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$43,250.00', change: '+2.5%' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,650.00', change: '+1.8%' },
  { name: 'Solana', symbol: 'SOL', price: '$98.50', change: '-0.5%' },
];

const largeData = [
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

const meta: Meta<typeof TableRoot> = {
  component: TableRoot,
  title: 'Data/Table',
  subcomponents: {
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHeaderRow,
    TableHeaderCell,
    TableSortButton,
    TableActionBar,
    TableActionBarLeading,
    TableActionBarTrailing,
    TableRoot,
    TableLoadingRow,
    TableInfoIcon,
  },
  argTypes: {
    appearance: {
      control: 'radio',
      options: ['no-background', 'plain'],
      description: 'Visual appearance of the table',
      table: {
        defaultValue: { summary: 'no-background' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state for infinite scroll',
      table: {
        defaultValue: { summary: 'false' },
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
type Story = StoryObj<typeof TableRoot>;

export const Base: Story = {
  args: {
    appearance: 'no-background',
    loading: false,
  },
  render: (args) => (
    <div className='w-560 text-base'>
      <TableRoot appearance={args.appearance} loading={args.loading}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell className='w-224'>Asset</TableHeaderCell>
              <TableHeaderCell>Symbol</TableHeaderCell>
              <TableHeaderCell align='end'>Price</TableHeaderCell>
              <TableHeaderCell className='w-144' align='end'>
                Performance
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {smallData.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell className='w-224'>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leadingContent={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell>{row.symbol}</TableCell>
                <TableCell align='end'>{row.price}</TableCell>
                <TableCell className='w-144' align='end'>
                  <TableCellContent
                    align='end'
                    title={row.price}
                    description={row.change}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  ),
};

export const AppearanceShowcase: Story = {
  render: (args) => {
    const table = (appearance: 'no-background' | 'plain') => (
      <div className='w-400'>
        <TableRoot {...args} appearance={appearance}>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Asset</TableHeaderCell>
                <TableHeaderCell align='end'>Price</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {smallData.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align='end'>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
    );

    return (
      <div className='flex gap-24 text-base'>
        {table('no-background')}
        {table('plain')}
      </div>
    );
  },
};

export const ResponsiveLayout: Story = {
  render: (args) => (
    <div className='w-560 text-base'>
      <TableRoot {...args}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>
                <span className='truncate'>
                  Asset name that is very long and should be truncated
                </span>
              </TableHeaderCell>
              <TableHeaderCell align='end'>Price</TableHeaderCell>
              <TableHeaderCell hideBelow='lg' align='end'>
                Hidden below lg
              </TableHeaderCell>
              <TableHeaderCell hideBelow='lg' align='end'>
                Hidden below lg
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {smallData.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leadingContent={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='end'>{row.price}</TableCell>
                <TableCell hideBelow='lg' align='end'>
                  {row.change}
                </TableCell>
                <TableCell hideBelow='lg' align='end'>
                  $1.2B
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  ),
};

export const WithClickableRow: Story = {
  render: (args) => (
    <div className='w-480 text-base'>
      <TableRoot {...args}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell align='end'>Price</TableHeaderCell>
              <TableHeaderCell align='end'>Change</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {smallData.map((row) => (
              <TableRow
                clickable
                key={row.symbol}
                onClick={() => console.log(`Clicked ${row.name}`)}
              >
                <TableCell>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leadingContent={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='end'>{row.price}</TableCell>
                <TableCell align='end'>{row.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  ),
};

export const WithInfiniteLoading: Story = {
  render: (args) => {
    const [data, setData] = useState(
      largeData.map((item, i) => ({ ...item, id: i })),
    );
    const [loading, setLoading] = useState(false);

    const loadMore = useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setData((prev) => [
          ...prev,
          ...largeData.map((item, i) => ({
            ...item,
            id: prev.length + i,
          })),
        ]);
        setLoading(false);
      }, 2000);
    }, []);

    return (
      <div className='w-560 text-base'>
        <TableRoot
          {...args}
          className='h-480'
          loading={loading}
          onScrollBottom={loadMore}
        >
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Asset</TableHeaderCell>
                <TableHeaderCell align='end'>Price</TableHeaderCell>
                <TableHeaderCell align='end'>Change</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TableCellContent
                      title={row.name}
                      description={row.symbol}
                      leadingContent={<Spot appearance='icon' icon={Android} />}
                    />
                  </TableCell>
                  <TableCell align='end'>{row.price}</TableCell>
                  <TableCell align='end'>{row.change}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
    );
  },
};

export const WithCustomHeader: Story = {
  render: (args) => {
    const [nameSortDirection, setNameSortDirection] =
      useState<TableSortValue>('asc');
    const [priceSortDirection, setPriceSortDirection] =
      useState<TableSortValue>(undefined);

    return (
      <div className='w-560 text-base'>
        <TableRoot {...args}>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>
                  <TableSortButton
                    sortDirection={nameSortDirection}
                    onToggleSort={setNameSortDirection}
                  >
                    Asset
                  </TableSortButton>
                </TableHeaderCell>
                <TableHeaderCell
                  align='end'
                  children='Market cap long text that should be truncated'
                  trailingContent={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableInfoIcon />
                      </TooltipTrigger>
                      <TooltipContent>
                        Total market capitalization
                      </TooltipContent>
                    </Tooltip>
                  }
                />
                <TableHeaderCell
                  align='end'
                  trailingContent={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableInfoIcon />
                      </TooltipTrigger>
                      <TooltipContent>
                        Total market capitalization
                      </TooltipContent>
                    </Tooltip>
                  }
                >
                  <TableSortButton
                    sortDirection={priceSortDirection}
                    onToggleSort={setPriceSortDirection}
                    align='end'
                  >
                    Price
                  </TableSortButton>
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {smallData.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell>
                    <TableCellContent
                      title={row.name}
                      description={row.symbol}
                      leadingContent={<Spot appearance='icon' icon={Android} />}
                    />
                  </TableCell>
                  <TableCell align='end'>{row.price}</TableCell>
                  <TableCell align='end'>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
    );
  },
};

export const WithGroupHeader: Story = {
  render: (args) => (
    <div className='w-560 text-base'>
      <TableActionBar>
        <TableActionBarLeading>
          <SearchInput placeholder='Search assets...' />
        </TableActionBarLeading>
        <TableActionBarTrailing>
          <Button appearance='base' size='md'>
            Export
          </Button>
        </TableActionBarTrailing>
      </TableActionBar>

      <TableRoot {...args}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell align='end'>Price</TableHeaderCell>
              <TableHeaderCell align='end'>Change</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            <TableGroupHeaderRow colSpan={3}>February 2026</TableGroupHeaderRow>
            {smallData.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leadingContent={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='end'>{row.price}</TableCell>
                <TableCell align='end'>{row.change}</TableCell>
              </TableRow>
            ))}
            <TableGroupHeaderRow colSpan={3}>January 2026</TableGroupHeaderRow>
            {smallData.map((row) => (
              <TableRow clickable key={row.symbol}>
                <TableCell>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leadingContent={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='end'>{row.price}</TableCell>
                <TableCell align='end'>{row.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  ),
};

export const WithActionBar: Story = {
  render: (args) => (
    <div className='w-560 text-base'>
      <TableActionBar>
        <TableActionBarLeading>
          <SearchInput placeholder='Search assets...' />
        </TableActionBarLeading>
        <TableActionBarTrailing>
          <Button appearance='base' size='md'>
            Export
          </Button>
        </TableActionBarTrailing>
      </TableActionBar>

      <TableRoot {...args}>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell align='end'>Price</TableHeaderCell>
              <TableHeaderCell align='end'>Change</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {smallData.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leadingContent={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='end'>{row.price}</TableCell>
                <TableCell align='end'>{row.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  ),
};
