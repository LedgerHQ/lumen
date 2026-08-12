import { cssVar } from '@ledgerhq/lumen-design-core';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Legend } from './Legend';

const sampleItems = [
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    color: cssVar('var(--color-crypto-bitcoin)'),
  },
  {
    id: 'ethereum',
    label: 'Ethereum',
    color: cssVar('var(--color-crypto-ethereum)'),
  },
  {
    id: 'tether',
    label: 'Tether',
    color: cssVar('var(--color-crypto-tether-usdt)'),
  },
];

describe('Legend', () => {
  it('renders one item per entry in order', () => {
    render(<Legend items={sampleItems} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.textContent)).toEqual([
      'Bitcoin',
      'Ethereum',
      'Tether',
    ]);
  });

  it('renders nothing when items is empty', () => {
    const { container } = render(<Legend items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('falls back to id when label is omitted', () => {
    render(<Legend items={[{ id: 'segment-a' }]} />);
    expect(screen.getByText('segment-a')).toBeInTheDocument();
  });

  it('truncates a label that does not fit the available width', () => {
    render(<Legend items={[{ id: 'a', label: 'A very long series label' }]} />);
    expect(screen.getByText('A very long series label')).toHaveClass(
      'truncate',
    );
  });

  it('uses the item color on the swatch', () => {
    render(
      <Legend items={[{ id: 'a', label: 'A', color: 'rgb(255, 0, 0)' }]} />,
    );
    expect(screen.getByTestId('legend-swatch')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('uses the default swatch color when color is omitted', () => {
    render(<Legend items={[{ id: 'a', label: 'A' }]} />);
    expect(screen.getByTestId('legend-swatch')).toHaveStyle({
      backgroundColor: 'var(--background-muted-strong)',
    });
  });

  it('does not expose focusable legend items', () => {
    render(<Legend items={sampleItems} />);
    screen.getAllByRole('listitem').forEach((item) => {
      expect(item).not.toHaveAttribute('tabindex');
      expect(item.querySelector('button')).toBeNull();
    });
  });

  it('exposes the legend group with an accessible label', () => {
    render(<Legend items={sampleItems} ariaLabel='Portfolio allocation' />);
    expect(
      screen.getByRole('list', { name: 'Portfolio allocation' }),
    ).toBeInTheDocument();
  });

  it('merges consumer classes into the root', () => {
    render(<Legend items={sampleItems} className='max-w-176' />);
    expect(screen.getByRole('list')).toHaveClass('max-w-176');
  });
});
