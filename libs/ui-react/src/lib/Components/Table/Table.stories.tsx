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

const sampleData = [
  {
    name: 'Bitcoin lore ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    symbol: 'BTC',
    price: '$43,250.00',
    change: '+2.5%',
  },
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

const incrementIds = (data: any[]) => {
  return data.map((item, index) => ({ ...item, id: index + 1 }));
};

const useFetchData = () => {
  const [data, setData] = useState(incrementIds(sampleData));
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(() => {
    console.log('REFETCHING DATA');
    setIsLoading(true);
    setTimeout(() => {
      setData(incrementIds([...data, ...sampleData]));
      setIsLoading(false);
    }, 2000);
  }, [data]);

  return { data, refetch, isLoading };
};

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
    TableHeaderCellSort: TableSortButton,
    TableActionBar,
    TableActionBarLeading,
    TableActionBarTrailing,
    TableRoot,
    TableLoadingRow,
    TableInfoIcon,
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
  render: () => {
    const { data, isLoading, refetch } = useFetchData();
    const [nameSortDirection, setNameSortDirection] =
      useState<TableSortValue>(undefined);
    const [priceSortDirection, setPriceSortDirection] =
      useState<TableSortValue>(undefined);

    return (
      <div className='max-w-3xl p-16 text-base'>
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

        <TableRoot
          className='h-480'
          isLoading={isLoading}
          onScrollBottom={refetch}
        >
          <Table>
            <TableHead>
              <TableHeaderRow>
                <TableHeaderCell hideBelow='sm' className='w-256'>
                  <TableSortButton
                    sortDirection={nameSortDirection}
                    onToggleSort={setNameSortDirection}
                  >
                    Name
                  </TableSortButton>
                </TableHeaderCell>
                <TableHeaderCell align='right'>
                  <span className='truncate'>Number of element</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableInfoIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      Additional information about this section
                    </TooltipContent>
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
                <TableHeaderCell hideBelow='sm' className='w-256' align='right'>
                  Change
                </TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody className='max-h-288'>
              {data.map((row) => (
                <TableRow clickable key={row.id}>
                  <TableCell hideBelow='sm' className='w-256'>
                    <TableCellContent
                      title={row.name}
                      description={row.symbol}
                      leading={<Spot appearance='icon' icon={Android} />}
                    />
                  </TableCell>
                  <TableCell align='right'>{row.id}</TableCell>
                  <TableCell align='right'>{row.price}</TableCell>
                  <TableCell hideBelow='sm' className='w-256' align='right'>
                    <TableCellContent
                      align='right'
                      title={row.name}
                      description={row.change}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableLoadingRow />
        </TableRoot>
      </div>
    );
  },
  parameters: {},
};
