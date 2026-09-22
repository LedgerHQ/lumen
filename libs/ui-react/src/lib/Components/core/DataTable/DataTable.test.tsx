import type { ColumnDef, Row } from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { DataTableRoot, DataTable } from './DataTable';
import { useLumenDataTable } from './useLumenDataTable';

type TestData = {
  id: number;
  name: string;
  price: string;
};

const testData: TestData[] = [
  { id: 1, name: 'Bitcoin', price: '$43,250.00' },
  { id: 2, name: 'Ethereum', price: '$2,650.00' },
  { id: 3, name: 'Solana', price: '$98.50' },
];

const testColumns: ColumnDef<TestData>[] = [
  { accessorKey: 'name', header: 'Asset' },
  { accessorKey: 'price', header: 'Price', meta: { align: 'end' as const } },
];

const TestDataTable = ({
  data = testData,
  columns = testColumns,
  appearance,
  hideHeader,
}: {
  data?: TestData[];
  columns?: ColumnDef<TestData>[];
  appearance?: 'no-background' | 'plain';
  hideHeader?: boolean;
}) => {
  const table = useLumenDataTable({ data, columns });
  return (
    <DataTableRoot
      table={table}
      appearance={appearance}
      hideHeader={hideHeader}
    >
      <DataTable />
    </DataTableRoot>
  );
};

const getColElements = (container: HTMLElement): HTMLTableColElement[] =>
  Array.from(container.querySelectorAll('colgroup col'));

describe('DataTable', () => {
  it('should render a table with headers and rows from data', () => {
    render(<TestDataTable />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Asset')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Solana')).toBeInTheDocument();
  });

  it('should render all data cells', () => {
    render(<TestDataTable />);

    expect(screen.getByText('$43,250.00')).toBeInTheDocument();
    expect(screen.getByText('$2,650.00')).toBeInTheDocument();
    expect(screen.getByText('$98.50')).toBeInTheDocument();
  });

  it('should render correct number of rows', () => {
    render(<TestDataTable />);

    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('should render with custom cell renderer', () => {
    const columnsWithCustomCell: ColumnDef<TestData>[] = [
      {
        accessorKey: 'name',
        header: 'Asset',
        cell: ({ row }) => (
          <span data-testid='custom-cell'>{row.original.name}</span>
        ),
      },
      { accessorKey: 'price', header: 'Price' },
    ];

    render(<TestDataTable columns={columnsWithCustomCell} />);

    const customCells = screen.getAllByTestId('custom-cell');
    expect(customCells).toHaveLength(3);
    expect(customCells[0]).toHaveTextContent('Bitcoin');
  });

  it('should render with empty data', () => {
    render(<TestDataTable data={[]} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Asset')).toBeInTheDocument();
    // Only header row, no data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});

describe('DataTable row props', () => {
  it('should apply props from the TanStack row to each data row', () => {
    const rowElements = new Map<number, HTMLTableRowElement>();
    const getRowProps = vi.fn((row: Row<TestData>) => ({
      'data-testid': `row-${row.original.id}`,
      className: 'custom-row',
      ref: (element: HTMLTableRowElement | null) => {
        if (element) rowElements.set(row.original.id, element);
      },
    }));
    const TestComponent = () => {
      const table = useLumenDataTable({ data: testData, columns: testColumns });
      return (
        <DataTableRoot table={table} getRowProps={getRowProps}>
          <DataTable />
        </DataTableRoot>
      );
    };

    render(<TestComponent />);

    expect(getRowProps).toHaveBeenCalledTimes(testData.length);
    expect(getRowProps.mock.calls[0][0].original).toBe(testData[0]);
    testData.forEach(({ id }) => {
      const row = screen.getByTestId(`row-${id}`);
      expect(row).toHaveClass('custom-row');
      expect(rowElements.get(id)).toBe(row);
    });
  });

  it('should apply props only to data rows in a grouped table', () => {
    const TestComponent = () => {
      const table = useLumenDataTable({ data: testData, columns: testColumns });
      return (
        <DataTableRoot
          table={table}
          groupBy={(row) => row.original.price}
          getRowProps={(row) => ({
            'data-testid': `row-${row.original.id}`,
          })}
        >
          <DataTable />
        </DataTableRoot>
      );
    };

    const { container } = render(<TestComponent />);

    expect(screen.getAllByTestId(/^row-/)).toHaveLength(testData.length);
    expect(container.querySelector('thead tr')).not.toHaveAttribute(
      'data-testid',
    );
    expect(
      container.querySelectorAll('tbody > tr:not([data-testid])'),
    ).toHaveLength(testData.length);
  });

  it('should keep onRowClick behavior when row props are provided', () => {
    const onRowClick = vi.fn();
    const TestComponent = () => {
      const table = useLumenDataTable({ data: testData, columns: testColumns });
      return (
        <DataTableRoot
          table={table}
          onRowClick={onRowClick}
          getRowProps={(row) => ({
            'data-testid': `row-${row.original.id}`,
          })}
        >
          <DataTable />
        </DataTableRoot>
      );
    };

    render(<TestComponent />);
    fireEvent.click(screen.getByTestId('row-1'));

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0].original).toBe(testData[0]);
  });
});

describe('DataTableColGroup', () => {
  it('should render one col element per visible column', () => {
    const { container } = render(<TestDataTable />);

    expect(container.querySelector('colgroup')).toBeInTheDocument();
    expect(getColElements(container)).toHaveLength(2);
  });

  it('should apply meta.className width tokens to col elements', () => {
    const columns: ColumnDef<TestData>[] = [
      { accessorKey: 'name', header: 'Asset', meta: { className: 'w-224' } },
      {
        accessorKey: 'price',
        header: 'Price',
        meta: { className: 'w-144', align: 'end' as const },
      },
    ];

    const { container } = render(<TestDataTable columns={columns} />);
    const cols = getColElements(container);

    expect(cols[0]).toHaveClass('w-224');
    expect(cols[1]).toHaveClass('w-144');
  });

  it('should render colgroup when hideHeader is true', () => {
    const columns: ColumnDef<TestData>[] = [
      { accessorKey: 'name', header: 'Asset', meta: { className: 'w-224' } },
      { accessorKey: 'price', header: 'Price', meta: { className: 'w-80' } },
    ];

    const { container } = render(
      <TestDataTable columns={columns} hideHeader />,
    );
    const cols = getColElements(container);

    expect(screen.queryByText('Asset')).not.toBeInTheDocument();
    expect(screen.queryByText('Price')).not.toBeInTheDocument();
    expect(cols).toHaveLength(2);
    expect(cols[0]).toHaveClass('w-224');
    expect(cols[1]).toHaveClass('w-80');
  });
});

describe('DataTableRoot', () => {
  it('should forward ref to wrapper div', () => {
    const ref = { current: null };
    const TestComponent = () => {
      const table = useLumenDataTable({ data: testData, columns: testColumns });
      return (
        <DataTableRoot ref={ref} table={table}>
          <DataTable />
        </DataTableRoot>
      );
    };

    render(<TestComponent />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should apply custom className to root', () => {
    const TestComponent = () => {
      const table = useLumenDataTable({ data: testData, columns: testColumns });
      return (
        <DataTableRoot table={table} className='mt-8'>
          <DataTable />
        </DataTableRoot>
      );
    };

    const { container } = render(<TestComponent />);
    expect(container.firstChild).toHaveClass('mt-8');
  });
});
