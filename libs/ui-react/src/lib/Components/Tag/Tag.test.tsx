import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { IconSize } from '../Icon/types';
import { Tag } from './Tag';

describe('Tag', () => {
  it('should render without an icon', () => {
    render(<Tag label='Label' />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('should render the icon component when icon prop is provided', () => {
    const Icon = vi.fn(({ size }: { size?: IconSize }) => (
      <svg data-testid='tag-icon' data-size={size} />
    ));
    render(<Tag label='Label' icon={Icon} />);
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
  });

  it('should inject size=16 into the icon when tag size is md', () => {
    const Icon = vi.fn(({ size }: { size?: IconSize }) => (
      <svg data-testid='tag-icon' data-size={size} />
    ));
    render(<Tag label='Label' size='md' icon={Icon} />);
    expect(screen.getByTestId('tag-icon')).toHaveAttribute('data-size', '16');
  });

  it('should inject size=12 into the icon when tag size is sm', () => {
    const Icon = vi.fn(({ size }: { size?: IconSize }) => (
      <svg data-testid='tag-icon' data-size={size} />
    ));
    render(<Tag label='Label' size='sm' icon={Icon} />);
    expect(screen.getByTestId('tag-icon')).toHaveAttribute('data-size', '12');
  });
});
