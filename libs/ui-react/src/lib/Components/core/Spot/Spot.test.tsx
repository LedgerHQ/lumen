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

    render(<Spot icon={TestIcon} />);

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

  it('should paint only the icon when fill is transparent', () => {
    const { container } = render(<Spot appearance='success' icon={TestIcon} />);

    expect(container.firstElementChild).toHaveClass(
      'bg-muted-transparent',
      'text-success',
    );
    expect(container.firstElementChild).not.toHaveClass('bg-success');
  });

  it('should paint the circle and a paired text color when fill is plain', () => {
    const { container } = render(
      <Spot appearance='success' fill='plain' icon={TestIcon} />,
    );

    expect(container.firstElementChild).toHaveClass(
      'bg-success',
      'text-success-strong',
    );
  });
});
