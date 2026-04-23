import { describe, it, expect, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { LineChart } from './LineChart';

jest.mock('@ledgerhq/lumen-ui-rnative/styles', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        border: { muted: '#666', mutedSubtle: '#ccc' },
        text: { muted: '#999' },
      },
    },
    colorScheme: 'light',
  }),
}));

const sampleSeries = [
  {
    id: 'test',
    stroke: '#000',
    data: [10, 20, 30, 40, 50],
  },
];

describe('LineChart', () => {
  it('renders the chart container', () => {
    const { getByRole } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    expect(getByRole('image')).toBeTruthy();
  });

  it('renders an Svg element', () => {
    const { UNSAFE_getByType } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    const svg = UNSAFE_getByType('Svg' as any);
    expect(svg).toBeTruthy();
  });

  it('renders a Path for each series', () => {
    const { UNSAFE_getAllByType } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    const paths = UNSAFE_getAllByType('Path' as any);
    expect(paths.length).toBe(1);
  });

  it('renders with no series', () => {
    const { getByRole } = render(<LineChart width={400} height={200} />);
    expect(getByRole('image')).toBeTruthy();
  });

  it('renders area fill when showArea is true', () => {
    const { UNSAFE_getAllByType } = render(
      <LineChart series={sampleSeries} width={400} height={200} showArea />,
    );
    const paths = UNSAFE_getAllByType('Path' as any);
    expect(paths.length).toBe(2);
    const gradients = UNSAFE_getAllByType('LinearGradient' as any);
    expect(gradients.length).toBe(1);
  });

  it('does not render area fill when showArea is false', () => {
    const { UNSAFE_queryAllByType } = render(
      <LineChart series={sampleSeries} width={400} height={200} />,
    );
    const gradients = UNSAFE_queryAllByType('LinearGradient' as any);
    expect(gradients.length).toBe(0);
  });
});
