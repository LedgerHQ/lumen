import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  Table,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderRow,
  TableHeaderCell,
  TableCell,
  TableCellItem,
  TableCellContent,
  TableCellContentTitle,
  TableCellContentDescription,
  TableCellContentRow,
  TableActionBar,
  TableActionBarLeading,
  TableActionBarTrailing,
  TableLoadingRow,
  TableGroupHeaderRow,
  TableInfoIcon,
  TableSortButton,
} from './Table';

const renderTable = (ui: React.ReactNode) =>
  render(
    <TableRoot>
      <Table>{ui}</Table>
    </TableRoot>,
  );

describe('Table', () => {
  it('should render a basic table structure', () => {
    render(
      <TableRoot>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableRoot>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  describe('Horizontal layout', () => {
    it('should shrink to the container by default', () => {
      renderTable(<tbody />);

      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-fixed', 'max-w-full');
      expect(table).not.toHaveClass('max-w-none');
    });

    it('should shrink when rendered without TableRoot', () => {
      render(
        <Table>
          <tbody />
        </Table>,
      );

      expect(screen.getByRole('table')).toHaveClass('max-w-full');
    });

    it('should let the consumer className override the layout classes', () => {
      render(
        <Table className='max-w-md table-auto'>
          <tbody />
        </Table>,
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-auto', 'max-w-md');
      expect(table).not.toHaveClass('table-fixed', 'max-w-full');
    });

    it('should keep at least minWidth in scroll layout', () => {
      render(
        <TableRoot horizontalLayout={{ type: 'scroll', minWidth: 960 }}>
          <Table style={{ color: 'red' }}>
            <tbody />
          </Table>
        </TableRoot>,
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass('max-w-none', 'min-w-(--table-min-width-base)');
      expect(table).not.toHaveClass('max-w-full');
      expect(table.style.getPropertyValue('--table-min-width-base')).toBe(
        '960px',
      );
      expect(table.style.color).toBe('red');
    });

    it('should size the table from its columns in scroll layout without minWidth', () => {
      render(
        <TableRoot horizontalLayout={{ type: 'scroll' }}>
          <Table>
            <tbody />
          </Table>
        </TableRoot>,
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass('table-fixed', 'max-w-none');
      expect(table.style.getPropertyValue('--table-min-width-base')).toBe('');
    });

    it('should resolve a layout per breakpoint', () => {
      render(
        <TableRoot
          horizontalLayout={{
            base: { type: 'scroll', minWidth: 640 },
            md: { type: 'scroll', minWidth: 960 },
            lg: { type: 'shrink' },
          }}
        >
          <Table>
            <tbody />
          </Table>
        </TableRoot>,
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass(
        'max-w-none',
        'md:min-w-(--table-min-width-md)',
        'lg:max-w-full',
      );
      expect(table.style.getPropertyValue('--table-min-width-base')).toBe(
        '640px',
      );
      expect(table.style.getPropertyValue('--table-min-width-md')).toBe(
        '960px',
      );
      expect(table.style.getPropertyValue('--table-min-width-lg')).toBe('');
    });

    it('should shrink below the first breakpoint when base is omitted', () => {
      render(
        <TableRoot horizontalLayout={{ md: { type: 'scroll', minWidth: 960 } }}>
          <Table>
            <tbody />
          </Table>
        </TableRoot>,
      );

      expect(screen.getByRole('table')).toHaveClass(
        'max-w-full',
        'md:max-w-none',
      );
    });
  });
});

describe('TableRoot', () => {
  it('should render children', () => {
    render(
      <TableRoot data-testid='root'>
        <span>content</span>
      </TableRoot>,
    );
    expect(screen.getByTestId('root')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <TableRoot data-testid='root' className='mt-2'>
        <span />
      </TableRoot>,
    );
    expect(screen.getByTestId('root')).toHaveClass('mt-2');
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(
      <TableRoot ref={ref}>
        <span />
      </TableRoot>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should call the consumer onScroll', () => {
    const onScroll = vi.fn();
    render(
      <TableRoot
        data-testid='root'
        onScroll={onScroll}
        onScrollBottom={vi.fn()}
      >
        <span />
      </TableRoot>,
    );

    fireEvent.scroll(screen.getByTestId('root'));

    expect(onScroll).toHaveBeenCalledTimes(1);
  });

  describe('Horizontal overflow', () => {
    const overflowHorizontally = (root: HTMLElement): void => {
      Object.defineProperty(root, 'scrollWidth', {
        configurable: true,
        value: 960,
      });
      Object.defineProperty(root, 'clientWidth', {
        configurable: true,
        value: 400,
      });
      fireEvent.scroll(root);
    };

    it('should hide the scrollbar and not be focusable when content fits', () => {
      render(
        <TableRoot data-testid='root' aria-label='Assets'>
          <span />
        </TableRoot>,
      );

      const root = screen.getByTestId('root');
      expect(root).not.toHaveAttribute('tabindex');
      expect(root).not.toHaveAttribute('role');
      expect(root).toHaveClass('scrollbar-none');
      expect(root).not.toHaveClass('overscroll-x-contain');
    });

    it('should show the scrollbar and become a focusable named region when content overflows', () => {
      render(
        <TableRoot data-testid='root' aria-label='Assets'>
          <span />
        </TableRoot>,
      );
      const root = screen.getByTestId('root');

      overflowHorizontally(root);

      expect(root).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('region', { name: 'Assets' })).toBe(root);
      expect(root).toHaveClass('scrollbar-custom', 'overscroll-x-contain');
      expect(root).not.toHaveClass('scrollbar-none');
    });

    it('should not add a region role without an accessible name', () => {
      render(
        <TableRoot data-testid='root'>
          <span />
        </TableRoot>,
      );
      const root = screen.getByTestId('root');

      overflowHorizontally(root);

      expect(root).toHaveAttribute('tabindex', '0');
      expect(root).not.toHaveAttribute('role');
    });

    it('should keep the consumer tabIndex', () => {
      render(
        <TableRoot data-testid='root' tabIndex={-1}>
          <span />
        </TableRoot>,
      );
      const root = screen.getByTestId('root');

      overflowHorizontally(root);

      expect(root).toHaveAttribute('tabindex', '-1');
    });
  });
});

describe('TableHeader', () => {
  it('should render a thead element', () => {
    renderTable(
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>Header</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

describe('TableBody', () => {
  it('should render a tbody element', () => {
    renderTable(
      <TableBody>
        <TableRow>
          <TableCell>Cell</TableCell>
        </TableRow>
      </TableBody>,
    );
    expect(screen.getByText('Cell')).toBeInTheDocument();
  });
});

describe('TableRow', () => {
  it('should render children', () => {
    renderTable(
      <TableBody>
        <TableRow>
          <TableCell>Row Content</TableCell>
        </TableRow>
      </TableBody>,
    );
    expect(screen.getByText('Row Content')).toBeInTheDocument();
  });

  it('should have role="button" when clickable', () => {
    renderTable(
      <TableBody>
        <TableRow clickable>
          <TableCell>Clickable</TableCell>
        </TableRow>
      </TableBody>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should not have role="button" by default', () => {
    renderTable(
      <TableBody>
        <TableRow>
          <TableCell>Normal</TableCell>
        </TableRow>
      </TableBody>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('TableHeaderRow', () => {
  it('should render inside TableRoot context', () => {
    renderTable(
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>Col</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>,
    );
    expect(
      screen.getByRole('columnheader', { name: 'Col' }),
    ).toBeInTheDocument();
  });
});

describe('TableHeaderCell', () => {
  it('should render a th element with children', () => {
    renderTable(
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>Amount</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>,
    );
    expect(
      screen.getByRole('columnheader', { name: 'Amount' }),
    ).toBeInTheDocument();
  });
});

describe('TableCell', () => {
  it('should render a td element with children', () => {
    renderTable(
      <TableBody>
        <TableRow>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableBody>,
    );
    expect(screen.getByRole('cell', { name: 'Value' })).toBeInTheDocument();
  });
});

describe('TableCellItem', () => {
  it('should render title and description', () => {
    render(
      <TableCellItem>
        <TableCellContent>
          <TableCellContentTitle>Bitcoin</TableCellContentTitle>
          <TableCellContentDescription>BTC</TableCellContentDescription>
        </TableCellContent>
      </TableCellItem>,
    );
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('should render leading content', () => {
    render(
      <TableCellItem>
        <span data-testid='icon'>icon</span>
        <TableCellContent>
          <TableCellContentTitle>Ethereum</TableCellContentTitle>
        </TableCellContent>
      </TableCellItem>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should propagate end alignment to content parts via context', () => {
    render(
      <TableCellItem align='end'>
        <TableCellContent data-testid='content'>
          <TableCellContentTitle>Bitcoin</TableCellContentTitle>
        </TableCellContent>
      </TableCellItem>,
    );
    expect(screen.getByTestId('content')).toHaveClass('text-end');
  });

  it('should render a TableCellContentRow with custom trailing content', () => {
    render(
      <TableCellItem>
        <TableCellContent>
          <TableCellContentTitle>Bitcoin</TableCellContentTitle>
          <TableCellContentRow>
            <TableCellContentDescription>BTC</TableCellContentDescription>
            <span data-testid='tag'>New</span>
          </TableCellContentRow>
        </TableCellContent>
      </TableCellItem>,
    );
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByTestId('tag')).toBeInTheDocument();
  });
});

describe('TableActionBar', () => {
  it('should render leading and trailing sections', () => {
    render(
      <TableActionBar>
        <TableActionBarLeading>
          <span>Search</span>
        </TableActionBarLeading>
        <TableActionBarTrailing>
          <span>Export</span>
        </TableActionBarTrailing>
      </TableActionBar>,
    );
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });
});

describe('TableLoadingRow', () => {
  it('should render when loading is true', () => {
    render(
      <TableRoot loading>
        <TableLoadingRow data-testid='loading' />
      </TableRoot>,
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should not render when loading is false', () => {
    render(
      <TableRoot loading={false}>
        <TableLoadingRow data-testid='loading' />
      </TableRoot>,
    );
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
});

describe('TableInfoIcon', () => {
  it('should render a button', () => {
    render(<TableInfoIcon aria-label='Info' />);
    expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
  });
});

describe('TableSortButton', () => {
  it('should render children as label', () => {
    render(<TableSortButton>Name</TableSortButton>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should call onToggleSort with "desc" when current direction is "asc"', () => {
    const onToggleSort = vi.fn();
    render(
      <TableSortButton sortDirection='asc' onToggleSort={onToggleSort}>
        Name
      </TableSortButton>,
    );
    fireEvent.click(screen.getByText('Name'));
    expect(onToggleSort).toHaveBeenCalledWith('desc');
  });

  it('should call onToggleSort with "asc" when current direction is "desc"', () => {
    const onToggleSort = vi.fn();
    render(
      <TableSortButton sortDirection='desc' onToggleSort={onToggleSort}>
        Name
      </TableSortButton>,
    );
    fireEvent.click(screen.getByText('Name'));
    expect(onToggleSort).toHaveBeenCalledWith('asc');
  });

  it('should call onToggleSort with "asc" when no direction is set', () => {
    const onToggleSort = vi.fn();
    render(<TableSortButton onToggleSort={onToggleSort}>Name</TableSortButton>);
    fireEvent.click(screen.getByText('Name'));
    expect(onToggleSort).toHaveBeenCalledWith('asc');
  });

  it('should set aria-label for asc direction', () => {
    render(<TableSortButton sortDirection='asc'>Name</TableSortButton>);
    const sortButton = screen.getAllByRole('button')[0];
    expect(sortButton).toHaveAttribute('aria-label');
  });
});

describe('TableGroupHeaderRow', () => {
  const renderGroupHeader = (
    horizontalLayout?: React.ComponentProps<
      typeof TableRoot
    >['horizontalLayout'],
  ) =>
    render(
      <TableRoot horizontalLayout={horizontalLayout}>
        <Table>
          <tbody>
            <TableGroupHeaderRow colSpan={2}>
              <span>February</span>
              <span>3 assets</span>
            </TableGroupHeaderRow>
          </tbody>
        </Table>
      </TableRoot>,
    );

  it('should render children as direct items of the bar when the table shrinks', () => {
    renderGroupHeader();

    expect(screen.getByText('February').parentElement).toHaveClass('bg-muted');
  });

  it('should keep the label sticky when the table can scroll', () => {
    renderGroupHeader({
      base: { type: 'scroll', minWidth: 960 },
      lg: { type: 'shrink' },
    });

    const wrapper = screen.getByText('February').parentElement;
    expect(wrapper).toHaveClass('sticky', 'start-12', 'flex');
    expect(wrapper).toContainElement(screen.getByText('3 assets'));
    expect(wrapper?.parentElement).toHaveClass('bg-muted');
  });
});
