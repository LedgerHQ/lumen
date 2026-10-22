import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
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
