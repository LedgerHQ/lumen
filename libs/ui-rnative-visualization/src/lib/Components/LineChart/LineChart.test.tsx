import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { LineChart } from './LineChart';

describe('LineChart', () => {
  it('renders the chart container', () => {
    const { getByTestId } = render(<LineChart series={[]} />);
    expect(getByTestId('line-chart')).toBeTruthy();
  });
});
