import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LineChart } from './LineChart';

describe('LineChart', () => {
  it('renders an svg element', () => {
    const { container } = render(<LineChart series={[]} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
