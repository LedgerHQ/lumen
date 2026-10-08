import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpotNumber } from './SpotNumber';

describe('SpotNumber', () => {
  it('should color the digit when fill is transparent', () => {
    const { container } = render(<SpotNumber appearance='success' value={5} />);

    expect(container.firstElementChild).toHaveClass('bg-muted-transparent');
    expect(screen.getByText('5')).toHaveClass('heading-5', 'text-success');
  });

  it('should paint the circle and a paired text color when fill is plain', () => {
    const { container } = render(
      <SpotNumber appearance='success' fill='plain' value={5} />,
    );

    expect(container.firstElementChild).toHaveClass('bg-success');
    expect(screen.getByText('5')).toHaveClass(
      'heading-5',
      'text-success-strong',
    );
  });

  it('should use the disabled text color', () => {
    render(<SpotNumber disabled value={5} />);

    expect(screen.getByText('5')).toHaveClass('text-disabled');
  });
});
