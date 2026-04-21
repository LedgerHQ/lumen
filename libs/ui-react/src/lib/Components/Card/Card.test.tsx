import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  Card,
  CardHeader,
  CardLeading,
  CardContent,
  CardContentRow,
  CardContentTitle,
  CardContentDescription,
  CardTrailing,
  CardFooter,
  CardFooterActions,
} from './Card';
import type { CardProps } from './types';

const renderCard = (props: Partial<CardProps> = {}) =>
  render(
    <Card data-testid='card' {...props}>
      <CardHeader data-testid='card-header'>
        <CardLeading>
          <CardContent>
            <CardContentTitle>Title</CardContentTitle>
            <CardContentDescription>Description</CardContentDescription>
          </CardContent>
        </CardLeading>
        <CardTrailing>
          <CardContent>
            <CardContentTitle>$100</CardContentTitle>
          </CardContent>
        </CardTrailing>
      </CardHeader>
      <CardFooter data-testid='card-footer'>
        <CardContentDescription>Footer text</CardContentDescription>
        <CardFooterActions>
          <button>Action</button>
        </CardFooterActions>
      </CardFooter>
    </Card>,
  );

describe('Card', () => {
  it('renders all sub-components', () => {
    renderCard();

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Footer text')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('forwards data-testid', () => {
    renderCard();

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = { current: null };
    render(
      <Card ref={ref}>
        <CardHeader>
          <CardLeading>
            <CardContentTitle>Title</CardContentTitle>
          </CardLeading>
        </CardHeader>
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    renderCard({ className: 'w-320' });
    expect(screen.getByTestId('card')).toHaveClass('w-320');
  });

  describe('interactive (default)', () => {
    it('has role="button" and is focusable when onClick is provided', () => {
      const onClick = vi.fn();
      renderCard({ onClick });

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('triggers onClick on click', () => {
      const onClick = vi.fn();
      renderCard({ onClick });

      fireEvent.click(screen.getByTestId('card'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('triggers onClick on Enter and Space', () => {
      const onClick = vi.fn();
      renderCard({ onClick });

      const card = screen.getByTestId('card');
      fireEvent.keyDown(card, { key: 'Enter' });
      fireEvent.keyDown(card, { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('does not trigger onClick when disabled', () => {
      const onClick = vi.fn();
      renderCard({ onClick, disabled: true });

      const card = screen.getByTestId('card');
      fireEvent.click(card);
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
      expect(card).toHaveAttribute('aria-disabled', 'true');
      expect(card).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('outlined', () => {
    it('applies selection border when outlined', () => {
      renderCard({ outlined: true });

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('border-active');
    });

    it('does not apply selection border by default', () => {
      renderCard();

      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('border-2');
      expect(card).not.toHaveClass('border-active');
    });
  });

  describe('expandable', () => {
    it('header has role="button" and aria-expanded', () => {
      const onClick = vi.fn();
      renderCard({ type: 'expandable', expanded: false, onClick });

      const header = screen.getByTestId('card-header');
      expect(header).toHaveAttribute('role', 'button');
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('header triggers onClick on click and keyboard', () => {
      const onClick = vi.fn();
      renderCard({ type: 'expandable', expanded: false, onClick });

      const header = screen.getByTestId('card-header');
      fireEvent.click(header);
      fireEvent.keyDown(header, { key: 'Enter' });
      fireEvent.keyDown(header, { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('card root is not clickable', () => {
      const onClick = vi.fn();
      renderCard({ type: 'expandable', expanded: false, onClick });

      const card = screen.getByTestId('card');
      expect(card).not.toHaveAttribute('role', 'button');
    });

    it('collapses footer when expanded is false', () => {
      renderCard({ type: 'expandable', expanded: false, onClick: vi.fn() });

      const footer = screen.getByTestId('card-footer');
      const gridWrapper = footer.parentElement!.parentElement!;
      expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
    });

    it('expands footer when expanded is true', () => {
      renderCard({ type: 'expandable', expanded: true, onClick: vi.fn() });

      const footer = screen.getByTestId('card-footer');
      const gridWrapper = footer.parentElement!.parentElement!;
      expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
    });
  });

  describe('info', () => {
    it('has no role="button" and is not focusable', () => {
      renderCard({ type: 'info' });

      const card = screen.getByTestId('card');
      expect(card).not.toHaveAttribute('role');
      expect(card).not.toHaveAttribute('tabIndex');
    });
  });

  describe('CardContentRow', () => {
    it('renders title alongside additional content in a row', () => {
      render(
        <Card>
          <CardHeader>
            <CardLeading>
              <CardContent>
                <CardContentRow data-testid='content-row'>
                  <CardContentTitle>Bitcoin</CardContentTitle>
                  <span>Tag</span>
                </CardContentRow>
                <CardContentDescription>BTC</CardContentDescription>
              </CardContent>
            </CardLeading>
          </CardHeader>
        </Card>,
      );

      expect(screen.getByTestId('content-row')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Tag')).toBeInTheDocument();
      expect(screen.getByText('BTC')).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = { current: null };
      render(
        <Card>
          <CardHeader>
            <CardLeading>
              <CardContent>
                <CardContentRow ref={ref}>
                  <CardContentTitle>Title</CardContentTitle>
                </CardContentRow>
              </CardContent>
            </CardLeading>
          </CardHeader>
        </Card>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
