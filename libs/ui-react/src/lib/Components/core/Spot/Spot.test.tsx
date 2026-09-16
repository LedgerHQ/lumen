import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IconSize } from '../../symbols/Icon/types';
import { Spot } from './Spot';

const TestIcon = ({ size }: { size?: IconSize; className?: string }) => (
  <svg aria-label='Test icon' width={size} />
);

describe('Spot', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render an icon without forwarding the icon prop to the DOM', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(<Spot appearance='icon' icon={TestIcon} />);

    expect(screen.getByLabelText('Test icon')).toHaveAttribute('width', '20');
    expect(
      consoleErrorSpy.mock.calls.some((call) =>
        call.some(
          (argument) =>
            typeof argument === 'string' &&
            argument.includes('Invalid value for prop'),
        ),
      ),
    ).toBe(false);
  });

  it('should render a number without forwarding the number prop to the DOM', () => {
    const { container } = render(<Spot appearance='number' number={5} />);

    expect(screen.getByText('5')).toBeVisible();
    expect(container.firstElementChild).not.toHaveAttribute('number');
  });
});
