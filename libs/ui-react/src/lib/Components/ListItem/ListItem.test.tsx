import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemContentRow,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
} from './ListItem';
import { ListItemProps } from './types';

const renderListItem = (props: Partial<ListItemProps> = {}) =>
  render(
    <ListItem data-testid='list-item' {...props}>
      <ListItemLeading data-testid='leading'>
        <ListItemContent>
          <ListItemTitle>Title</ListItemTitle>
          <ListItemDescription>Description</ListItemDescription>
        </ListItemContent>
      </ListItemLeading>
      <ListItemTrailing data-testid='trailing'>
        <span>Trailing</span>
      </ListItemTrailing>
    </ListItem>,
  );

describe('ListItem', () => {
  it('renders all sub-components', () => {
    renderListItem();

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Trailing')).toBeInTheDocument();
  });

  it('forwards data-testid', () => {
    renderListItem();

    expect(screen.getByTestId('list-item')).toBeInTheDocument();
    expect(screen.getByTestId('leading')).toBeInTheDocument();
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = { current: null };
    render(
      <ListItem ref={ref}>
        <ListItemLeading>
          <ListItemTitle>Title</ListItemTitle>
        </ListItemLeading>
      </ListItem>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    renderListItem({ className: 'w-320' });
    expect(screen.getByTestId('list-item')).toHaveClass('w-320');
  });

  describe('density', () => {
    it('defaults to expanded (h-64)', () => {
      renderListItem();
      expect(screen.getByTestId('list-item')).toHaveClass('h-64');
    });

    it('applies h-64 for expanded density', () => {
      renderListItem({ density: 'expanded' });
      expect(screen.getByTestId('list-item')).toHaveClass('h-64');
    });

    it('applies h-40 for compact density', () => {
      renderListItem({ density: 'compact' });
      expect(screen.getByTestId('list-item')).toHaveClass('h-40');
    });
  });

  describe('onClick', () => {
    it('applies interactive styles when onClick is provided', () => {
      renderListItem({ onClick: vi.fn() });
      expect(screen.getByTestId('list-item')).toHaveClass('cursor-pointer');
    });

    it('does not apply interactive styles without onClick', () => {
      renderListItem();
      expect(screen.getByTestId('list-item')).not.toHaveClass('cursor-pointer');
    });

    it('triggers onClick on click', () => {
      const onClick = vi.fn();
      renderListItem({ onClick });

      fireEvent.click(screen.getByTestId('list-item'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled', () => {
    it('sets aria-disabled on the interactive element', () => {
      renderListItem({ onClick: vi.fn(), disabled: true });
      expect(screen.getByTestId('list-item')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('does not trigger onClick when disabled', () => {
      const onClick = vi.fn();
      renderListItem({ onClick, disabled: true });

      fireEvent.click(screen.getByTestId('list-item'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('ListItemContentRow', () => {
    it('renders title alongside additional content in a row', () => {
      render(
        <ListItem>
          <ListItemLeading>
            <ListItemContent>
              <ListItemContentRow data-testid='content-row'>
                <ListItemTitle>Bitcoin</ListItemTitle>
                <span>Tag</span>
              </ListItemContentRow>
              <ListItemDescription>BTC</ListItemDescription>
            </ListItemContent>
          </ListItemLeading>
        </ListItem>,
      );

      expect(screen.getByTestId('content-row')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Tag')).toBeInTheDocument();
      expect(screen.getByText('BTC')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = { current: null };
      render(
        <ListItem>
          <ListItemLeading>
            <ListItemContent>
              <ListItemContentRow ref={ref}>
                <ListItemTitle>Title</ListItemTitle>
              </ListItemContentRow>
            </ListItemContent>
          </ListItemLeading>
        </ListItem>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
