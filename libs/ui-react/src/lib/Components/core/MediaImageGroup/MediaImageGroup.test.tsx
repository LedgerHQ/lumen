import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { MediaImageGroup } from './MediaImageGroup';

const items = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    alt: `item-${i}`,
    fallback: 'A',
  }));

describe('MediaImageGroup', () => {
  describe('Rendering', () => {
    it('should render every item and no badge within maxVisible', () => {
      render(<MediaImageGroup data={items(3)} maxVisible={4} />);

      expect(screen.getAllByRole('img')).toHaveLength(3);
      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
    });

    it('should render the overflow badge within the maxVisible budget', () => {
      render(<MediaImageGroup data={items(10)} maxVisible={4} />);

      expect(screen.getAllByRole('img')).toHaveLength(3);
      expect(screen.getByText('+7')).toBeInTheDocument();
    });

    it('should render nothing when data is empty', () => {
      const { container } = render(<MediaImageGroup data={[]} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should not forward the item id to the rendered media image', () => {
      render(
        <MediaImageGroup
          data={[{ id: 'btc', alt: 'Bitcoin', fallback: 'B' }]}
        />,
      );

      expect(screen.getByRole('img', { name: 'Bitcoin' })).not.toHaveAttribute(
        'id',
      );
    });
  });

  describe('renderItem', () => {
    it('should pass the group size and shape to renderItem', () => {
      const contexts: unknown[] = [];
      render(
        <MediaImageGroup
          data={[{ id: 'btc' }, { id: 'eth' }]}
          size={24}
          shape='square'
          renderItem={(item, context) => {
            contexts.push(context);
            return <span>{item.id}</span>;
          }}
        />,
      );

      expect(screen.getByText('btc')).toBeInTheDocument();
      expect(screen.getByText('eth')).toBeInTheDocument();
      expect(contexts).toEqual([
        { size: 24, shape: 'square' },
        { size: 24, shape: 'square' },
      ]);
    });

    it('should only render the visible items', () => {
      render(
        <MediaImageGroup
          data={Array.from({ length: 6 }, (_, i) => ({ id: `asset-${i}` }))}
          maxVisible={3}
          renderItem={(item) => <span>{item.id}</span>}
        />,
      );

      expect(screen.getByText('asset-0')).toBeInTheDocument();
      expect(screen.getByText('asset-1')).toBeInTheDocument();
      expect(screen.queryByText('asset-2')).not.toBeInTheDocument();
      expect(screen.getByText('+4')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should expose a group role and forward props to the root', () => {
      render(
        <MediaImageGroup
          data={items(2)}
          aria-label='Assets'
          data-testid='group'
        />,
      );

      expect(screen.getByRole('group', { name: 'Assets' })).toBe(
        screen.getByTestId('group'),
      );
    });

    it('should forward overflowTestID to the overflow badge', () => {
      render(
        <MediaImageGroup
          data={items(10)}
          maxVisible={4}
          overflowTestID='overflow'
        />,
      );

      expect(screen.getByTestId('overflow')).toHaveTextContent('+7');
    });
  });
});
