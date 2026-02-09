import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  Table,
  TableRoot,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderRow,
  TableHeaderCell,
  TableCell,
  TableCellContent,
  TableActionBar,
  TableActionBarLeading,
  TableActionBarTrailing,
  TableLoadingRow,
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
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
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
});

describe('TableHead', () => {
  it('should render a thead element', () => {
    renderTable(
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Header</TableHeaderCell>
        </TableHeaderRow>
      </TableHead>,
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
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Col</TableHeaderCell>
        </TableHeaderRow>
      </TableHead>,
    );
    expect(
      screen.getByRole('columnheader', { name: 'Col' }),
    ).toBeInTheDocument();
  });
});

describe('TableHeaderCell', () => {
  it('should render a th element with children', () => {
    renderTable(
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Amount</TableHeaderCell>
        </TableHeaderRow>
      </TableHead>,
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

describe('TableCellContent', () => {
  it('should render title and description', () => {
    render(<TableCellContent title='Bitcoin' description='BTC' />);
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('should render leading content', () => {
    render(
      <TableCellContent
        leading={<span data-testid='icon'>icon</span>}
        title='Ethereum'
      />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
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
  it('should render when isLoading is true', () => {
    render(
      <TableRoot isLoading>
        <TableLoadingRow data-testid='loading' />
      </TableRoot>,
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should not render when isLoading is false', () => {
    render(
      <TableRoot isLoading={false}>
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
