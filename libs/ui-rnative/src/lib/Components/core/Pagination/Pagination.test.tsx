import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { getPaginationRange } from '@ledgerhq/lumen-utils-shared';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Pagination } from './Pagination';

const TestWrapper = ({
  children,
  locale = 'en',
}: {
  children: ReactNode;
  locale?: 'en' | 'fr';
}) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale={locale}>
    {children}
  </ThemeProvider>
);

// Jest has no layout engine, so layouts are simulated: 1-digit pages and
// ellipses are 40 wide, 2-digit pages 48, separated by an 8 gap.
const ITEM_GAP = 8;
const getItemWidth = (item: number | string): number =>
  typeof item === 'number' ? 32 + String(item).length * 8 : 40;

const fireLayout = (
  element: Parameters<typeof fireEvent>[0],
  x: number,
  width: number,
): void => {
  fireEvent(element, 'layout', {
    nativeEvent: { layout: { x, y: 0, width, height: 40 } },
  });
};

const layoutPages = (page: number, totalPages: number): void => {
  let x = 0;
  for (const item of getPaginationRange(page, totalPages)) {
    const width = getItemWidth(item);
    if (typeof item === 'number') {
      fireLayout(screen.getByLabelText(`Page ${item}`), x, width);
    }
    x += width + ITEM_GAP;
  }
};

const layoutViewport = (width: number): void => {
  fireLayout(screen.UNSAFE_getByType(ScrollView), 0, width);
};

const ControlledPagination = ({ initialPage }: { initialPage: number }) => {
  const [page, setPage] = useState(initialPage);
  return <Pagination page={page} totalPages={20} onPageChange={setPage} />;
};

describe('Pagination', () => {
  it('should render page buttons with the active page selected', () => {
    render(
      <TestWrapper>
        <Pagination page={2} totalPages={5} onPageChange={jest.fn()} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Pagination')).toBeTruthy();
    expect(screen.getByLabelText('Page 2')).toBeSelected();
    expect(screen.getByLabelText('Page 3')).not.toBeSelected();
  });

  it('should call onPageChange when a page is pressed', () => {
    const onPageChange = jest.fn();

    render(
      <TestWrapper>
        <Pagination page={1} totalPages={5} onPageChange={onPageChange} />
      </TestWrapper>,
    );

    fireEvent.press(screen.getByLabelText('Page 3'));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange with the adjacent pages from previous and next', () => {
    const onPageChange = jest.fn();

    render(
      <TestWrapper>
        <Pagination page={2} totalPages={5} onPageChange={onPageChange} />
      </TestWrapper>,
    );

    fireEvent.press(screen.getByLabelText('Previous page'));
    fireEvent.press(screen.getByLabelText('Next page'));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('should disable previous on the first page and next on the last page', () => {
    const onPageChange = jest.fn();

    const { rerender } = render(
      <TestWrapper>
        <Pagination page={1} totalPages={5} onPageChange={onPageChange} />
      </TestWrapper>,
    );

    fireEvent.press(screen.getByLabelText('Previous page'));

    rerender(
      <TestWrapper>
        <Pagination page={5} totalPages={5} onPageChange={onPageChange} />
      </TestWrapper>,
    );

    fireEvent.press(screen.getByLabelText('Next page'));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should clamp page above totalPages to totalPages', () => {
    render(
      <TestWrapper>
        <Pagination page={99} totalPages={5} onPageChange={jest.fn()} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Page 5')).toBeSelected();
  });

  it('should collapse distant pages behind ellipsis markers hidden from assistive technology', () => {
    render(
      <TestWrapper>
        <Pagination page={10} totalPages={20} onPageChange={jest.fn()} />
      </TestWrapper>,
    );

    expect(screen.queryByText('…')).toBeNull();
    expect(
      screen.getAllByText('…', { includeHiddenElements: true }),
    ).toHaveLength(2);
    expect(screen.queryByLabelText('Page 5')).toBeNull();
  });

  it('should render the page buttons inside a horizontal scroll view', () => {
    render(
      <TestWrapper>
        <Pagination page={10} totalPages={20} onPageChange={jest.fn()} />
      </TestWrapper>,
    );

    expect(screen.UNSAFE_getByType(ScrollView).props.horizontal).toBe(true);
  });

  describe('active page visibility', () => {
    let scrollTo: jest.SpiedFunction<ScrollView['scrollTo']>;

    beforeEach(() => {
      scrollTo = jest
        .spyOn(ScrollView.prototype, 'scrollTo')
        .mockImplementation(() => undefined);
    });

    afterEach(() => {
      scrollTo.mockRestore();
    });

    it('should center the active page once the row is laid out', () => {
      render(
        <TestWrapper>
          <Pagination page={10} totalPages={20} onPageChange={jest.fn()} />
        </TestWrapper>,
      );

      layoutPages(10, 20);
      expect(scrollTo).not.toHaveBeenCalled();

      layoutViewport(240);

      // Page 10 spans 144–192, so its center (168) minus half the viewport.
      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 48, animated: false });
    });

    it('should follow the active page across an ellipsis boundary', () => {
      render(
        <TestWrapper>
          <ControlledPagination initialPage={3} />
        </TestWrapper>,
      );

      layoutPages(3, 20);
      layoutViewport(160);
      // Page 3 spans 96–136 in [1 2 3 4 5 … 20].
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 36, animated: false });

      fireEvent.press(screen.getByLabelText('Next page'));
      expect(screen.getByLabelText('Page 4')).toBeSelected();
      expect(screen.queryByLabelText('Page 2')).toBeNull();

      layoutPages(4, 20);
      // Page 4 spans 144–184 in [1 … 3 4 5 … 20].
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 84, animated: false });
    });

    it('should scroll to an already measured page when the row does not move', () => {
      render(
        <TestWrapper>
          <ControlledPagination initialPage={1} />
        </TestWrapper>,
      );

      layoutPages(1, 20);
      layoutViewport(80);
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 0, animated: false });

      // [1 2 3 4 5 … 20] is unchanged, so no layout event follows the press.
      fireEvent.press(screen.getByLabelText('Next page'));

      // Page 2 spans 48–88.
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 28, animated: false });
    });

    it('should scroll once a newly shown page is measured', () => {
      const { rerender } = render(
        <TestWrapper>
          <Pagination page={10} totalPages={20} onPageChange={jest.fn()} />
        </TestWrapper>,
      );

      layoutPages(10, 20);
      layoutViewport(240);
      scrollTo.mockClear();

      rerender(
        <TestWrapper>
          <Pagination page={15} totalPages={20} onPageChange={jest.fn()} />
        </TestWrapper>,
      );
      expect(scrollTo).not.toHaveBeenCalled();

      layoutPages(15, 20);
      // Page 15 spans 152–200 in [1 … 14 15 16 … 20].
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 56, animated: false });
    });

    it('should recenter when the viewport is resized', () => {
      render(
        <TestWrapper>
          <Pagination page={10} totalPages={20} onPageChange={jest.fn()} />
        </TestWrapper>,
      );

      layoutPages(10, 20);
      layoutViewport(240);
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 48, animated: false });

      layoutViewport(320);
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 8, animated: false });

      // Wider than the content's left half: clamped to the start.
      layoutViewport(400);
      expect(scrollTo).toHaveBeenLastCalledWith({ x: 0, animated: false });
    });
  });

  it('should return null when totalPages is 0', () => {
    render(
      <TestWrapper>
        <Pagination
          testID='pagination'
          page={1}
          totalPages={0}
          onPageChange={jest.fn()}
        />
      </TestWrapper>,
    );

    expect(screen.queryByTestId('pagination')).toBeNull();
  });

  describe('compact density', () => {
    it('should render the current of total label instead of page buttons', () => {
      render(
        <TestWrapper>
          <Pagination
            page={2}
            totalPages={8}
            density='compact'
            onPageChange={jest.fn()}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('2 of 8')).toBeTruthy();
      expect(screen.queryByLabelText('Page 2')).toBeNull();
      expect(screen.UNSAFE_queryByType(ScrollView)).toBeNull();
    });

    it('should localize the label', () => {
      render(
        <TestWrapper locale='fr'>
          <Pagination
            page={2}
            totalPages={8}
            density='compact'
            onPageChange={jest.fn()}
          />
        </TestWrapper>,
      );

      expect(screen.getByText('2 sur 8')).toBeTruthy();
    });

    it('should navigate with previous and next', () => {
      const onPageChange = jest.fn();

      render(
        <TestWrapper>
          <Pagination
            page={2}
            totalPages={8}
            density='compact'
            onPageChange={onPageChange}
          />
        </TestWrapper>,
      );

      fireEvent.press(screen.getByLabelText('Previous page'));
      fireEvent.press(screen.getByLabelText('Next page'));

      expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
      expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
    });
  });
});
