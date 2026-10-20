import type { ColumnDef, PaginationState, Row } from '@tanstack/react-table';
import { getPaginationRowModel } from '@tanstack/react-table';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import {
  DataTableRoot,
  DataTable,
  DataTablePagination,
  DataTableShowMore,
} from './DataTable';
import type { DataTableShowMoreProps } from './types';
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

describe('DataTable horizontal layout', () => {
  it('should shrink to the container by default', () => {
    render(<TestDataTable />);

    expect(screen.getByRole('table')).toHaveClass('max-w-full');
  });

  it('should forward horizontalLayout to the table', () => {
    const TestComponent = () => {
      const table = useLumenDataTable({ data: testData, columns: testColumns });
      return (
        <DataTableRoot
          table={table}
          horizontalLayout={{
            base: { type: 'scroll', minWidth: 960 },
            lg: { type: 'shrink' },
          }}
        >
          <DataTable />
        </DataTableRoot>
      );
    };

    render(<TestComponent />);

    const table = screen.getByRole('table');
    expect(table).toHaveClass('max-w-none', 'lg:max-w-full');
    expect(table.style.getPropertyValue('--table-min-width-base')).toBe(
      '960px',
    );
  });
});

// Translations resolve to their keys in tests.
const SHOW_MORE = 'components.table.showMore';
const LOADING = 'components.spinner.loadingAriaLabel';

const pagedData: TestData[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Asset ${index + 1}`,
  price: `$${index + 1}.00`,
}));

// 1 header row + body rows
const getBodyRowCount = (): number => screen.getAllByRole('row').length - 1;

describe('DataTable children', () => {
  it('should render children inside the scroll container, after the table', () => {
    const TestComponent = () => {
      const table = useLumenDataTable({ data: testData, columns: testColumns });
      return (
        <DataTableRoot table={table}>
          <DataTable data-testid='scroll-container'>
            <div data-testid='footer' />
          </DataTable>
        </DataTableRoot>
      );
    };

    render(<TestComponent />);

    const container = screen.getByTestId('scroll-container');
    const footer = screen.getByTestId('footer');
    expect(container).toContainElement(footer);
    expect(container.lastElementChild).toBe(footer);
  });
});

describe('DataTable loading row', () => {
  const TestComponent = ({
    paginationMode,
  }: {
    paginationMode?: 'infinite-scroll' | 'none';
  }) => {
    const table = useLumenDataTable({ data: testData, columns: testColumns });
    return (
      <DataTableRoot
        table={table}
        loading
        onScrollBottom={vi.fn()}
        paginationMode={paginationMode}
      >
        <DataTable />
      </DataTableRoot>
    );
  };

  it('should render when onScrollBottom is set and loading', () => {
    render(<TestComponent />);

    expect(screen.getByRole('img', { name: LOADING })).toBeInTheDocument();
  });

  it('should not render when paginationMode is explicitly none', () => {
    render(<TestComponent paginationMode='none' />);

    expect(
      screen.queryByRole('img', { name: LOADING }),
    ).not.toBeInTheDocument();
  });
});

describe('DataTablePagination', () => {
  const TestComponent = () => {
    const table = useLumenDataTable({
      data: pagedData,
      columns: testColumns,
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 5 } },
    });
    return (
      <DataTableRoot table={table}>
        <DataTable />
        <DataTablePagination className='self-center' />
      </DataTableRoot>
    );
  };

  it('should render one page button per table page', () => {
    render(<TestComponent />);

    const pagination = screen.getByRole('navigation');
    expect(
      within(pagination).getByRole('button', { current: 'page' }),
    ).toHaveTextContent('1');
    expect(within(pagination).getByText('3')).toBeInTheDocument();
    expect(within(pagination).queryByText('4')).not.toBeInTheDocument();
  });

  it('should show the rows of the selected page', () => {
    render(<TestComponent />);

    const pagination = screen.getByRole('navigation');
    fireEvent.click(within(pagination).getByText('2'));

    expect(screen.getByText('Asset 6')).toBeInTheDocument();
    expect(screen.queryByText('Asset 1')).not.toBeInTheDocument();
    expect(
      within(pagination).getByRole('button', { current: 'page' }),
    ).toHaveTextContent('2');
  });

  it('should drive controlled server-side pagination', () => {
    const onPaginationChange = vi.fn();
    const ServerComponent = () => {
      const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
      });
      // The server returns only the requested page.
      const start = pagination.pageIndex * pagination.pageSize;
      const table = useLumenDataTable({
        data: pagedData.slice(start, start + pagination.pageSize),
        columns: testColumns,
        manualPagination: true,
        rowCount: pagedData.length,
        state: { pagination },
        onPaginationChange: (updater) => {
          onPaginationChange(updater);
          setPagination(updater);
        },
      });
      return (
        <DataTableRoot table={table}>
          <DataTable />
          <DataTablePagination />
        </DataTableRoot>
      );
    };

    render(<ServerComponent />);

    const pagination = screen.getByRole('navigation');
    expect(within(pagination).getByText('3')).toBeInTheDocument();
    expect(within(pagination).queryByText('4')).not.toBeInTheDocument();

    fireEvent.click(within(pagination).getByText('2'));

    expect(onPaginationChange).toHaveBeenCalledTimes(1);
    expect(
      within(pagination).getByRole('button', { current: 'page' }),
    ).toHaveTextContent('2');
    expect(screen.getByText('Asset 6')).toBeInTheDocument();
    expect(screen.queryByText('Asset 1')).not.toBeInTheDocument();
  });

  it('should forward Pagination props', () => {
    render(<TestComponent />);

    expect(screen.getByRole('navigation')).toHaveClass('self-center');
  });
});

describe('DataTableShowMore', () => {
  const TestComponent = ({
    loading,
    ...props
  }: DataTableShowMoreProps & { loading?: boolean }) => {
    const table = useLumenDataTable({
      data: pagedData,
      columns: testColumns,
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 5 } },
    });
    return (
      <DataTableRoot table={table} loading={loading}>
        <DataTable>
          <DataTableShowMore {...props} />
        </DataTable>
      </DataTableRoot>
    );
  };

  it('should add the initial page size of rows on click', () => {
    render(<TestComponent />);

    expect(getBodyRowCount()).toBe(5);
    fireEvent.click(screen.getByRole('button', { name: SHOW_MORE }));
    expect(getBodyRowCount()).toBe(10);
  });

  it('should add step rows on click', () => {
    render(<TestComponent step={2} />);

    fireEvent.click(screen.getByRole('button', { name: SHOW_MORE }));
    expect(getBodyRowCount()).toBe(7);
  });

  it('should hide once all rows are shown', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByRole('button', { name: SHOW_MORE }));
    fireEvent.click(screen.getByRole('button', { name: SHOW_MORE }));

    expect(getBodyRowCount()).toBe(12);
    expect(
      screen.queryByRole('button', { name: SHOW_MORE }),
    ).not.toBeInTheDocument();
  });

  it('should call onShowMore instead of growing the page size', () => {
    const onShowMore = vi.fn();
    render(<TestComponent onShowMore={onShowMore} />);

    fireEvent.click(screen.getByRole('button', { name: SHOW_MORE }));

    expect(onShowMore).toHaveBeenCalledTimes(1);
    expect(getBodyRowCount()).toBe(5);
  });

  it('should not render when hasMore is false', () => {
    render(<TestComponent hasMore={false} />);

    expect(
      screen.queryByRole('button', { name: SHOW_MORE }),
    ).not.toBeInTheDocument();
  });

  it('should show the loading state and ignore clicks while loading', () => {
    const onShowMore = vi.fn();
    render(<TestComponent onShowMore={onShowMore} loading />);

    const button = screen.getByRole('button', { name: new RegExp(SHOW_MORE) });
    expect(within(button).getByRole('img', { name: LOADING })).toBeVisible();

    fireEvent.click(button);
    expect(onShowMore).not.toHaveBeenCalled();
  });

  it('should render a custom label', () => {
    render(<TestComponent>Load more assets</TestComponent>);

    expect(
      screen.getByRole('button', { name: 'Load more assets' }),
    ).toBeInTheDocument();
  });
});
