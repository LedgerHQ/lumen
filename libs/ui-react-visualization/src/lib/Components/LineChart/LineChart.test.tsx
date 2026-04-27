import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LineChart } from './LineChart';

const sampleSeries = [
  {
    id: 'test',
    stroke: '#000',
    data: [10, 20, 30, 40, 50],
  },
];

describe('LineChart', () => {
  it('renders an svg element', () => {
    const { container } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders a path for each series', () => {
    const { container } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(1);
  });

  it('renders XAxis when showXAxis is true', () => {
    const { container } = render(
      <LineChart
        series={sampleSeries}
        width={400}
        height={200}
        showXAxis
        xAxis={{ showLine: true }}
      />,
    );
    const axis = container.querySelector('[data-testid="x-axis"]');
    expect(axis).toBeTruthy();
  });

  it('does not render XAxis when showXAxis is false', () => {
    const { container } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    const axis = container.querySelector('[data-testid="x-axis"]');
    expect(axis).toBeNull();
  });

  it('renders with no series', () => {
    const { container } = render(<LineChart width={400} height={200} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders area fill when showArea is true', () => {
    const { container } = render(
      <LineChart series={sampleSeries} width={400} height={200} showArea />,
    );
    const paths = container.querySelectorAll('path');
    // 1 area path + 1 line path = 2
    expect(paths.length).toBe(2);
    const gradients = container.querySelectorAll('linearGradient');
    expect(gradients.length).toBe(1);
  });

  it('does not render area fill when showArea is false', () => {
    const { container } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    const gradients = container.querySelectorAll('linearGradient');
    expect(gradients.length).toBe(0);
  });
});
