import { describe, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';

import { CartesianChart } from '../../CartesianChart';
import { LineChartEmptyState } from './LineChartEmptyState';
import type { LineChartEmptyStateProps } from './types';

const renderInChart = (props: LineChartEmptyStateProps) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      <CartesianChart series={[]} width={400} height={200}>
        <LineChartEmptyState {...props} />
      </CartesianChart>
    </ThemeProvider>,
  );
};

describe('LineChartEmptyState', () => {
  it('renders the placeholder line', () => {
    const { getByTestId } = renderInChart({});

    getByTestId('chart-empty-state-line');
  });

  it('renders the grid lines', () => {
    const { getByTestId } = renderInChart({});

    getByTestId('chart-empty-state-grid');
  });

  it('renders the placeholder while loading', () => {
    const { getByTestId } = renderInChart({ loading: true });

    getByTestId('chart-empty-state');
    getByTestId('chart-empty-state-line');
  });
});
