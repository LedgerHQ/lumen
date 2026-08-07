import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import { Divider } from './Divider';

describe('Divider Component', () => {
  it('should render with horizontal orientation by default', () => {
    const { container } = render(<Divider />);
    const dividerElement = container.querySelector('[role="separator"]');
    expect(dividerElement).toBeInTheDocument();
    expect(dividerElement).toHaveAttribute('aria-orientation', 'horizontal');
    expect(dividerElement).toHaveClass(
      'w-full',
      'border-t',
      'border-muted-subtle',
    );
  });

  it('should render with vertical orientation', () => {
    const { container } = render(<Divider orientation='vertical' />);
    const dividerElement = container.querySelector('[role="separator"]');
    expect(dividerElement).toBeInTheDocument();
    expect(dividerElement).toHaveAttribute('aria-orientation', 'vertical');
    expect(dividerElement).toHaveClass(
      'h-full',
      'border-l',
      'border-muted-subtle',
    );
  });

  it('should apply custom className', () => {
    const { container } = render(<Divider className='my-16' />);
    const dividerElement = container.querySelector('[role="separator"]');
    expect(dividerElement).toHaveClass('my-16');
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Divider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should have proper accessibility attributes', () => {
    const { container } = render(<Divider />);
    const dividerElement = container.querySelector('[role="separator"]');
    expect(dividerElement).toHaveAttribute('role', 'separator');
    expect(dividerElement).toHaveAttribute('aria-orientation');
  });

  it('should pass through additional HTML attributes', () => {
    const { container } = render(<Divider data-testid='custom-divider' />);
    const dividerElement = container.querySelector(
      '[data-testid="custom-divider"]',
    );
    expect(dividerElement).toBeInTheDocument();
  });
});
