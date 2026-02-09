import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import { Android } from '../../Symbols';
import { Button } from '../Button/Button';
import { SearchInput } from '../SearchInput/SearchInput';
import { Spot } from '../Spot';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderRow,
  TableHeaderCell,
  TableSortButton,
  TableActionBar,
  TableActionBarLeading,
  TableActionBarTrailing,
  TableCellContent,
  TableLoadingRow,
  TableRoot,
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
    TableHead,
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
    isLoading: {
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
    isLoading: false,
  },
  render: (args) => (
    <div className='w-560 text-base'>
      <TableRoot appearance={args.appearance} isLoading={args.isLoading}>
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell className='w-224'>Asset</TableHeaderCell>
              <TableHeaderCell>Symbol</TableHeaderCell>
              <TableHeaderCell align='right'>Price</TableHeaderCell>
              <TableHeaderCell className='w-144' align='right'>
                Performance
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {smallData.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell className='w-224'>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leading={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell>{row.symbol}</TableCell>
                <TableCell align='right'>{row.price}</TableCell>
                <TableCell className='w-144' align='right'>
                  <TableCellContent
                    align='right'
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
  render: () => {
    const table = (appearance: 'no-background' | 'plain') => (
      <div className='w-400'>
        <TableRoot appearance={appearance}>
          <Table>
            <TableHead>
              <TableHeaderRow>
                <TableHeaderCell>Asset</TableHeaderCell>
                <TableHeaderCell align='right'>Price</TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {smallData.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align='right'>{row.price}</TableCell>
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
  render: () => (
    <div className='w-560 text-base'>
      <TableRoot>
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>
                Asset name that is very long and should be truncated
              </TableHeaderCell>
              <TableHeaderCell align='right'>Price</TableHeaderCell>
              <TableHeaderCell hideBelow='lg' align='right'>
                Hidden below lg
              </TableHeaderCell>
              <TableHeaderCell hideBelow='lg' align='right'>
                Hidden below lg
              </TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {smallData.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leading={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='right'>{row.price}</TableCell>
                <TableCell hideBelow='lg' align='right'>
                  {row.change}
                </TableCell>
                <TableCell hideBelow='lg' align='right'>
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
  render: () => (
    <div className='w-480 text-base'>
      <TableRoot>
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell align='right'>Price</TableHeaderCell>
              <TableHeaderCell align='right'>Change</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
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
                    leading={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='right'>{row.price}</TableCell>
                <TableCell align='right'>{row.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  ),
};

export const WithInfiniteLoading: Story = {
  render: () => {
    const [data, setData] = useState(
      largeData.map((item, i) => ({ ...item, id: i })),
    );
    const [isLoading, setIsLoading] = useState(false);

    const loadMore = useCallback(() => {
      setIsLoading(true);
      setTimeout(() => {
        setData((prev) => [
          ...prev,
          ...largeData.map((item, i) => ({
            ...item,
            id: prev.length + i,
          })),
        ]);
        setIsLoading(false);
      }, 2000);
    }, []);

    return (
      <div className='w-560 text-base'>
        <TableRoot
          className='h-480'
          isLoading={isLoading}
          onScrollBottom={loadMore}
        >
          <Table>
            <TableHead>
              <TableHeaderRow>
                <TableHeaderCell>Asset</TableHeaderCell>
                <TableHeaderCell align='right'>Price</TableHeaderCell>
                <TableHeaderCell align='right'>Change</TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TableCellContent
                      title={row.name}
                      description={row.symbol}
                      leading={<Spot appearance='icon' icon={Android} />}
                    />
                  </TableCell>
                  <TableCell align='right'>{row.price}</TableCell>
                  <TableCell align='right'>{row.change}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableLoadingRow />
        </TableRoot>
      </div>
    );
  },
};

export const WithCustomHeader: Story = {
  render: () => {
    const [nameSortDirection, setNameSortDirection] =
      useState<TableSortValue>('asc');
    const [priceSortDirection, setPriceSortDirection] =
      useState<TableSortValue>(undefined);

    return (
      <div className='w-560 text-base'>
        <TableRoot>
          <Table>
            <TableHead>
              <TableHeaderRow>
                <TableHeaderCell>
                  <TableSortButton
                    sortDirection={nameSortDirection}
                    onToggleSort={setNameSortDirection}
                  >
                    Asset
                  </TableSortButton>
                </TableHeaderCell>
                <TableHeaderCell align='right'>
                  <span className='truncate'>Market cap</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableInfoIcon />
                    </TooltipTrigger>
                    <TooltipContent>Total market capitalization</TooltipContent>
                  </Tooltip>
                </TableHeaderCell>
                <TableHeaderCell align='right'>
                  <TableSortButton
                    sortDirection={priceSortDirection}
                    onToggleSort={setPriceSortDirection}
                    align='right'
                  >
                    Price
                  </TableSortButton>
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {smallData.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell>
                    <TableCellContent
                      title={row.name}
                      description={row.symbol}
                      leading={<Spot appearance='icon' icon={Android} />}
                    />
                  </TableCell>
                  <TableCell align='right'>{row.price}</TableCell>
                  <TableCell align='right'>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </div>
    );
  },
};

export const WithActionBar: Story = {
  render: () => (
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

      <TableRoot>
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell align='right'>Price</TableHeaderCell>
              <TableHeaderCell align='right'>Change</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {smallData.map((row) => (
              <TableRow key={row.symbol}>
                <TableCell>
                  <TableCellContent
                    title={row.name}
                    description={row.symbol}
                    leading={<Spot appearance='icon' icon={Android} />}
                  />
                </TableCell>
                <TableCell align='right'>{row.price}</TableCell>
                <TableCell align='right'>{row.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  ),
};
