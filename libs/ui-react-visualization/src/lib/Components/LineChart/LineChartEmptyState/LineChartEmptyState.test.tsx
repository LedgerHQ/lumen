import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CartesianChart } from '../../CartesianChart';
import { LineChartEmptyState } from './LineChartEmptyState';
import type { LineChartEmptyStateProps } from './types';

const renderInChart = (props: LineChartEmptyStateProps) => {
  return render(
    <CartesianChart series={[]} width={400} height={200}>
      <LineChartEmptyState {...props} />
    </CartesianChart>,
  );
};

describe('LineChartEmptyState', () => {
  it('renders the placeholder line', () => {
    const { getByTestId } = renderInChart({});

    getByTestId('chart-empty-state-line');
  });

  it('injects a keyframe style and animates the placeholder while loading', () => {
    const { getByTestId } = renderInChart({ loading: true });

    const emptyState = getByTestId('chart-empty-state');
    expect(emptyState.querySelector('style')).not.toBeNull();
    expect(
      getByTestId('chart-empty-state-line').parentElement?.getAttribute(
        'style',
      ),
    ).toContain('animation');
  });

  it('does not animate or inject a style when not loading', () => {
    const { getByTestId } = renderInChart({});

    const emptyState = getByTestId('chart-empty-state');
    expect(emptyState.querySelector('style')).toBeNull();
    expect(
      getByTestId('chart-empty-state-line').parentElement?.getAttribute(
        'style',
      ) ?? '',
    ).not.toContain('animation');
  });
});
